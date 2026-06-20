# NovaWallet Mini App (static). Build context = repo root:
#   docker build -f apps/miniapp/Dockerfile --build-arg VITE_API_BASE_URL=https://api.example.com -t nova-miniapp .
FROM node:20-slim AS build
WORKDIR /app
# VITE_* values are inlined at build time, so they must be passed as build args.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY . .
RUN npm ci \
 && npm run build -w @nova/wallet-core -w @nova/telegram-auth -w @nova/chains \
 && npm run build -w @nova/miniapp

FROM nginx:alpine AS run
COPY --from=build /app/apps/miniapp/dist /usr/share/nginx/html
COPY apps/miniapp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
