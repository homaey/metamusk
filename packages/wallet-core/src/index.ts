/**
 * @nova/wallet-core — the only place key material lives.
 *
 * Public surface:
 *   - mnemonic:  create / validate / seed derivation (BIP39)
 *   - accounts:  HD derivation + EVM address (BIP32 / secp256k1)
 *   - vault:     seal / open / rekey encrypted vault (Argon2id + AES-256-GCM)
 *   - utils:     secure randomness + byte helpers + zeroize
 *
 * No module here performs network or storage I/O.
 */
export {
  createMnemonic,
  isValidMnemonic,
  normalizeMnemonic,
  mnemonicToSeed,
  type MnemonicStrength,
} from "./mnemonic.js";

export {
  evmPath,
  deriveSecp256k1,
  deriveEvmAccount,
  evmAddressFromPrivateKey,
  type ChainFamily,
  type Secp256k1Key,
} from "./accounts.js";

export {
  sealVault,
  openVault,
  rekeyVault,
  DEFAULT_KDF,
  type VaultEnvelope,
  type KdfParams,
  type Argon2idParams,
  type ScryptParams,
} from "./vault.js";

export { randomBytes } from "./random.js";
export { zeroize, bytesToBase64, base64ToBytes } from "./bytes.js";
