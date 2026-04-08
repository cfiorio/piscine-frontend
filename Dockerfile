# ─── Stage 1 : build ────────────────────────────────────────────────────────
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# BASE_HREF est injecté à la construction (ex: /new/ ou /)
ARG BASE_HREF=/new/
RUN npm run build -- --base-href "$BASE_HREF"

# ─── Stage 2 : production ───────────────────────────────────────────────────
FROM node:lts-alpine AS production

ENV NODE_ENV=production
ENV PORT=4000
WORKDIR /app

COPY --from=builder /app/dist/piscine-front/server ./server
COPY --from=builder /app/dist/piscine-front/browser ./browser

EXPOSE 4000

USER node

CMD ["node", "server/server.mjs"]
