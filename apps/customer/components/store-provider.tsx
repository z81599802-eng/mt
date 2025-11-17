'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  priceInPaisa: number;
  quantity: number;
}

interface StoreContextShape {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
}

const StoreContext = createContext<StoreContextShape | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const cartData = localStorage.getItem('mt_cart');
    const wishlistData = localStorage.getItem('mt_wishlist');
    if (cartData) setCart(JSON.parse(cartData));
    if (wishlistData) setWishlist(JSON.parse(wishlistData));
  }, []);

  useEffect(() => {
    localStorage.setItem('mt_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mt_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const value = useMemo<StoreContextShape>(() => ({
    cart,
    wishlist,
    addToCart: (item) => {
      setCart((prev) => {
        const existing = prev.find((p) => p.productId === item.productId);
        if (existing) {
          return prev.map((p) => (p.productId === item.productId ? { ...p, quantity: p.quantity + item.quantity } : p));
        }
        return [...prev, item];
      });
    },
    removeFromCart: (productId) => setCart((prev) => prev.filter((item) => item.productId !== productId)),
    toggleWishlist: (productId) =>
      setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId])),
  }), [cart, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
