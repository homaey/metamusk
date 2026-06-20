/**
 * Solana account derivation. Solana uses ed25519, so we reuse the shared
 * SLIP-0010 derivation (the same path machinery as TON) with Solana's coin type
 * 501. Path m/44'/501'/i'/0' matches the common Phantom layout. The address is
 * the base58-encoded 32-byte public key.
 */
import { ed25519 } from "@noble/curves/ed25519";
import { base58 } from "@scure/base";
import { deriveEd25519 } from "../slip10.js";
import type { DerivedAccount } from "../types.js";

export function solanaPath(accountIndex: number): string {
  if (!Number.isInteger(accountIndex) || accountIndex < 0) {
    throw new Error("accountIndex must be a non-negative integer.");
  }
  return `m/44'/501'/${accountIndex}'/0'`;
}

/** Derive the i-th Solana account from a BIP39 seed. */
export function deriveSolana(seed: Uint8Array, accountIndex: number): DerivedAccount {
  const path = solanaPath(accountIndex);
  const node = deriveEd25519(seed, path);
  const publicKey = ed25519.getPublicKey(node.key);
  return {
    family: "solana",
    path,
    address: base58.encode(publicKey), // Solana addresses are base58(pubkey)
    publicKey,
    privateKey: node.key,
  };
}
