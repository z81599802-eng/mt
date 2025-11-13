'use client';

import { useStore } from '../../components/store-provider';

export default function CartPage() {
  const { cart, removeFromCart } = useStore();
  const total = cart.reduce((sum, item) => sum + item.priceInPaisa * item.quantity, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Cart</h1>
      {cart.length === 0 && <p className="text-slate-500">Cart is empty.</p>}
      {cart.map((item) => (
        <article key={item.productId} className="flex items-center justify-between rounded border border-slate-200 bg-white p-4">
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-slate-500">Qty {item.quantity}</p>
          </div>
          <div className="text-right">
            <p>₹{((item.priceInPaisa * item.quantity) / 100).toFixed(2)}</p>
            <button className="text-xs text-red-600" onClick={() => removeFromCart(item.productId)}>
              Remove
            </button>
          </div>
        </article>
      ))}
      <div className="rounded border border-slate-200 bg-white p-4">
        <p className="text-lg font-semibold">Total: ₹{(total / 100).toFixed(2)}</p>
        <button className="mt-3 w-full rounded bg-brand px-4 py-2 font-semibold text-white">Checkout</button>
      </div>
    </div>
  );
}
