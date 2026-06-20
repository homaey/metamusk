# NovaWallet — Development Roadmap & Test Plan

## Phase 1 — MVP foundation (in progress)
**Goal:** a Telegram Mini App that creates/imports a backed-up wallet, shows balances, sends/receives
on TON + one EVM chain, with encrypted local custody and basic risk warnings.

- [x] Monorepo + planning deliverables (this docs set)
- [x] `@nova/wallet-core`: vault (Argon2id + AES-256-GCM), BIP39/32, accounts, zeroize — **tested**
- [x] `@nova/telegram-auth`: server-side initData verification — **tested**
- [x] `@nova/chains`: TON (ed25519/SLIP-0010) + EVM (viem) derivation, providers, signers — **tested**
- [ ] `apps/api`: Fastify shell, `/auth/session`, profile + metadata routes, rate limiting
- [x] `apps/miniapp`: Telegram shell (theme, haptics, dynamic SDK load), onboarding,
      create/import + **mandatory backup quiz**, PIN unlock + auto-lock, encrypted IndexedDB vault,
      home with real multichain addresses, Receive sheet + QR — **verified end-to-end in browser**
- [x] Send flow (build → review → **risk assessment** → local sign → broadcast) — **verified in browser**
- [x] Risk engine: address validation per family + red/yellow/green (invalid address, poisoning,
      first-time recipient, contract recipient, self-send, network mismatch) — **tested (8)**
- [x] Error boundary, honest messaging (no false "signed" claims)
- [x] Project infra: ESLint (flat config) + GitHub Actions CI (typecheck/lint/test/build/audit)
- [x] **Live balances + fiat prices** — API proxies CoinGecko (prices) + public RPCs (balances) for
      all 11 networks; Home shows total net worth + per-account balance/fiat with skeletons — **verified
      with real data** (curl: 5.69 ETH, 57.21 BTC, 1550 SOL)
- [ ] Make Send broadcast work without client RPC: backend `/v1/evm/prepare` (nonce+fees) + `/v1/broadcast`
      proxy (client still signs locally — keeps non-custody)
- [ ] Multi-account create/switch; private-key import/export; transaction history; code-splitting

## Phase 2 — Web3 wallet
Multi-chain + custom RPC, token import + spam detection, swaps (aggregator), TON Connect,
WalletConnect, dApp sessions, NFT viewer, approval scanner + revoke.

## Phase 3 — Advanced (MetaMask-like)
Bridge (vetted providers), staking/earn, portfolio analytics + P/L + watch-only,
tx simulation, phishing detection, smart-tx protection, advanced gas controls, audit checklist.

## Phase 4 — Growth & monetization
Referrals, points, premium analytics, Telegram Stars subscription, price/tx push notifications,
community features.

## Compliance gates (cross-phase)
Perps, prediction markets, tokenized stocks, RWAs, card/spend ship **disabled by default**, behind
region gating + legal review + risk disclosures.

---

## Test plan
**Unit (critical first):**
- vault round-trip, wrong-PIN rejection, ciphertext tamper rejection, KDF determinism
- BIP39/BIP32 against official test vectors; address derivation per chain
- risk heuristics (poisoning, unlimited approval, spam token)

**Integration:**
- initData verification: valid / expired / forged / replayed
- send flow: build → simulate → sign (local) → broadcast (mocked RPC) → status
- swap/bridge build returns unsigned tx; client signs; broadcast

**E2E (Telegram WebView):**
- onboarding + mandatory backup confirmation
- unlock + auto-lock
- send/receive on testnet (TON testnet + EVM testnet)

**Security/abuse:**
- attempt to exfiltrate key material via any API (must be impossible by construction)
- rate-limit + input-validation fuzzing
- CSP / header checks

**CI gates:** typecheck, lint, unit+integration green, `npm audit` (no critical), build.
