FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* bun.lockb* ./
RUN npm install --production --ignore-scripts || true
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY package.json ./package.json
CMD ["node", "dist/server.js"]
