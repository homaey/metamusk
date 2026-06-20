# NovaWallet — Launch Readiness (Telegram Mini App)

Honest assessment of what exists vs. what's required to launch a **wallet holding real user funds**
on Telegram. Legend: ✅ done · 🟡 partial · ⛔ not started · 🔴 blocker for real-funds launch.

## 0. The one non-negotiable
🔴 **A third-party security audit is mandatory before real funds.** This is a self-custodial wallet:
a bug in key derivation, vault encryption, or signing can permanently lose user funds. The crypto core
is tested against official vectors (BIP39/BIP84/SLIP-0010, sign→recover), but that is *not* a substitute
for an external audit (e.g. Trail of Bits, Cure53, OpenZeppelin, Halborn) + a bug bounty. **Do not promote
to mainnet real-money users until this is done.** Until then, ship as testnet-only or clearly-labeled beta.

## 1. Your three questions, answered
| Question | Status | Notes |
|---|---|---|
| Are nodes connected to the networks? | 🟡 | Connected & working via **public RPCs**. Replace with **dedicated keyed RPC providers** for production (rate limits, reliability). We run no nodes — we use RPC endpoints. |
| Does it have DeFi? | ⛔ | No swap/bridge/stake/lend yet. Swap/History buttons are placeholders. Highest-value next feature: **swap** (TON DEX + EVM aggregator). |
| What else is needed to launch? | — | See §2–§9 below. |

## 2. Telegram integration (to actually run *in* Telegram)
- ✅ Mini App shell, theme vars, haptics, dynamic SDK load
- ✅ `initData` HMAC verification (server-side, tested) — but currently dev-bypassed locally
- ⛔ Register bot via **@BotFather** → get bot token → set Mini App URL (`/setmenubutton` or Web App)
- 🔴 Set `TELEGRAM_BOT_TOKEN` on the server and **turn `DEV_SKIP_INITDATA` OFF** (enforced by `assertProdConfig`)
- ⛔ Test inside real Telegram on iOS / Android / Desktop (WebView quirks differ)
- 🟡 Telegram Main/Back button wiring (haptics done; Main/Back button bindings to add per-screen)

## 3. Hosting & deployment
- ⛔ Frontend: build static + serve over **HTTPS** (Vercel / Netlify / Cloudflare Pages). Telegram requires HTTPS.
- ⛔ Backend: deploy Fastify over HTTPS (Railway / Render / Fly.io / VPS). See `Dockerfile`s + `docker-compose.yml`.
- ⛔ Domain + TLS cert; set `CORS_ORIGINS` to the Mini App origin; HSTS.
- ⛔ CI deploy pipeline (CI tests exist; add a deploy job).
- 🟡 `.env.production.example` added — fill real secrets via a secrets manager (never commit).

## 4. Production infrastructure
- ⛔ **Dedicated RPC providers** with keys (EVM ×7, Solana, TON, Bitcoin) — replace public defaults in `config.RPC`
- ⛔ **Paid price feed** (CoinGecko Pro or similar) — free tier will rate-limit at scale
- 🟡 PostgreSQL — data model designed (`docs/03`), **not wired** yet. Needed for: watch-only, address book,
  notifications, referrals, premium. (MVP can launch without it since custody is client-side.)
- ⛔ Redis — caching/rate-limit store (rate-limit currently in-memory)
- ⛔ Monitoring: Sentry (errors), uptime, structured log aggregation, alerting
- ⛔ Indexer/queue (BullMQ) for tx history + notifications

## 5. Security hardening (beyond the audit)
- ✅ Vault: Argon2id + AES-256-GCM; keys never leave client; `zeroize`
- ✅ Risk engine (address validation, poisoning, first-time, contract, network mismatch)
- ✅ Log redaction; `assertProdConfig` blocks dev-skip in prod; rate limiting; security headers
- 🟡 **CSP** — add a strict Content-Security-Policy at the edge/host (lock script/connect/img/frame)
- ⛔ Transaction **simulation** before signing (preview balance/allowance changes)
- ⛔ Phishing domain list; approval scanner + revoke tool; spam-token/NFT filtering
- ⛔ Penetration test; bug-bounty program; incident response plan

## 6. Core wallet features still missing
- 🟡 **Send**: EVM operational (backend prepare/broadcast, client signs). TON/Solana/Bitcoin **not yet** routed through backend.
- ⛔ **Transaction history** (per account/chain) + pending status
- ⛔ **DeFi — Swap** (TON: STON.fi/DeDust; EVM: 1inch/0x/LI.FI), price impact, slippage, MEV protection
- ⛔ **Bridge** (vetted providers only), **Staking/Earn** (TON staking, ETH LST)
- ⛔ **dApp connectivity**: TON Connect + WalletConnect, sessions, approvals
- ⛔ **NFT** view/transfer/spam-filter
- ⛔ Multi-account create/switch; **private-key & seed import/export** (export behind strong confirmation)
- ⛔ Token import by contract; address book; ENS / TON DNS resolution
- ⛔ Token balances included in the **hero total** (currently native-only total; per-network asset list is done)

## 7. UX / performance
- 🟡 Bundle ~1 MB (303 KB gz) — **code-split** (lazy-load chains providers/screens) for Telegram WebView cold start
- ⛔ Onboarding education cards; empty/error states polish; accessibility pass
- ✅ 12 languages + RTL; network dropdown; logos; skeletons

## 8. Legal / compliance (required for a financial app)
- ⛔ **Terms of Service**, **Privacy Policy**, **Risk Disclosure**, "no financial advice" disclaimer — written & linked in-app
- ⛔ Region gating for regulated features (swap/stake/perps) where required; sanctions screening if applicable
- ⛔ Age gating if required; clear self-custody-responsibility copy (partly in onboarding)
- ⛔ Telegram Stars / payments terms if monetizing premium

## 9. Recommended launch path (lowest risk → market)
1. **Testnet beta** in Telegram (real Mini App, testnet RPCs, "BETA — testnet only" banner). Validates UX + Telegram integration with zero fund risk.
2. **Security audit** of the crypto core + backend while beta runs.
3. **Swap** (the killer DeFi feature for Telegram) + complete Send for all chains.
4. Dedicated RPC/price providers, Sentry/monitoring, CSP, legal docs.
5. **Mainnet launch** post-audit, gradual rollout, bug bounty live.

---

### What's genuinely production-ready today
Crypto core (vault/derivation/signing, vector-tested), Telegram `initData` verification, 11-network
support with a network selector + logos, live native + token balances with USD values, EVM send
(non-custodial via backend), risk engine, i18n/RTL, ErrorBoundary, ESLint + CI, 0 audit vulns.

### What blocks a real-money launch
Security audit (🔴), DeFi/swap, full send coverage, dedicated infra (RPC/price/DB/monitoring), hosting +
bot registration, legal docs, CSP + pen-test.
