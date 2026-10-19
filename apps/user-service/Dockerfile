FROM node:22-alpine AS dependencies

WORKDIR /app
COPY package*.json ./
COPY apps ./apps
COPY packages ./packages
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S app && adduser -S -G app -u 10001 app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./
COPY apps/user-service ./apps/user-service
COPY packages ./packages
RUN npx prisma generate --schema apps/user-service/prisma/schema.prisma \
  && chown -R app:app /app

USER 10001:10001
EXPOSE 4002
CMD ["node_modules/.bin/tsx", "apps/user-service/src/index.ts"]
