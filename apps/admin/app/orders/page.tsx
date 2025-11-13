'use client';

import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, markOrderPaid } from '../../lib/api';

export default function OrdersPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const queryClient = useQueryClient();

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchOrders(token),
    enabled: Boolean(token),
  });

  const markPaidMutation = useMutation({
    mutationFn: (orderId: string) => markOrderPaid(orderId, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  if (!token) {
    return <p>Login required.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="overflow-x-auto rounded-xl bg-slate-800 p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400">
              <th className="p-2">Ref</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Payment</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any) => (
              <tr key={order.id} className="border-t border-slate-700">
                <td className="p-2">{order.orderRef}</td>
                <td className="p-2">{order.user.phone}</td>
                <td className="p-2">₹{(order.totalAmountPaisa / 100).toFixed(2)}</td>
                <td className="p-2">{order.paymentStatus}</td>
                <td className="p-2">
                  {order.paymentStatus !== 'PAID' && (
                    <button
                      className="rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-black"
                      onClick={() => markPaidMutation.mutate(order.id)}
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
