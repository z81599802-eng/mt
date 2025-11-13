'use client';

import Link from 'next/link';
import { Home, Heart, ShoppingCart, Layers, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: Layers },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 border-t border-slate-200 bg-white">
      <ul className="flex items-center justify-between px-2 py-3 text-xs">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                className={`flex flex-col items-center rounded-full px-3 py-1 ${active ? 'text-brand' : 'text-slate-500'}`}
                href={item.href}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
