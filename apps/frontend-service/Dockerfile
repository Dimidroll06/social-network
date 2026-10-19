FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN npm ci --no-audit --no-fund

ARG VITE_AUTH_SERVICE_URL=/api/auth
ARG VITE_USER_SERVICE_URL=/api/user
ARG VITE_FEED_SERVICE_URL=/api/feed
ENV VITE_AUTH_SERVICE_URL=$VITE_AUTH_SERVICE_URL
ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_FEED_SERVICE_URL=$VITE_FEED_SERVICE_URL

RUN npm run build --workspace=frontend-service

FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --chown=nginx:nginx apps/frontend-service/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx apps/frontend-service/proxy_params /etc/nginx/proxy_params
COPY --chown=nginx:nginx --from=build /app/apps/frontend-service/dist /usr/share/nginx/html
COPY --chown=nginx:nginx --from=build /app/node_modules/swagger-ui-dist/swagger-ui.css /usr/share/nginx/html/swagger/
COPY --chown=nginx:nginx --from=build /app/node_modules/swagger-ui-dist/swagger-ui-bundle.js /usr/share/nginx/html/swagger/
COPY --chown=nginx:nginx --from=build /app/node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js /usr/share/nginx/html/swagger/

EXPOSE 8080
