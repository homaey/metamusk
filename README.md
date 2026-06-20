# NovaWallet

A **non-custodial** crypto wallet delivered as a **Telegram Mini App**. TON-first, EVM-ready,
mobile-native UX. The server never sees seed phrases, private keys, or raw signing material —
all key material is generated, encrypted, and used client-side.

> `NovaWallet` is a placeholder brand name. The product is original and intentionally shares no
> branding, naming, iconography, color system, or copy with any existing wallet.

## Why this repo is structured the way it is

A self-custodial wallet's hardest, most dangerous code is the **key lifecycle**: generation,
encryption-at-rest, derivation, and signing. We build that first, in an isolated, audited-dependency
package (`@nova/wallet-core`) with tests, *before* any UI. The Telegram trust boundary
(`initData` verification in `@nova/telegram-auth`) is the second pillar. Everything else —
chains, swaps, bridges, NFTs, dApp connectivity — composes on top of those two foundations.

## Monorepo layout

```
wwwwallet/
├─ apps/
│  ├─ miniapp/          # Vite + React Telegram Mini App (client). Holds the only keys.
│  └─ api/              # Fastify backend. Profile + metadata only. NEVER key material.
├─ packages/
│  ├─ wallet-core/      # Crypto: vault (Argon2id + AES-256-GCM), BIP39/32, accounts. Isomorphic.
│  ├─ telegram-auth/    # Server-side Telegram initData HMAC validation.
│  ├─ chains/           # Chain abstraction: TON + EVM providers, signing, gas. (Phase 1+)
│  └─ ui/               # Shared design system primitives. (Phase 1+)
├─ docs/                # PRD, architecture, security model, data model, API spec, roadmap.
└─ package.json         # npm workspaces root
```

## Security non-negotiables (enforced by architecture, not convention)

- Seed phrases / private keys exist **only** in the client, **only** decrypted in memory while in use.
- At rest, the vault is encrypted with a key derived from the user PIN/passphrase via **Argon2id**,
  sealed with **AES-256-GCM** (authenticated). See [`docs/02-SECURITY.md`](docs/02-SECURITY.md).
- The backend stores **metadata only** (see [`docs/03-DATA-MODEL.md`](docs/03-DATA-MODEL.md)).
- Telegram `initData` is **verified server-side** on every authenticated request; client-provided
  user data is never trusted.
- No secret material is ever placed in Telegram Cloud Storage or `localStorage` in plaintext.

## Getting started

```bash
npm install
npm test            # runs wallet-core + telegram-auth test suites
```

## Build status / phase

This repo is being built in phases. See [`docs/05-ROADMAP.md`](docs/05-ROADMAP.md).
**Current: Phase 1 foundation** — security core + Telegram auth + planning deliverables landed.
