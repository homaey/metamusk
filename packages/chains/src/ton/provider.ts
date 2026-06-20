/**
 * TON read access + relay. Reads balance/seqno and broadcasts an already-signed
 * BOC. It never holds keys or signs.
 */
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import { Cell } from "@ton/core";
import type { NativeBalance, NetworkConfig } from "../types.js";

export class TonProvider {
  private readonly client: TonClient;

  constructor(private readonly network: NetworkConfig) {
    if (network.family !== "ton" || !network.rpcUrl) {
      throw new Error("TonProvider requires a TON network with an rpcUrl.");
    }
    this.client = new TonClient({ endpoint: network.rpcUrl });
  }

  async getNativeBalance(address: string): Promise<NativeBalance> {
    const raw = await this.client.getBalance(Address.parse(address));
    return {
      raw: raw.toString(),
      decimals: this.network.nativeDecimals,
      symbol: this.network.nativeSymbol,
    };
  }

  /** Current seqno for a wallet address (needed before building a transfer). */
  async getSeqno(publicKey: Uint8Array): Promise<number> {
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: Buffer.from(publicKey),
    });
    const opened = this.client.open(wallet);
    return opened.getSeqno();
  }

  /** Relay a signed external-message BOC (base64). Never signs. */
  async broadcastBoc(bocBase64: string): Promise<void> {
    const cell = Cell.fromBase64(bocBase64);
    await this.client.sendFile(cell.toBoc());
  }
}
