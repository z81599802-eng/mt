# Mubarak Tabarak API

## Setup

```bash
cd server
npm install
npm run dev
```

- Copy `.env.example` to `.env` and fill secrets.
- Run `npx prisma migrate dev` to create schema.
- Seed optional data via `npx tsx prisma/seed.ts`.
- `npm test` executes Jest + Supertest suite.
