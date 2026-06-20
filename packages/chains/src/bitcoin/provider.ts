/**
 * Bitcoin read access + local PSBT signing + broadcast.
 *
 * Bitcoin is UTXO-based, so a "transfer" selects inputs, adds a recipient output
 * and a change output back to the sender, then signs each input locally with the
 * derived key. Balance/UTXO/broadcast use a public Esplora-compatible REST API
 * (mempool.space by default). Signing never leaves the client.
 */
import * as btc from "@scure/btc-signer";
import { hex } from "@scure/base";
import type { BitcoinAccount } from "./account.js";
import type { NativeBalance, NetworkConfig } from "../types.js";

export interface Utxo {
  txid: string; // display (big-endian) hex
  vout: number;
  value: number; // satoshis
}

const DUST_SATS = 294n; // below this, a P2WPKH output isn't economical

export class BitcoinProvider {
  private readonly apiBase: string;
  private readonly network: typeof btc.NETWORK;

  constructor(private readonly cfg: NetworkConfig) {
    if (cfg.family !== "bitcoin" || !cfg.rpcUrl) {
      throw new Error("BitcoinProvider requires a Bitcoin network with an rpcUrl (Esplora REST base).");
    }
    this.apiBase = cfg.rpcUrl.replace(/\/$/, "");
    this.network = cfg.isTestnet ? btc.TEST_NETWORK : btc.NETWORK;
  }

  async getUtxos(address: string): Promise<Utxo[]> {
    const res = await fetch(`${this.apiBase}/address/${address}/utxo`);
    if (!res.ok) throw new Error(`UTXO fetch failed (${res.status}).`);
    return (await res.json()) as Utxo[];
  }

  async getNativeBalance(address: string): Promise<NativeBalance> {
    // Use address chain stats (one small response) rather than summing UTXOs,
    // which is fragile for addresses with thousands of outputs.
    const res = await fetch(`${this.apiBase}/address/${address}`);
    if (!res.ok) throw new Error(`Balance fetch failed (${res.status}).`);
    const data = (await res.json()) as {
      chain_stats?: { funded_txo_sum?: number; spent_txo_sum?: number };
    };
    const funded = BigInt(data.chain_stats?.funded_txo_sum ?? 0);
    const spent = BigInt(data.chain_stats?.spent_txo_sum ?? 0);
    return { raw: (funded - spent).toString(), decimals: 8, symbol: "BTC" };
  }

  /**
   * Build + sign a P2WPKH transfer. Pure given its inputs (no network), so it is
   * unit-testable offline. Performs simple accumulative coin selection.
   */
  buildSignedTransfer(params: {
    account: BitcoinAccount;
    to: string;
    amountSats: bigint;
    feeRateSatVb: number;
    utxos: Utxo[];
  }): { hex: string; txid: string; fee: bigint; change: bigint } {
    const { account, to, amountSats, feeRateSatVb, utxos } = params;
    const spend = btc.p2wpkh(account.publicKey, this.network);

    // Accumulate UTXOs until the target + estimated fee is covered.
    const selected: Utxo[] = [];
    let inputTotal = 0n;
    const estimateFee = (nIn: number, nOut: number) =>
      BigInt(Math.ceil((nIn * 68 + nOut * 31 + 11) * feeRateSatVb));

    for (const u of utxos) {
      selected.push(u);
      inputTotal += BigInt(u.value);
      const fee = estimateFee(selected.length, 2);
      if (inputTotal >= amountSats + fee) break;
    }

    let fee = estimateFee(selected.length, 2);
    if (inputTotal < amountSats + fee) {
      throw new Error("Insufficient funds for amount + fee.");
    }

    const tx = new btc.Transaction();
    for (const u of selected) {
      tx.addInput({
        txid: hex.decode(u.txid),
        index: u.vout,
        witnessUtxo: { script: spend.script, amount: BigInt(u.value) },
      });
    }
    tx.addOutputAddress(to, amountSats, this.network);

    let change = inputTotal - amountSats - fee;
    if (change > DUST_SATS) {
      tx.addOutputAddress(account.address, change, this.network);
    } else {
      // Fold dust change into the fee instead of creating an uneconomical output.
      fee += change;
      change = 0n;
    }

    tx.sign(account.privateKey);
    tx.finalize();
    return { hex: hex.encode(tx.extract()), txid: tx.id, fee, change };
  }

  /** Broadcast a signed raw tx (hex). Never signs. */
  async broadcast(rawHex: string): Promise<string> {
    const res = await fetch(`${this.apiBase}/tx`, { method: "POST", body: rawHex });
    if (!res.ok) throw new Error(`Broadcast failed (${res.status}): ${await res.text()}`);
    return res.text(); // returns the txid
  }
}
