# NovaWallet — Data Model (backend = metadata only)

> **Invariant:** no table stores seed phrases, private keys, decrypted vaults, or raw signing material.
> Public addresses and labels are the most sensitive things stored, and only for app functionality.

```
TelegramUser
  id (pk)                 uuid
  telegram_user_id        bigint  unique   -- from verified initData ONLY
  username                text    null
  language_code           text    null
  is_premium              bool
  created_at, last_seen_at

WalletProfile            -- app-level grouping; NOT custody
  id (pk)
  user_id  -> TelegramUser
  label                   text
  vault_ref               text    null   -- opaque pointer to client-encrypted blob location; NOT the blob
  created_at

Account                  -- derived account metadata (no keys)
  id (pk)
  wallet_id -> WalletProfile
  index                   int            -- derivation index
  chain_family            enum(ton, evm, solana, btc)
  address                 text
  label                   text
  hidden                  bool
  is_watch_only           bool

WatchAddress             -- public-address-only tracking
  id (pk)
  user_id -> TelegramUser
  chain_family            enum
  address                 text
  label                   text

Network
  id (pk)
  chain_family            enum
  chain_id                text          -- evm chainId / ton workchain / etc.
  name, symbol, decimals
  rpc_url_ref             text          -- pointer to secret-managed RPC, not raw key
  explorer_url
  is_testnet, is_enabled

Token
  id (pk)
  network_id -> Network
  address                 text          -- null for native
  symbol, name, decimals
  logo_url
  is_spam                 bool
  source                  enum(builtin, autodetect, user_import)

TokenUserState           -- per user hide/favorite
  user_id, token_id, hidden, favorite   (pk: user_id, token_id)

Transaction              -- cached index of on-chain activity (public data)
  id (pk)
  account_id -> Account
  network_id -> Network
  hash, direction, status, value, token_id, fee
  counterparty_address
  block_time, indexed_at
  human_summary           text

DappSession
  id (pk)
  user_id -> TelegramUser
  protocol                enum(walletconnect, tonconnect)
  origin                  text
  account_id -> Account
  permissions             jsonb         -- chain-scoped grants
  connected_at, last_used_at, revoked_at

ApprovalRecord           -- token allowances surfaced for the revoke tool
  id (pk)
  account_id -> Account
  network_id -> Network
  token_id -> Token
  spender_address, amount, is_unlimited, risk_level, last_seen_block

RiskAlert
  id (pk)
  user_id -> TelegramUser
  subject_type            enum(address, contract, tx, dapp, token, domain)
  subject_ref             text
  severity                enum(green, yellow, red)
  reason                  text
  created_at

Notification
  id (pk)
  user_id -> TelegramUser
  type                    enum(price_alert, tx_status, security, product)
  payload                 jsonb         -- non-sensitive only
  delivered_via           enum(in_app, bot)
  read_at, created_at

NotificationPref
  user_id (pk) -> TelegramUser
  price_alerts, tx_status, security, product   bool

Referral
  id (pk)
  referrer_user_id -> TelegramUser
  referred_user_id -> TelegramUser
  code, status, reward_points, created_at

Subscription             -- Telegram Stars premium (non-custodial features only)
  id (pk)
  user_id -> TelegramUser
  tier                    enum(free, premium)
  stars_charge_id         text
  active_until, created_at
```

### Indexing & retention
- `Transaction`, `ApprovalRecord` are caches; can be rebuilt from chain. TTL/refresh via indexer jobs.
- Audit logs (separate store) record admin/security events **without** any key material or full PII.
