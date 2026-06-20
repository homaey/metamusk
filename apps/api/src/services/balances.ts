/**
 * Native balance lookups across chains. Uses the @nova/chains providers with the
 * server-side RPC endpoints. Read-only — never touches key material.
 */
import {
  getNetwork,
  formatUnits,
  EvmProvider,
  TonProvider,
  SolanaProvider,
  BitcoinProvider,
} from "@nova/chains";
import { RPC } from "../config.js";

export interface NativeBalanceResult {
  networkId: string;
  symbol: string;
  decimals: number;
  raw: string;
  formatted: string;
}

export async function getNativeBalance(
  networkId: string,
  address: string,
): Promise<NativeBalanceResult> {
  const net = getNetwork(networkId);
  const rpcUrl = RPC[networkId];
  if (!rpcUrl) throw new Error(`No RPC configured for ${networkId}`);
  const cfg = { ...net, rpcUrl };

  let raw: string, decimals: number, symbol: string;
  switch (net.family) {
    case "evm": {
      const b = await new EvmProvider(cfg).getNativeBalance(address as `0x${string}`);
      ({ raw, decimals, symbol } = b);
      break;
    }
    case "ton": {
      const b = await new TonProvider(cfg).getNativeBalance(address);
      ({ raw, decimals, symbol } = b);
      break;
    }
    case "solana": {
      const b = await new SolanaProvider(cfg).getNativeBalance(address);
      ({ raw, decimals, symbol } = b);
      break;
    }
    case "bitcoin": {
      const b = await new BitcoinProvider(cfg).getNativeBalance(address);
      ({ raw, decimals, symbol } = b);
      break;
    }
    default:
      throw new Error(`Unsupported family for ${networkId}`);
  }

  return { networkId, symbol, decimals, raw, formatted: formatUnits(BigInt(raw), decimals) };
}
