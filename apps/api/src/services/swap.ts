/**
 * Swap quotes via LI.FI (free, no key) — a DEX aggregator covering every EVM
 * chain we support. Returns a normalized quote PLUS the unsigned transaction, so
 * the client can review, sign locally, and broadcast — fully non-custodial. The
 * server never signs and never holds keys.
 */
import { getNetwork, tokensForNetwork, parseUnits, formatUnits } from "@nova/chains";

const LIFI = "https://li.quest/v1";
const NATIVE = "0x0000000000000000000000000000000000000000";

interface ResolvedToken { address: string; decimals: number; symbol: string }

function resolveToken(networkId: string, ref: string): ResolvedToken {
  const net = getNetwork(networkId);
  if (ref === "native" || ref.toLowerCase() === NATIVE) {
    return { address: NATIVE, decimals: net.nativeDecimals, symbol: net.nativeSymbol };
  }
  const tok = tokensForNetwork(networkId).find((t) => t.address?.toLowerCase() === ref.toLowerCase());
  if (!tok || !tok.address) throw new Error(`Unknown token ${ref} on ${networkId}`);
  return { address: tok.address, decimals: tok.decimals, symbol: tok.symbol };
}

export interface SwapQuote {
  route: string;
  fromToken: ResolvedToken;
  toToken: ResolvedToken;
  fromAmount: string;
  toAmount: string;
  toAmountFormatted: string;
  toAmountMinFormatted: string;
  fromAmountUsd: number | null;
  toAmountUsd: number | null;
  priceImpact: number | null;
  gasUsd: number | null;
  tx: { to: string; data: string; value: string; gasLimit: string; gasPrice: string; chainId: number } | null;
}

export async function swapQuote(params: {
  networkId: string;
  from: string;
  to: string;
  amount: string;
  address: string;
  slippage?: number;
}): Promise<SwapQuote> {
  const net = getNetwork(params.networkId);
  if (net.family !== "evm") throw new Error("Swap is currently supported on EVM networks only.");
  const fromT = resolveToken(params.networkId, params.from);
  const toT = resolveToken(params.networkId, params.to);
  const rawAmount = parseUnits(params.amount, fromT.decimals).toString();
  const slippage = params.slippage ?? 0.005;

  const url =
    `${LIFI}/quote?fromChain=${net.chainId}&toChain=${net.chainId}` +
    `&fromToken=${fromT.address}&toToken=${toT.address}` +
    `&fromAmount=${rawAmount}&fromAddress=${params.address}&slippage=${slippage}`;

  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Quote failed (${res.status}): ${body.slice(0, 140)}`);
  }
  const q = (await res.json()) as {
    tool?: string;
    estimate?: {
      fromAmount: string; toAmount: string; toAmountMin: string;
      fromAmountUSD?: string; toAmountUSD?: string;
      gasCosts?: { amountUSD?: string }[];
    };
    transactionRequest?: { to: string; data: string; value?: string; gasLimit?: string; gasPrice?: string };
  };
  const est = q.estimate;
  if (!est) throw new Error("No route found for this pair.");

  const fromUsd = Number(est.fromAmountUSD ?? 0);
  const toUsd = Number(est.toAmountUSD ?? 0);
  // Signed price impact: positive = you lose value (slippage/impact); negative =
  // output worth MORE than input, which for a real swap is impossible and flags a
  // mispriced/low-liquidity route. We do NOT clamp it — the client warns on anomalies.
  const priceImpact = fromUsd > 0 && toUsd > 0 ? (fromUsd - toUsd) / fromUsd : null;
  const gasUsd = (est.gasCosts ?? []).reduce((s, g) => s + Number(g.amountUSD ?? 0), 0) || null;

  return {
    route: q.tool ?? "aggregator",
    fromToken: fromT,
    toToken: toT,
    fromAmount: est.fromAmount,
    toAmount: est.toAmount,
    toAmountFormatted: formatUnits(BigInt(est.toAmount), toT.decimals),
    toAmountMinFormatted: formatUnits(BigInt(est.toAmountMin), toT.decimals),
    fromAmountUsd: fromUsd || null,
    toAmountUsd: toUsd || null,
    priceImpact,
    gasUsd,
    tx: q.transactionRequest
      ? {
          to: q.transactionRequest.to,
          data: q.transactionRequest.data,
          value: q.transactionRequest.value ?? "0x0",
          gasLimit: q.transactionRequest.gasLimit ?? "0x30000",
          gasPrice: q.transactionRequest.gasPrice ?? "0x0",
          chainId: net.chainId!,
        }
      : null,
  };
}
