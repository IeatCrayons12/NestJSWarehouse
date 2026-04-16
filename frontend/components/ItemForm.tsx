'use client';
import { useState, useEffect } from 'react';
import { Item, ItemFormData } from '../lib/types';

interface Props {
  item?: Item | null;
  onSubmit: (data: ItemFormData) => Promise<void>;
  onClose: () => void;
}

const empty: ItemFormData = { name: '', description: '', sku: '', category: '', quantity: 0, price: undefined, location: '' };

export default function ItemForm({ item, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<ItemFormData>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(item
      ? { name: item.name, description: item.description || '', sku: item.sku || '', category: item.category || '', quantity: item.quantity, price: item.price, location: item.location || '' }
      : empty);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'quantity' || name === 'price' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    setSaving(true); setError('');
    try { await onSubmit(form); onClose(); }
    catch { setError('Failed to save. Try again.'); }
    finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all";
  const inputStyle = { background: 'var(--cream)', border: '1.5px solid var(--border)', color: 'var(--text)' };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(45,24,16,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden" style={{ background: 'var(--white)', border: '1.5px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ background: 'var(--orange-light)', borderBottom: '1.5px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF7A35, #FFB380)' }}>
              <span className="text-white text-sm">{item ? '✏️' : '+'}</span>
            </div>
            <h2 className="font-bold" style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text)' }}>
              {item ? 'Edit Item' : 'New Item'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:scale-110 cursor-pointer"
            style={{ background: 'var(--white)', color: 'var(--text-soft)' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-soft)' }}>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-soft)' }}>SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-soft)' }}>Category</label>
            <input name="category" value={form.category} onChange={handleChange} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-soft)' }}>Quantity</label>
            <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-soft)' }}>Price (฿)</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price ?? ''} onChange={handleChange} className={inputClass} style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-soft)' }}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Shelf A-3" className={inputClass} style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-soft)' }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className={`${inputClass} resize-none`} style={inputStyle} />
          </div>

          {error && (
            <div className="col-span-2 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: '#FFF0F0', color: '#CC3333', border: '1px solid #FFD0D0' }}>
              {error}
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition hover:scale-105 cursor-pointer"
              style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', color: 'var(--text-soft)' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #FF7A35, #FFB380)', color: 'white', boxShadow: '0 4px 12px rgba(255,122,53,0.3)' }}>
              {saving ? 'Saving…' : item ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
