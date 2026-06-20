/**
 * In-memory wallet session. Holds decrypted key material ONLY while unlocked,
 * outside React state (so it is never serialized into the DOM, devtools, or
 * persisted snapshots). Cleared on lock.
 *
 * Two session types:
 *  - "mnemonic": a BIP39 phrase that drives derivation for all 4 chains.
 *  - "privkey":  a single EVM hex private key; only EVM is available.
 */

type SessionData =
  | { type: "mnemonic"; value: string }
  | { type: "privkey"; evmKey: string };

let session: SessionData | null = null;

export const setSessionMnemonic = (m: string): void => {
  session = { type: "mnemonic", value: m };
};

export const setSessionPrivKey = (evmKey: string): void => {
  session = { type: "privkey", evmKey };
};

export const getSessionMnemonic = (): string | null =>
  session?.type === "mnemonic" ? session.value : null;

export const getSessionPrivKey = (): string | null =>
  session?.type === "privkey" ? session.evmKey : null;

export const getSessionType = (): "mnemonic" | "privkey" | null =>
  session ? session.type : null;

export const clearSession = (): void => {
  session = null;
};
