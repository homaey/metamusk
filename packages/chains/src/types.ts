/**
 * Cross-chain type surface. Families differ enough (account model vs. UTXO-ish
 * message model) that we keep family-specific adapters rather than a leaky
 * lowest-common-denominator interface, but share these primitives.
 */
export type ChainFamily = "evm" | "ton" | "solana" | "bitcoin";

export interface NetworkConfig {
  /** Stable internal id, e.g. "evm:8453" or "ton:mainnet". */
  id: string;
  family: ChainFamily;
  name: string;
  /** Native gas token. */
  nativeSymbol: string;
  nativeDecimals: number;
  rpcUrl?: string;
  explorerUrl?: string;
  isTestnet: boolean;
  /** EVM only. */
  chainId?: number;
}

/** A derived account: address + the keys needed to sign locally. */
export interface DerivedAccount {
  family: ChainFamily;
  /** BIP32/SLIP-0010 path used. */
  path: string;
  /** Friendly, display/transfer address for the family. */
  address: string;
  /** Raw public key bytes. */
  publicKey: Uint8Array;
  /** Raw private key / seed bytes. Caller must zeroize after use. */
  privateKey: Uint8Array;
}

export interface NativeBalance {
  /** Smallest unit (wei / nanoton) as a string to avoid precision loss. */
  raw: string;
  decimals: number;
  symbol: string;
}
