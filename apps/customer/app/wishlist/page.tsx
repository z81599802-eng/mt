'use client';

import { useStore } from '../../components/store-provider';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useStore();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      {wishlist.length === 0 && <p className="text-slate-500">No favorite items yet.</p>}
      <ul className="space-y-3">
        {wishlist.map((productId) => (
          <li key={productId} className="flex items-center justify-between rounded border border-slate-200 bg-white p-3">
            <span>Product #{productId.slice(0, 6)}</span>
            <button className="text-xs text-red-600" onClick={() => toggleWishlist(productId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
