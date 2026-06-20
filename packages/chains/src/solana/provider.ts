/**
 * Solana read access + local signing + broadcast.
 *
 * Solana transactions are signed over a recent blockhash, so (like TON) signing
 * happens client-side here; the backend only relays the serialized signed tx.
 * The 32-byte ed25519 seed we derived is exactly what Keypair.fromSeed wants.
 */
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { parseUnits } from "../units.js";
import type { DerivedAccount, NativeBalance, NetworkConfig } from "../types.js";

/** Build a web3.js Keypair from a derived Solana account (its 32-byte seed). */
export function solanaKeypair(account: DerivedAccount): Keypair {
  return Keypair.fromSeed(account.privateKey);
}

export class SolanaProvider {
  private readonly conn: Connection;

  constructor(private readonly network: NetworkConfig) {
    if (network.family !== "solana" || !network.rpcUrl) {
      throw new Error("SolanaProvider requires a Solana network with an rpcUrl.");
    }
    this.conn = new Connection(network.rpcUrl, "confirmed");
  }

  async getNativeBalance(address: string): Promise<NativeBalance> {
    const lamports = await this.conn.getBalance(new PublicKey(address));
    return { raw: lamports.toString(), decimals: 9, symbol: "SOL" };
  }

  /** SPL token balances owned by `address`, keyed by mint. */
  async getTokenBalances(address: string): Promise<Record<string, string>> {
    const res = await this.conn.getParsedTokenAccountsByOwner(new PublicKey(address), {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });
    const out: Record<string, string> = {};
    for (const { account } of res.value) {
      const info = (account.data as { parsed: { info: { mint: string; tokenAmount: { amount: string } } } }).parsed.info;
      out[info.mint] = info.tokenAmount.amount;
    }
    return out;
  }

  /** Build + sign a native SOL transfer locally. Returns a base64 serialized tx. */
  async buildSignedTransfer(
    account: DerivedAccount,
    to: string,
    amountSol: string,
  ): Promise<string> {
    const { blockhash } = await this.conn.getLatestBlockhash();
    return SolanaProvider.buildSignedTransferOffline(account, to, amountSol, blockhash);
  }

  /**
   * Build + sign a SOL transfer without a network connection.
   * The caller supplies the blockhash (e.g. fetched from the backend proxy).
   */
  static buildSignedTransferOffline(
    account: DerivedAccount,
    to: string,
    amountSol: string,
    blockhash: string,
  ): string {
    const from = solanaKeypair(account);
    const lamports = parseUnits(amountSol, 9);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: new PublicKey(to),
        lamports,
      }),
    );
    tx.recentBlockhash = blockhash;
    tx.feePayer = from.publicKey;
    tx.sign(from);
    return tx.serialize().toString("base64");
  }

  /** Relay an already-signed serialized transaction (base64). Never signs. */
  async broadcast(signedBase64: string): Promise<string> {
    return this.conn.sendRawTransaction(Buffer.from(signedBase64, "base64"));
  }
}
