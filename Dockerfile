FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN apk add openssl1.1-compat
WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma
RUN yarn install
RUN yarn prisma generate

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN yarn run build

FROM node:18-alpine AS runner
RUN apk add openssl1.1-compat
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/config ./config
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

CMD ["yarn", "run", "start"]