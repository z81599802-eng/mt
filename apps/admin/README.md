# Mubarak Tabarak Admin Dashboard

- Next.js 14 App Router + Tailwind + Recharts
- OTP based staff login restricted to ADMIN/CASHIER/OWNER roles
- React Query data fetching + Socket.io live updates

## Development

```bash
cd apps/admin
npm install
npm run dev
```

Environment variables:

- `NEXT_PUBLIC_API_URL` – Express API base
- `NEXT_PUBLIC_SOCKET_URL` – Socket.io origin
