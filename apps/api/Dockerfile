# NovaWallet API (Fastify). Build context = repo root:
#   docker build -f apps/api/Dockerfile -t nova-api .
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY . .
# Install all workspaces, then build the library packages the API imports from dist/.
RUN npm ci && npm run build -w @nova/wallet-core -w @nova/telegram-auth -w @nova/chains

EXPOSE 8787
USER node
# The entrypoint runs the TS server via tsx (kept as a dependency for this).
CMD ["npm", "run", "start", "-w", "@nova/api"]
