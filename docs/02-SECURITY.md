# NovaWallet — Security Architecture

## 1. Threat model (what we defend against)
- **Server compromise** → must NOT expose user funds. Mitigation: server never holds key material.
- **Device theft / shoulder-surf** → vault encrypted at rest; PIN + auto-lock; no plaintext secrets.
- **Phishing / malicious dApp** → human-readable signing, approval scanner, phishing domain list,
  blind-signing & unlimited-approval warnings.
- **Address poisoning** → similar-prefix/suffix detection vs. history, first-time-recipient warning.
- **Telegram client spoofing** → server-side `initData` HMAC verification, freshness window.
- **Supply chain** → pin audited crypto deps (`@noble/*`, `@scure/*`), lockfile, SCA in CI.

## 2. Key lifecycle
```
mnemonic (BIP39) ──► seed ──► HDKey (BIP32) ──► per-account private keys ──► chain signers
        │                                              │
        └── encrypted into Vault at rest ──────────────┘  (decrypt only transiently, then zeroize)
```

### 2.1 Vault encryption (implemented in `@nova/wallet-core`)
- **KDF:** Argon2id (default `t=3, m=64 MiB, p=1`, 32-byte output). Tunable; scrypt fallback available.
- **Cipher:** AES-256-GCM (authenticated; tampering → decryption fails closed).
- **Salt/Nonce:** CSPRNG (WebCrypto `getRandomValues`), unique per encryption.
- **Envelope:** versioned JSON `{ v, kdf, kdfParams, salt, nonce, ct }`. Forward-compatible.
- **Secret never leaves client.** Vault blob *may* be synced ONLY if encrypted (and even then we
  prefer device-local IndexedDB; see §4).

### 2.2 In-memory handling
- Decrypted secrets held as `Uint8Array`, wiped via `zeroize()` immediately after signing.
- No secrets in React state, logs, error messages, analytics, or Telegram messages.

## 3. Recovery model (honest)
- Primary recovery = the user's **seed phrase**, shown once during a gated backup flow with mandatory
  confirmation. **Losing it can mean losing funds** — stated plainly, repeatedly.
- Telegram account access ≠ wallet recovery. We never imply otherwise.
- Optional future: passkey-wrapped vault + Shamir/social recovery or MPC — only if it preserves
  non-custody (no single server-held share that reconstructs the key).

## 4. Storage rules
| Store | Allowed | Forbidden |
|---|---|---|
| IndexedDB (device) | encrypted vault blob, prefs | plaintext secrets |
| `localStorage` | non-sensitive UI flags | any key material |
| Telegram CloudStorage | non-sensitive prefs, encrypted vault blob only | plaintext secrets, seed |
| Backend DB | metadata (see data model) | seed, pk, signatures, decrypted vault |
| Logs / Sentry | scrubbed events | secrets, signing payloads, addresses-as-PII where avoidable |

## 5. Transport & app hardening
- HTTPS only; HSTS. **CSP** locking script/connect/img sources; no inline scripts.
- `initData` sent in an auth header, verified server-side per request (HMAC-SHA256, ≤ N-min freshness).
- Rate limiting (Redis) on all mutating + quote endpoints.
- Zod/JSON-schema validation on every external input (client + server).
- Dependency pinning + lockfile + `npm audit`/SCA in CI; Subresource Integrity where applicable.
- Transitive-CVE policy: prefer root `overrides` to a patched version over a major downgrade of a
  direct dep. Current pins: `ws ^8.21.0` (via viem/web3.js WS transport), `uuid ^11.1.1` (via
  Solana's jayson RPC client). Re-verify with `npm audit` after each dependency change; a full
  `rm -rf node_modules package-lock.json && npm install` is required for overrides to propagate.

## 6. Risk engine (red/yellow/green)
Inputs: recipient history, contract verification status, approval amount (flag unlimited),
phishing domain list, token spam heuristics, simulation diffs (balance/allowance changes),
sanctions/screening where legally required. Output: severity + plain-language reason + recommended action.

## 7. Test & audit posture
- Unit tests for vault round-trip, tamper-rejection, KDF determinism, derivation vectors (BIP39 test vectors).
- Integration tests for `initData` validation (valid/expired/forged).
- Pre-audit checklist in `docs/06-AUDIT-CHECKLIST.md` (to be added in P3). Bug-bounty-ready scoping.
