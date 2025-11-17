import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { QueryClientProvider } from '../components/query-client-provider';
import { AuthSessionProvider } from '../components/session-provider';

export const metadata: Metadata = {
  title: 'Mubarak Tabarak – Admin',
  description: 'Operational dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        <AuthSessionProvider>
          <QueryClientProvider>
            <div className="flex min-h-screen">
              <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 p-4 lg:flex">
                <p className="text-xl font-bold">Mubarak Tabarak</p>
                <nav className="mt-8 space-y-3 text-sm">
                  <a className="block rounded px-3 py-2 hover:bg-slate-800" href="/">
                    Dashboard
                  </a>
                  <a className="block rounded px-3 py-2 hover:bg-slate-800" href="/orders">
                    Orders
                  </a>
                  <a className="block rounded px-3 py-2 hover:bg-slate-800" href="/catalog">
                    Catalog
                  </a>
                </nav>
              </aside>
              <main className="flex-1 p-6">{children}</main>
            </div>
          </QueryClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
