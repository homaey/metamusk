/**
 * Derive display accounts (addresses) for every supported chain family.
 *
 * - Mnemonic wallets: derive TON, EVM, Solana, Bitcoin from the BIP39 seed.
 * - Privkey wallets: EVM-only; address comes from the stored hex private key.
 *
 * Private keys are derived transiently to compute addresses, then zeroized —
 * only addresses live in UI state.
 */
import { mnemonicToSeed, zeroize, evmAddressFromPrivateKey } from "@nova/wallet-core";
import { deriveEvm, deriveTon, deriveSolana, deriveBitcoin } from "@nova/chains";

export interface ChainAccount {
  family: "ton" | "evm" | "solana" | "bitcoin";
  /** Human label; EVM address is shared across Ethereum/BSC/Polygon. */
  label: string;
  symbol: string;
  address: string;
}

export function deriveAccounts(mnemonic: string): ChainAccount[] {
  const seed = mnemonicToSeed(mnemonic);
  try {
    const ton = deriveTon(seed, 0);
    const evm = deriveEvm(seed, 0);
    const sol = deriveSolana(seed, 0);
    const btc = deriveBitcoin(seed, 0);

    const accounts: ChainAccount[] = [
      { family: "ton", label: "TON", symbol: "TON", address: ton.address },
      { family: "evm", label: "EVM", symbol: "ETH", address: evm.address },
      { family: "solana", label: "Solana", symbol: "SOL", address: sol.address },
      { family: "bitcoin", label: "Bitcoin", symbol: "BTC", address: btc.address },
    ];

    zeroize(ton.privateKey, evm.privateKey, sol.privateKey, btc.privateKey);
    return accounts;
  } finally {
    zeroize(seed);
  }
}

/** EVM-only account derived from a raw hex private key (0x-prefixed or bare 64-char hex). */
export function deriveAccountsFromPrivKey(evmKeyHex: string): ChainAccount[] {
  const normalized = evmKeyHex.startsWith("0x") ? evmKeyHex.slice(2) : evmKeyHex;
  const keyBytes = new Uint8Array(Buffer.from(normalized, "hex"));
  try {
    const address = evmAddressFromPrivateKey(keyBytes);
    return [{ family: "evm", label: "EVM", symbol: "ETH", address }];
  } finally {
    zeroize(keyBytes);
  }
}
