import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { QueryClientProvider } from '../components/query-client-provider';
import { BottomNav } from '../components/navigation';
import { AuthSessionProvider } from '../components/session-provider';
import { PwaRegister } from '../components/pwa-register';
import { StoreProvider } from '../components/store-provider';

export const metadata: Metadata = {
  title: 'Mubarak Tabarak – Storefront',
  description: 'Local store ordering PWA',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AuthSessionProvider>
          <QueryClientProvider>
            <StoreProvider>
              <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
                <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                  <span className="text-lg font-bold text-brand">Mubarak Tabarak</span>
                  <button className="rounded-full border border-slate-200 p-2" aria-label="Profile">
                    <span className="text-sm">👤</span>
                  </button>
                </header>
                <main className="flex-1 p-4">
                  <PwaRegister />
                  {children}
                </main>
                <BottomNav />
              </div>
            </StoreProvider>
          </QueryClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
