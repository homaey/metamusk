/**
 * Transaction history fetched from public block explorers.
 * No API keys required — uses Blockscout (EVM), toncenter (TON),
 * Solana RPC (Solana), and mempool.space (Bitcoin).
 */
import { getNetwork } from "@nova/chains";
import { RPC } from "../config.js";

/** Blockscout v2 base URLs per EVM network. */
const BLOCKSCOUT: Record<string, string> = {
  "evm:1": "https://eth.blockscout.com",
  "evm:42161": "https://arbitrum.blockscout.com",
  "evm:10": "https://optimism.blockscout.com",
  "evm:8453": "https://base.blockscout.com",
  "evm:56": "https://bsc.blockscout.com",
  "evm:137": "https://polygon.blockscout.com",
};

export interface TxRecord {
  hash: string;
  from: string;
  to: string | null;
  /** Human-readable native amount (e.g. "0.042"). */
  value: string;
  symbol: string;
  /** ISO 8601 timestamp, empty string if unknown. */
  timestamp: string;
  status: "ok" | "error" | "pending";
  direction: "in" | "out" | "self";
  fee?: string;
}

export async function getTxHistory(networkId: string, address: string, limit = 20): Promise<TxRecord[]> {
  const net = getNetwork(networkId);

  switch (net.family) {
    case "evm": {
      const base = BLOCKSCOUT[networkId];
      if (!base) return [];
      try {
        const url = `${base}/api/v2/addresses/${address}/transactions?filter=to%7Cfrom`;
        const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
        if (!res.ok) return [];
        const data = (await res.json()) as { items?: Record<string, unknown>[] };
        const addrLower = address.toLowerCase();
        return (data.items ?? []).slice(0, limit).map((tx) => {
          const from = (tx.from as { hash?: string } | null)?.hash ?? "";
          const to = (tx.to as { hash?: string } | null)?.hash ?? null;
          const fromLower = from.toLowerCase();
          const toLower = to?.toLowerCase() ?? "";
          const direction: TxRecord["direction"] = fromLower === toLower ? "self" : fromLower === addrLower ? "out" : "in";
          const valueWei = BigInt((tx.value as string | undefined) ?? "0");
          const valueNative = Number(valueWei) / 10 ** net.nativeDecimals;
          const feeObj = tx.fee as { value?: string } | undefined;
          const feeWei = feeObj?.value ? BigInt(feeObj.value) : null;
          return {
            hash: (tx.hash as string) ?? "",
            from,
            to,
            value: valueNative.toFixed(6).replace(/\.?0+$/, "") || "0",
            symbol: net.nativeSymbol,
            timestamp: (tx.timestamp as string | undefined) ?? "",
            status: (tx.status as "ok" | "error") ?? "ok",
            direction,
            fee: feeWei != null ? (Number(feeWei) / 10 ** net.nativeDecimals).toFixed(8).replace(/\.?0+$/, "") : undefined,
          } satisfies TxRecord;
        });
      } catch { return []; }
    }

    case "ton": {
      try {
        const url = `https://toncenter.com/api/v2/getTransactions?address=${encodeURIComponent(address)}&limit=${limit}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return [];
        const data = (await res.json()) as { ok: boolean; result?: Record<string, unknown>[] };
        if (!data.ok) return [];
        return (data.result ?? []).map((tx) => {
          const inMsg = tx.in_msg as { value?: string; source?: string; destination?: string } | undefined;
          const outMsgs = (tx.out_msgs as { value?: string; destination?: string }[] | undefined) ?? [];
          const isIn = inMsg?.value && Number(inMsg.value) > 0;
          const value = isIn
            ? (Number(inMsg!.value) / 1e9).toFixed(4).replace(/\.?0+$/, "")
            : outMsgs[0]?.value ? (Number(outMsgs[0].value) / 1e9).toFixed(4).replace(/\.?0+$/, "") : "0";
          const direction: TxRecord["direction"] = isIn ? "in" : outMsgs.length > 0 ? "out" : "self";
          const txId = tx.transaction_id as { hash?: string } | undefined;
          return {
            hash: txId?.hash ?? "",
            from: inMsg?.source ?? "",
            to: outMsgs[0]?.destination ?? inMsg?.destination ?? null,
            value,
            symbol: "TON",
            timestamp: new Date(((tx.utime as number) ?? 0) * 1000).toISOString(),
            status: "ok",
            direction,
          } satisfies TxRecord;
        });
      } catch { return []; }
    }

    case "solana": {
      try {
        const rpcUrl = RPC["solana:mainnet"] ?? "https://api.mainnet-beta.solana.com";
        const res = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getSignaturesForAddress", params: [address, { limit }] }),
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return [];
        const data = (await res.json()) as { result?: { signature: string; blockTime?: number; err: unknown }[] };
        return (data.result ?? []).map((sig) => ({
          hash: sig.signature,
          from: address,
          to: null,
          value: "—",
          symbol: "SOL",
          timestamp: sig.blockTime ? new Date(sig.blockTime * 1000).toISOString() : "",
          status: sig.err ? "error" : "ok",
          direction: "out",
        } satisfies TxRecord));
      } catch { return []; }
    }

    case "bitcoin": {
      try {
        const url = `https://mempool.space/api/address/${address}/txs`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return [];
        const txs = (await res.json()) as {
          txid: string;
          vout: { scriptpubkey_address?: string; value: number }[];
          status?: { confirmed?: boolean; block_time?: number };
        }[];
        return txs.slice(0, limit).map((tx) => {
          const outputsToMe = tx.vout.filter((v) => v.scriptpubkey_address === address);
          const totalIn = outputsToMe.reduce((s, v) => s + v.value, 0);
          return {
            hash: tx.txid,
            from: "",
            to: address,
            value: (totalIn / 1e8).toFixed(8).replace(/\.?0+$/, "") || "0",
            symbol: "BTC",
            timestamp: tx.status?.block_time ? new Date(tx.status.block_time * 1000).toISOString() : "",
            status: tx.status?.confirmed ? "ok" : "pending",
            direction: totalIn > 0 ? "in" : "out",
          } satisfies TxRecord;
        });
      } catch { return []; }
    }

    default:
      return [];
  }
}
