'use client';

import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProducts } from '../../lib/api';
import axios from 'axios';
import { useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function CatalogPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', unitType: '', priceInPaisa: 0, categoryId: '' });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(token),
    enabled: Boolean(token),
  });

  const createProduct = useMutation({
    mutationFn: async () => {
      await axios.post(
        `${apiBase}/products`,
        { ...form, priceInPaisa: Number(form.priceInPaisa) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setForm({ name: '', unitType: '', priceInPaisa: 0, categoryId: '' });
    },
  });

  if (!token) return <p>Login required.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Catalog</h1>
      <form
        className="grid gap-3 rounded-xl bg-slate-800 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          createProduct.mutate();
        }}
      >
        <input className="rounded border border-slate-700 bg-slate-900 p-2" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <input className="rounded border border-slate-700 bg-slate-900 p-2" placeholder="Unit type" value={form.unitType} onChange={(e) => setForm((f) => ({ ...f, unitType: e.target.value }))} />
        <input className="rounded border border-slate-700 bg-slate-900 p-2" type="number" placeholder="Price in paisa" value={form.priceInPaisa}
          onChange={(e) => setForm((f) => ({ ...f, priceInPaisa: Number(e.target.value) }))}
        />
        <input className="rounded border border-slate-700 bg-slate-900 p-2" placeholder="Category ID" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} />
        <button className="rounded bg-emerald-500 px-4 py-2 font-semibold text-black" type="submit">
          Create product
        </button>
      </form>
      <div className="rounded-xl bg-slate-800 p-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <ul className="mt-4 space-y-2">
          {products?.map((product: any) => (
            <li key={product.id} className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div>
                <p>{product.name}</p>
                <p className="text-xs text-slate-400">₹{(product.priceInPaisa / 100).toFixed(2)}</p>
              </div>
              <span className="text-xs uppercase text-slate-500">{product.unitType}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
