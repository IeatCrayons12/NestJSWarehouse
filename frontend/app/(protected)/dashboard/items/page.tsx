'use client';
import { useState, useEffect, useCallback } from 'react';
import { itemsApi } from '../../../../lib/api';
import { Item, ItemFormData } from '../../../../lib/types';
import ItemForm from '../../../../components/ItemForm';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try { const res = await itemsApi.list(); setItems(res.data); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleCreate = async (data: ItemFormData) => { await itemsApi.create(data); await fetchItems(); };
  const handleUpdate = async (data: ItemFormData) => { await itemsApi.update(editingItem!.id, data); await fetchItems(); };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    setDeletingId(id);
    try { await itemsApi.delete(id); setItems((p) => p.filter((i) => i.id !== id)); }
    finally { setDeletingId(null); }
  };

  const filtered = items.filter((item) =>
    [item.name, item.sku, item.category, item.location].filter(Boolean)
      .some((f) => f!.toLowerCase().includes(search.toLowerCase()))
  );

  const lowStock = items.filter((i) => i.quantity <= 5).length;
  const totalValue = items.reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text)' }}>
            Inventory
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
            {items.length} items total
            {lowStock > 0 && <span className="ml-2 font-semibold" style={{ color: 'var(--orange-dark)' }}>· {lowStock} low stock</span>}
          </p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          style={{ background: 'linear-gradient(135deg, #FF7A35, #FFB380)', color: 'white', boxShadow: '0 4px 16px rgba(255,122,53,0.3)' }}>
          + Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Items" value={items.length} icon="📦" />
        <StatCard label="Total Value" value={`฿${totalValue.toLocaleString()}`} icon="💰" />
        <StatCard label="Low Stock (≤5)" value={lowStock} icon="⚠️" warn={lowStock > 0} />
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, SKU, category, location…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
          style={{ background: 'var(--white)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl overflow-hidden shadow-sm" style={{ background: 'var(--white)', border: '1.5px solid var(--border)' }}>
        {loading ? (
          <div className="py-20 text-center" style={{ color: 'var(--text-soft)' }}>
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
              style={{ borderColor: 'var(--orange)', borderTopColor: 'transparent' }} />
            Loading items…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center" style={{ color: 'var(--text-soft)' }}>
            <div className="text-4xl mb-3">📭</div>
            {search ? 'No items match your search.' : 'No items yet. Add your first one!'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--orange-light)' }}>
              <tr>
                {['Name', 'SKU', 'Category', 'Qty', 'Price', 'Location', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-widest"
                    style={{ color: 'var(--brown)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id}
                  className="transition-colors"
                  style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--white)' : 'var(--cream)' }}>
                  <td className="px-5 py-4 font-semibold" style={{ color: 'var(--text)' }}>
                    {item.name}
                    {item.description && <p className="text-xs font-normal truncate max-w-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>{item.description}</p>}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs" style={{ color: 'var(--text-soft)' }}>{item.sku || '—'}</td>
                  <td className="px-5 py-4">
                    {item.category
                      ? <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--orange-light)', color: 'var(--brown)' }}>{item.category}</span>
                      : <span style={{ color: 'var(--text-soft)' }}>—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-base" style={{ color: item.quantity <= 5 ? 'var(--orange-dark)' : 'var(--text)' }}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium" style={{ color: 'var(--text)' }}>
                    {item.price != null ? `฿${Number(item.price).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-soft)' }}>{item.location || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => { setEditingItem(item); setModalOpen(true); }}
                        className="text-xs px-3 py-1.5 rounded-xl font-medium transition-all hover:scale-105 cursor-pointer"
                        style={{ background: 'var(--orange-light)', color: 'var(--brown)', border: '1px solid var(--border)' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                        className="text-xs px-3 py-1.5 rounded-xl font-medium transition-all hover:scale-105 cursor-pointer disabled:opacity-40"
                        style={{ background: '#FFF0F0', color: '#CC3333', border: '1px solid #FFD0D0' }}>
                        {deletingId === item.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <ItemForm item={editingItem} onSubmit={editingItem ? handleUpdate : handleCreate} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, warn }: { label: string; value: string | number; icon: string; warn?: boolean }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
      style={{ background: warn ? '#FFF4F0' : 'var(--white)', border: `1.5px solid ${warn ? '#FFB380' : 'var(--border)'}` }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: warn ? 'linear-gradient(135deg, #FF7A35, #FFB380)' : 'var(--orange-light)' }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-soft)' }}>{label}</p>
        <p className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: warn ? 'var(--orange-dark)' : 'var(--text)' }}>
          {value}
        </p>
      </div>
    </div>
  );
}
