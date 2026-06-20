/**
 * NFT fetcher — free public APIs only, no keys required.
 * EVM: Blockscout v2 NFT endpoint (ERC-721 + ERC-1155).
 * TON: tonapi.io v2 (free tier, no auth needed).
 * Solana/Bitcoin: not supported yet.
 */
import { NETWORKS } from "@nova/chains";

export interface NftItem {
  id: string;
  name: string;
  imageUrl: string | null;
  collection: string | null;
  tokenAddress?: string;
  tokenId?: string;
}

const BLOCKSCOUT: Record<string, string> = {
  "evm:1": "https://eth.blockscout.com",
  "evm:42161": "https://arbitrum.blockscout.com",
  "evm:10": "https://optimism.blockscout.com",
  "evm:8453": "https://base.blockscout.com",
  "evm:137": "https://polygon.blockscout.com",
};

export async function getNfts(networkId: string, address: string): Promise<NftItem[]> {
  const net = NETWORKS[networkId];
  if (!net) return [];

  if (net.family === "evm") {
    const base = BLOCKSCOUT[networkId];
    if (!base) return [];
    const url = `${base}/api/v2/addresses/${address}/nft?type=ERC-721,ERC-1155&limit=20`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      items?: Array<{
        id?: string;
        token?: { address?: string; name?: string; symbol?: string };
        image_url?: string;
        metadata?: { name?: string; image?: string };
      }>;
    };
    return (data.items ?? []).map((item, idx) => ({
      id: `${item.token?.address ?? ""}:${item.id ?? idx}`,
      name: (item.metadata?.name ?? item.token?.name ?? "Unknown NFT").slice(0, 80),
      imageUrl: item.image_url ?? item.metadata?.image ?? null,
      collection: item.token?.name ?? null,
      tokenAddress: item.token?.address,
      tokenId: item.id,
    }));
  }

  if (net.family === "ton") {
    const url = `https://tonapi.io/v2/accounts/${encodeURIComponent(address)}/nfts?offset=0&limit=20`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      nft_items?: Array<{
        address?: string;
        index?: number;
        collection?: { name?: string };
        previews?: Array<{ url?: string; resolution?: string }>;
        dns?: string;
        metadata?: { name?: string; image?: string };
      }>;
    };
    return (data.nft_items ?? []).map((item) => ({
      id: item.address ?? String(item.index ?? Math.random()),
      name: (item.metadata?.name ?? item.dns ?? "Unknown NFT").slice(0, 80),
      imageUrl:
        item.previews?.find((p) => p.resolution === "500x500")?.url ??
        item.previews?.[0]?.url ??
        item.metadata?.image ??
        null,
      collection: item.collection?.name ?? null,
    }));
  }

  return [];
}
