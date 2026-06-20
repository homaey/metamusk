/**
 * Hierarchical-deterministic account derivation from a single BIP39 seed.
 *
 * One recovery phrase drives every chain:
 *   - EVM (and BTC) use secp256k1 via BIP32 (BIP44 path m/44'/60'/0'/0/i).
 *   - TON uses ed25519; its derivation lives in the chains package (SLIP-0010 /
 *     @ton/crypto) to avoid baking a subtly-wrong ed25519 path into the core.
 *
 * This module never persists or transmits keys. Returned private keys are
 * caller-owned and should be zeroized after signing.
 */
import { HDKey } from "@scure/bip32";
import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";

export type ChainFamily = "evm" | "ton" | "solana" | "btc";

/** Standard BIP44 derivation path for EVM accounts. */
export function evmPath(accountIndex: number): string {
  if (!Number.isInteger(accountIndex) || accountIndex < 0) {
    throw new Error("accountIndex must be a non-negative integer.");
  }
  return `m/44'/60'/0'/0/${accountIndex}`;
}

export interface Secp256k1Key {
  path: string;
  privateKey: Uint8Array; // 32 bytes
  publicKey: Uint8Array; // 33 bytes (compressed)
}

/** Derive a secp256k1 key at an arbitrary BIP32 path from a 64-byte seed. */
export function deriveSecp256k1(seed: Uint8Array, path: string): Secp256k1Key {
  const root = HDKey.fromMasterSeed(seed);
  const node = root.derive(path);
  if (!node.privateKey || !node.publicKey) {
    throw new Error(`Failed to derive key at path ${path}.`);
  }
  return { path, privateKey: node.privateKey, publicKey: node.publicKey };
}

/** Compute the checksummed-lowercase EVM address for a private key. */
export function evmAddressFromPrivateKey(privateKey: Uint8Array): string {
  const uncompressed = secp256k1.getPublicKey(privateKey, false); // 65 bytes, 0x04 prefix
  const hash = keccak_256(uncompressed.slice(1)); // drop 0x04
  const addr = hash.slice(-20);
  return "0x" + toEip55(addr);
}

/** EIP-55 checksum encoding of a 20-byte address. */
function toEip55(addressBytes: Uint8Array): string {
  let hex = "";
  for (const b of addressBytes) hex += b.toString(16).padStart(2, "0");
  const hashHex = bytesToHex(keccak_256(new TextEncoder().encode(hex)));
  let out = "";
  for (let i = 0; i < hex.length; i++) {
    const c = hex[i]!;
    out += parseInt(hashHex[i]!, 16) >= 8 ? c.toUpperCase() : c;
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

/** Convenience: derive the i-th EVM account (path, keys, address) from a seed. */
export function deriveEvmAccount(seed: Uint8Array, accountIndex: number) {
  const key = deriveSecp256k1(seed, evmPath(accountIndex));
  return { ...key, family: "evm" as const, address: evmAddressFromPrivateKey(key.privateKey) };
}
