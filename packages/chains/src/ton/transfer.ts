/**
 * TON transfer building. Unlike EVM, a TON wallet signature covers the whole
 * external message, so signing MUST happen client-side — there is no
 * "server builds, client signs a hash" split. The honest pattern: the client
 * produces a fully-signed BOC here; the backend only relays it.
 */
import { keyPairFromSeed } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import {
  beginCell,
  external,
  internal,
  storeMessage,
  toNano,
  SendMode,
} from "@ton/core";
import type { TonAccount } from "./account.js";

export interface TonTransferParams {
  to: string;
  /** Amount in TON (decimal string), e.g. "1.5". */
  amountTon: string;
  /** Current wallet seqno (fetch from provider before building). */
  seqno: number;
  /** Optional comment/memo (forwarded as a text body). */
  comment?: string;
  /** Bounce flag — false for transfers to wallets, true for contracts expecting it. */
  bounce?: boolean;
}

/**
 * Build a fully-signed external-message BOC (base64) for a native TON transfer.
 * Signs locally using the account's ed25519 seed.
 */
export function buildSignedTransferBoc(
  account: TonAccount,
  params: TonTransferParams,
): string {
  const keypair = keyPairFromSeed(Buffer.from(account.privateKey));
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keypair.publicKey,
  });

  const body = params.comment
    ? beginCell().storeUint(0, 32).storeStringTail(params.comment).endCell()
    : undefined;

  const transfer = wallet.createTransfer({
    seqno: params.seqno,
    secretKey: keypair.secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    messages: [
      internal({
        to: params.to,
        value: toNano(params.amountTon),
        bounce: params.bounce ?? false,
        body,
      }),
    ],
  });

  const ext = external({ to: wallet.address, body: transfer });
  return beginCell().store(storeMessage(ext)).endCell().toBoc().toString("base64");
}
