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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} items total
            {lowStock > 0 && <span className="ml-2 text-orange-500 font-medium">· {lowStock} low stock</span>}
          </p>
        </div>
        <button onClick={() => { setEditingItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer">
          + Add Item
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Items" value={items.length} icon="📦" />
        <StatCard label="Total Value" value={`฿${totalValue.toLocaleString()}`} icon="💰" />
        <StatCard label="Low Stock (≤5)" value={lowStock} icon="⚠️" warn={lowStock > 0} />
      </div>

      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, SKU, category, location…"
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            {search ? 'No items match your search.' : 'No items yet. Add your first one!'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'SKU', 'Category', 'Qty', 'Price', 'Location', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.name}
                    {item.description && <p className="text-xs text-gray-400 font-normal truncate max-w-xs">{item.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono">{item.sku || '—'}</td>
                  <td className="px-4 py-3">
                    {item.category ? <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{item.category}</span> : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${item.quantity <= 5 ? 'text-orange-500' : 'text-gray-800'}`}>{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.price != null ? `฿${Number(item.price).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{item.location || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => { setEditingItem(item); setModalOpen(true); }}
                        className="text-xs px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                        className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition disabled:opacity-40 cursor-pointer">
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
    <div className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${warn ? 'border-orange-200' : 'border-gray-200'}`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-xl font-bold ${warn ? 'text-orange-500' : 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  );
}
