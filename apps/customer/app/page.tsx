'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchProducts } from '../lib/api';
import { useSession } from 'next-auth/react';
import { useStore } from '../components/store-provider';

export default function HomePage() {
  const { data: session } = useSession();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const token = (session as any)?.accessToken as string | undefined;

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(token),
    enabled: Boolean(token),
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(token),
    enabled: Boolean(token),
  });

  if (!token) {
    return (
      <div className="space-y-4">
        <p className="text-lg">Please authenticate to view the store.</p>
        <a className="text-brand underline" href="/auth">
          Login via OTP
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold">Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories?.map((category: any) => (
            <article key={category.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-semibold">{category.name}</p>
              <p className="text-sm text-slate-500">{category.products.length} items</p>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Popular Products</h2>
        <div className="space-y-3">
          {products?.map((product: any) => (
            <article key={product.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-slate-500">₹{(product.priceInPaisa / 100).toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={`rounded border px-3 py-1 text-sm ${wishlist.includes(product.id) ? 'border-brand text-brand' : 'border-slate-200 text-slate-500'}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  ❤
                </button>
                <button
                  className="rounded bg-brand px-3 py-1 text-sm font-semibold text-white"
                  onClick={() => addToCart({ productId: product.id, name: product.name, priceInPaisa: product.priceInPaisa, quantity: 1 })}
                >
                  Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
