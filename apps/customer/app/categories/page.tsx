'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../lib/api';
import { useStore } from '../../components/store-provider';

export default function CategoriesPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const { wishlist, toggleWishlist } = useStore();

  const { data: categories } = useQuery({
    queryKey: ['categories-page'],
    queryFn: () => fetchCategories(token),
    enabled: Boolean(token),
  });

  if (!token) {
    return <p>Please login first.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Categories</h1>
      {categories?.map((category: any) => (
        <article key={category.id} className="rounded border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{category.name}</p>
              <p className="text-sm text-slate-500">{category.products.length} products</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            {category.products.map((product: any) => (
              <div key={product.id} className="flex items-center justify-between rounded border border-slate-100 p-2">
                <div>
                  <p>{product.name}</p>
                  <p className="text-xs text-slate-500">₹{(product.priceInPaisa / 100).toFixed(2)}</p>
                </div>
                <button
                  className={`text-xs ${wishlist.includes(product.id) ? 'text-brand' : 'text-slate-500'}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  {wishlist.includes(product.id) ? 'Wishlisted' : 'Wishlist'}
                </button>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
