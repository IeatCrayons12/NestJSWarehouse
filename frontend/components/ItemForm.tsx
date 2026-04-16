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
    setForm(item ? { name: item.name, description: item.description || '', sku: item.sku || '', category: item.category || '', quantity: item.quantity, price: item.price, location: item.location || '' } : empty);
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

  const field = (label: string, name: keyof ItemFormData, opts?: { type?: string; placeholder?: string; colSpan?: boolean }) => (
    <div className={opts?.colSpan ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input name={name} type={opts?.type || 'text'} value={form[name] as string ?? ''} onChange={handleChange}
        placeholder={opts?.placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">{item ? 'Edit Item' : 'New Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {field('Name *', 'name', { colSpan: true })}
          {field('SKU', 'sku')}
          {field('Category', 'category')}
          {field('Quantity', 'quantity', { type: 'number' })}
          {field('Price (฿)', 'price', { type: 'number' })}
          {field('Location', 'location', { placeholder: 'e.g. Shelf A-3', colSpan: true })}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer">
              {saving ? 'Saving…' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
