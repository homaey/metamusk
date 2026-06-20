# NovaWallet — Technical Architecture

## 1. High-level

```
            ┌─────────────────────────── Telegram client (WebView) ───────────────────────────┐
            │  apps/miniapp (Vite + React + TS)                                                │
            │  ┌───────────────┐   ┌──────────────────────────────────────────────┐           │
            │  │ Telegram SDK   │   │  @nova/wallet-core  (THE ONLY PLACE KEYS LIVE) │           │
            │  │ initData,       │   │  - vault: Argon2id + AES-256-GCM              │           │
            │  │ MainButton,     │   │  - bip39/bip32 derivation                    │           │
            │  │ haptics, theme  │   │  - signers (TON / EVM) [chains pkg]          │           │
            │  └───────┬─────────┘   └───────────────┬──────────────────────────────┘           │
            │          │ initData (signed)            │ unsigned tx in / signed tx out          │
            └──────────┼──────────────────────────────┼─────────────────────────────────────────┘
                       │ HTTPS (initData in header)    │ broadcast via RPC (can be direct or via API proxy)
                       ▼                                ▼
      ┌──────────────────────────────┐        ┌─────────────────────────────────────────┐
      │ apps/api (Fastify + TS)       │        │  RPC providers (TON / EVM)               │
      │  - verify initData (HMAC)     │        │  abstracted behind packages/chains       │
      │  - profile/metadata CRUD      │        └─────────────────────────────────────────┘
      │  - balance/price/nft proxy    │        ┌─────────────────────────────────────────┐
      │  - risk scoring               │───────▶│  Postgres (metadata only) + Redis (cache)│
      │  - notifications (bot)        │        └─────────────────────────────────────────┘
      └──────────────────────────────┘
```

**Golden rule:** arrows carrying key material exist only *inside* the client box. No private key,
seed, or decrypted vault ever crosses the HTTPS boundary.

## 2. Frontend stack
- **Vite + React + TypeScript** — SPA is ideal for a Telegram WebView (fast cold start, no SSR needed).
  (Next.js is fine too; we chose Vite for lighter footprint and simpler static hosting.)
- **@tma.js / @telegram-apps/sdk** for Mini App APIs (initData, MainButton, BackButton, HapticFeedback,
  theme params, viewport/fullscreen, CloudStorage).
- **Tailwind CSS** with Telegram theme variables mapped to CSS custom properties (`--tg-theme-*`).
- **Zustand** for wallet/session state; **TanStack Query** for server/RPC data.
- **viem** (EVM), **@ton/core + @ton/ton + TON Connect UI** (TON), **@solana/web3.js** (optional).
- **i18next** for EN/FA localization; `dir="rtl"` switching; logical CSS properties.

## 3. Backend stack
- **Fastify + TypeScript** (lightweight, schema-validated routes via `@fastify/type-provider`/zod).
  NestJS is an acceptable alternative if team prefers heavier DI/modules.
- **PostgreSQL** (Prisma or Drizzle ORM) — non-sensitive profile/metadata.
- **Redis** — caching, rate limiting (`@fastify/rate-limit`), nonce/session.
- **BullMQ** — indexing/notification jobs.
- **Provider abstraction** — `RpcProvider` interface with failover across multiple RPC vendors.
- **Risk service** — composes address/contract/approval scanners + phishing domain list.
- **Notification service** — Telegram Bot API for *non-sensitive* alerts only.

## 4. Package boundaries (enforced)
- `@nova/wallet-core` — **no** network imports, **no** DOM, isomorphic, audited deps only. Pure crypto.
- `@nova/telegram-auth` — server-only, no key material, pure verification.
- `@nova/chains` — provider + signer abstractions; depends on wallet-core for raw signing primitives.
- `apps/api` — may import telegram-auth and chains (read paths), **must not** import wallet-core signing.
- `apps/miniapp` — may import wallet-core, chains, ui.

## 5. Signing flow (every transaction)
1. UI builds an **unsigned** tx via `@nova/chains` (chain-specific builder).
2. **Simulate/estimate** (eth_call / TON emulator) → human-readable summary + gas.
3. **Risk scan** (address poisoning, contract, approval, phishing) → red/yellow/green.
4. User confirms on a large, legible review screen.
5. `@nova/wallet-core` decrypts the relevant key **in memory**, signs locally, **zeroizes**.
6. Broadcast (direct RPC or API proxy), track status, optional bot notification.

## 6. Environments & config
All config via env vars (see `.env.example`). Secrets via a secrets manager in prod
(never in the repo). HTTPS only. CSP + security headers at the edge and in Fastify.
