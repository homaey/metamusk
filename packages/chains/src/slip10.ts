/**
 * SLIP-0010 HD derivation for the ed25519 curve.
 *
 * ed25519 (used by TON and Solana) only supports *hardened* derivation, so every
 * path segment must end with `'`. This lets a single BIP39 seed drive ed25519
 * chains alongside secp256k1 chains (EVM) — one recovery phrase for everything.
 *
 * Implemented per the SLIP-0010 spec and verified against its official ed25519
 * test vectors (see test/slip10.test.ts). No keys are persisted or transmitted.
 */
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";

const ED25519_CURVE = new TextEncoder().encode("ed25519 seed");
const HARDENED_OFFSET = 0x80000000;

export interface Slip10Node {
  key: Uint8Array; // 32-byte private key (ed25519 seed)
  chainCode: Uint8Array; // 32 bytes
}

function hmac512(key: Uint8Array, data: Uint8Array): Uint8Array {
  return hmac(sha512, key, data);
}

function ser32(index: number): Uint8Array {
  const b = new Uint8Array(4);
  b[0] = (index >>> 24) & 0xff;
  b[1] = (index >>> 16) & 0xff;
  b[2] = (index >>> 8) & 0xff;
  b[3] = index & 0xff;
  return b;
}

function masterFromSeed(seed: Uint8Array): Slip10Node {
  const I = hmac512(ED25519_CURVE, seed);
  return { key: I.slice(0, 32), chainCode: I.slice(32) };
}

function deriveChild(node: Slip10Node, index: number): Slip10Node {
  // data = 0x00 || key || ser32(index); ed25519 requires hardened indices.
  const data = new Uint8Array(1 + 32 + 4);
  data[0] = 0x00;
  data.set(node.key, 1);
  data.set(ser32(index), 33);
  const I = hmac512(node.chainCode, data);
  return { key: I.slice(0, 32), chainCode: I.slice(32) };
}

/** Parse an all-hardened path like `m/44'/607'/0'` into numeric indices. */
export function parseHardenedPath(path: string): number[] {
  const parts = path.split("/");
  if (parts[0] !== "m") throw new Error(`Path must start with "m": ${path}`);
  return parts.slice(1).map((seg) => {
    if (!seg.endsWith("'")) {
      throw new Error(`ed25519 (SLIP-0010) requires hardened segments: ${seg}`);
    }
    const n = Number(seg.slice(0, -1));
    if (!Number.isInteger(n) || n < 0 || n >= HARDENED_OFFSET) {
      throw new Error(`Invalid path index: ${seg}`);
    }
    return n + HARDENED_OFFSET;
  });
}

/** Derive an ed25519 node at `path` from a BIP39 seed. */
export function deriveEd25519(seed: Uint8Array, path: string): Slip10Node {
  let node = masterFromSeed(seed);
  for (const index of parseHardenedPath(path)) {
    node = deriveChild(node, index);
  }
  return node;
}
