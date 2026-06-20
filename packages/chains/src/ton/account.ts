/**
 * TON account derivation. Uses the shared BIP39 seed → SLIP-0010 ed25519
 * (path m/44'/607'/0') → @ton/crypto keypair → Wallet v4 contract address.
 *
 * This is the deliberate "TON ed25519 lives in chains, not wallet-core" boundary
 * from the architecture doc: ed25519 derivation is curve-specific and we keep it
 * out of the secp256k1-only core.
 */
import { keyPairFromSeed } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { deriveEd25519 } from "../slip10.js";
import type { DerivedAccount } from "../types.js";

/** TON's registered coin type is 607. One account per index via the last segment. */
export function tonPath(accountIndex: number): string {
  if (!Number.isInteger(accountIndex) || accountIndex < 0) {
    throw new Error("accountIndex must be a non-negative integer.");
  }
  return `m/44'/607'/${accountIndex}'`;
}

export interface TonAccount extends DerivedAccount {
  /** 32-byte ed25519 public key. */
  publicKey: Uint8Array;
  /** Whether the address was rendered for testnet. */
  isTestnet: boolean;
}

/**
 * Derive the i-th TON account from a BIP39 seed. `isTestnet` only affects the
 * human-readable address rendering (the keypair is identical across networks).
 */
export function deriveTon(
  seed: Uint8Array,
  accountIndex: number,
  isTestnet = false,
): TonAccount {
  const path = tonPath(accountIndex);
  const node = deriveEd25519(seed, path);
  const keypair = keyPairFromSeed(Buffer.from(node.key));
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keypair.publicKey,
  });
  const address = wallet.address.toString({
    urlSafe: true,
    bounceable: false,
    testOnly: isTestnet,
  });
  return {
    family: "ton",
    path,
    address,
    publicKey: new Uint8Array(keypair.publicKey),
    // @ton secretKey is 64 bytes (seed||pub); keep the 32-byte ed25519 seed as the private key.
    privateKey: node.key,
    isTestnet,
  };
}
