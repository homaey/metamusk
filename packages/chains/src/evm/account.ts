/**
 * EVM account derivation + local signing. Keys come from the shared BIP39 seed
 * via @nova/wallet-core (secp256k1 / BIP44). Signing happens here, locally; the
 * private key never leaves the process and is the caller's to zeroize.
 */
import { deriveEvmAccount } from "@nova/wallet-core";
import {
  privateKeyToAccount,
  type PrivateKeyAccount,
} from "viem/accounts";
import type { DerivedAccount } from "../types.js";

function hex(bytes: Uint8Array): `0x${string}` {
  let s = "0x";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s as `0x${string}`;
}

/** Derive the i-th EVM account from a 64-byte BIP39 seed. */
export function deriveEvm(seed: Uint8Array, accountIndex: number): DerivedAccount {
  const acct = deriveEvmAccount(seed, accountIndex);
  return {
    family: "evm",
    path: acct.path,
    address: acct.address,
    publicKey: acct.publicKey,
    privateKey: acct.privateKey,
  };
}

/** Build a viem signer (local account) from a derived account's private key. */
export function evmSigner(account: DerivedAccount): PrivateKeyAccount {
  return privateKeyToAccount(hex(account.privateKey));
}

/** Build a viem signer directly from a hex-encoded private key (0x-prefixed). */
export function evmSignerFromKey(hexKey: `0x${string}`): PrivateKeyAccount {
  return privateKeyToAccount(hexKey);
}
