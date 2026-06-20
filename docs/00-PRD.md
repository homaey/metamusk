# NovaWallet — Product Requirements (condensed, actionable)

## 1. Problem & positioning
Telegram has hundreds of millions of users and a native crypto economy (TON). Existing
self-custody wallets are either (a) browser-extension-first and clumsy inside Telegram, or
(b) custodial bots masquerading as wallets. NovaWallet is a **genuinely non-custodial** wallet
that feels native to Telegram: opens instantly in the Mini App WebView, TON-first, but
multi-chain capable, with MetaMask-grade feature coverage and beginner-grade safety rails.

## 2. Principles
1. **Self-custody is real, not cosmetic.** If a flow would let the server reconstruct a key, it is rejected.
2. **Safety by default.** Risk labels (red/yellow/green), human-readable signing, approval scanning.
3. **Beginner-legible, expert-capable.** Simple home by default; Advanced Mode unlocks power tools.
4. **Telegram-native.** Main/Back buttons, haptics, theme variables, RTL, fast skeletons.
5. **Compliance-aware.** Regulated modules (perps, RWAs, cards) ship disabled, region-gated, post-review.

## 3. Personas
- **Newcomer (primary):** holds TON/USDT, wants send/receive/swap without losing funds.
- **Multichain power user:** EVM + TON, dApps, approvals, bridges, watch-only tracking.
- **Builder:** connects Mini Apps / dApps via TON Connect & WalletConnect.

## 4. Feature scope by release
Legend: ✅ in release · ◻️ later · 🔒 disabled-by-default (compliance gate)

| Capability | MVP (P1) | V1 (P2) | V2 (P3) | Growth (P4) |
|---|---|---|---|---|
| Create / import (seed, pk), multi-account, rename, hide | ✅ | | | |
| Encrypted local vault, PIN unlock, auto-lock | ✅ | | | |
| Passkey/biometric unlock | ◻️ | ✅ | | |
| TON + 1 EVM chain | ✅ | | | |
| Full EVM set + Solana (optional) + custom RPC | ◻️ | ✅ | | |
| Balances, fiat value, tx history | ✅ | | | |
| Send/receive, QR, address book, recipient warnings | ✅ | | | |
| Token auto-detect + manual import + spam detection | ◻️ | ✅ | | |
| Swaps (aggregator routing, slippage, price impact) | ◻️ | ✅ | | |
| TON Connect + WalletConnect, session mgmt | ◻️ | ✅ | | |
| NFT viewer + transfer + spam filter | ◻️ | ✅ | | |
| Approval scanner + revoke tool | ◻️ | ✅ | | |
| Bridge (vetted providers only) | ◻️ | ◻️ | ✅ | |
| Staking / earn (ETH LST, TON staking) | ◻️ | ◻️ | ✅ | |
| Portfolio analytics, P/L, watch-only | ◻️ | ◻️ | ✅ | |
| Tx simulation, phishing detection, smart-tx protection | ◻️ | ◻️ | ✅ | |
| Referrals, points, premium (Telegram Stars), alerts | ◻️ | ◻️ | ◻️ | ✅ |
| Perps, prediction mkts, tokenized stocks, RWAs, card | 🔒 | 🔒 | 🔒 | 🔒 |

## 5. Success metrics
- Activation: % of openers who complete a backed-up wallet creation.
- Retention: D7/D30 returning unlockers.
- Safety: % of risky transactions where the user was shown (and acknowledged) a warning.
- Self-custody integrity: **zero** key material reaching the backend (verified by audit + tests).

## 6. Out of scope (explicitly)
Server-side custody, "recover by Telegram login" without a real non-custodial recovery scheme,
seed phrases sent over bot messages, plaintext secrets in Cloud Storage.
