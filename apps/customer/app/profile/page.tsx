'use client';

import { useSession, signOut } from 'next-auth/react';
import { useStore } from '../../components/store-provider';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { cart, wishlist } = useStore();

  if (!session) {
    return (
      <div>
        <p>Please login.</p>
        <a className="text-brand underline" href="/auth">
          Login
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="rounded border border-slate-200 bg-white p-4">
        <p className="font-semibold">{session.user?.name}</p>
        <p className="text-sm text-slate-500">Role: {(session as any).role}</p>
      </div>
      <div className="rounded border border-slate-200 bg-white p-4">
        <p className="text-sm">Cart items: {cart.length}</p>
        <p className="text-sm">Wishlist items: {wishlist.length}</p>
      </div>
      <button className="rounded bg-red-600 px-4 py-2 font-semibold text-white" onClick={() => signOut({ callbackUrl: '/' })}>
        Logout
      </button>
    </div>
  );
}
