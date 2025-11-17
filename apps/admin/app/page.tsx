'use client';

import { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../lib/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { io, Socket } from 'socket.io-client';

export default function DashboardPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const { data: orders, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchOrders(token),
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (!token) return;
    let socket: Socket | undefined;
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000');
    socket.on('order:new', () => refetch());
    socket.on('order:payment', () => refetch());
    return () => {
      socket?.disconnect();
    };
  }, [token, refetch]);

  if (!token) {
    return (
      <div className="space-y-4">
        <p className="text-lg">Authenticate to access the dashboard.</p>
        <a className="text-brand underline" href="/auth">
          Staff Login
        </a>
      </div>
    );
  }

  const chartData = useMemo(() => {
    if (!orders) return [];
    return orders.map((order: any) => ({ date: new Date(order.createdAt).toLocaleDateString(), total: order.totalAmountPaisa / 100 }));
  }, [orders]);

  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + order.totalAmountPaisa, 0) ?? 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl bg-slate-800 p-4 shadow">
          <p className="text-sm text-slate-400">Total Orders</p>
          <p className="text-3xl font-bold">{orders?.length ?? 0}</p>
        </article>
        <article className="rounded-xl bg-slate-800 p-4 shadow">
          <p className="text-sm text-slate-400">Revenue</p>
          <p className="text-3xl font-bold">₹{(totalRevenue / 100).toFixed(2)}</p>
        </article>
        <article className="rounded-xl bg-slate-800 p-4 shadow">
          <p className="text-sm text-slate-400">Pending Payments</p>
          <p className="text-3xl font-bold">{orders?.filter((order: any) => order.paymentStatus !== 'PAID').length ?? 0}</p>
        </article>
      </section>
      <section className="rounded-xl bg-slate-800 p-4">
        <h2 className="mb-4 text-xl font-semibold">Sales Trend</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
              <Area type="monotone" dataKey="total" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
