# NovaWallet — API Specification (v0, Fastify)

All requests carry the Telegram auth header. Server verifies it on every authenticated route.

```
Authorization: tma <raw initData string>
```
Server runs `@nova/telegram-auth` verification → resolves `TelegramUser` → attaches to request.
Reject 401 on missing/expired/forged initData.

Conventions: JSON; zod-validated bodies; cursor pagination (`?cursor=&limit=`); errors as
`{ error: { code, message, hint } }` (message is user-safe, hint is actionable).

## Auth / profile
| Method | Path | Purpose |
|---|---|---|
| POST | `/v1/auth/session` | Verify initData, upsert user, return profile + feature flags |
| GET  | `/v1/me` | Current user profile + prefs |
| PATCH| `/v1/me/prefs` | Update language, notification prefs |

## Wallet metadata (NO keys)
| Method | Path | Purpose |
|---|---|---|
| GET  | `/v1/wallets` | List wallet profiles + accounts (metadata) |
| POST | `/v1/wallets` | Create wallet profile (label, vault_ref) |
| POST | `/v1/wallets/:id/accounts` | Register a derived account (index, chain, address, label) |
| PATCH| `/v1/accounts/:id` | Rename / hide / unhide |
| POST | `/v1/watch` | Add watch-only public address |

## Networks & tokens
| GET  | `/v1/networks` | Supported + custom networks |
| POST | `/v1/networks` | Add custom RPC (validated) |
| GET  | `/v1/tokens?network=` | Token list (builtin + autodetect) |
| POST | `/v1/tokens/import` | Import token by contract address |
| PATCH| `/v1/tokens/:id/state` | hide / favorite |

## Read-path data (server proxies RPC/price/index)
| GET  | `/v1/balances?account=&network=` | Native + token balances + fiat |
| GET  | `/v1/nfts?account=&network=` | NFT assets + metadata |
| GET  | `/v1/transactions?account=&network=&cursor=` | History (paginated) |
| GET  | `/v1/prices?ids=` | Token prices + 24h |
| GET  | `/v1/portfolio` | Aggregated net worth, allocations |

## Swap / bridge (build unsigned tx; client signs)
| GET  | `/v1/swap/quote` | Aggregated quotes (multi-DEX), slippage, price impact |
| POST | `/v1/swap/build` | Build **unsigned** swap tx |
| GET  | `/v1/bridge/quote` | Bridge quotes (vetted providers), fee + ETA |
| POST | `/v1/bridge/build` | Build **unsigned** bridge tx |
| GET  | `/v1/bridge/status?id=` | Track cross-chain status |

## Risk
| POST | `/v1/risk/tx` | Scan an unsigned tx → severity + reasons + simulated diffs |
| POST | `/v1/risk/address` | Scan recipient (poisoning, sanctions, first-time) |
| GET  | `/v1/approvals?account=` | List allowances for revoke tool |

## dApp sessions
| GET  | `/v1/sessions` | Connected dApps |
| POST | `/v1/sessions` | Record new WalletConnect/TON Connect session |
| DELETE | `/v1/sessions/:id` | Disconnect / revoke |

## Notifications / growth
| GET/PATCH | `/v1/notifications/prefs` | Manage prefs |
| POST | `/v1/referrals` | Create/redeem referral code |
| POST | `/v1/subscription/stars` | Create Telegram Stars invoice for premium |

### Hard rules
- No endpoint accepts or returns a seed phrase, private key, or signature payload.
- `/swap/build` & `/bridge/build` return **unsigned** transactions only.
- Broadcast endpoint (if proxied) accepts an already-**signed** raw tx; it never signs.
