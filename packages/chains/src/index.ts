/**
 * @nova/chains — chain abstraction over TON and EVM.
 *
 * Derivation and signing depend on @nova/wallet-core for raw key material;
 * providers handle read access, unsigned-tx building, and broadcast. The
 * client signs; the server may build & relay.
 */
export * from "./types.js";
export { NETWORKS, getNetwork, networksByFamily } from "./registry.js";
export {
  ALL_TOKENS,
  tokensForNetwork,
  searchTokens,
  loadTokenList,
  type TokenInfo,
} from "./tokens.js";
export { parseUnits, formatUnits } from "./units.js";
export {
  isValidAddress,
  assessTransferRisk,
  type RiskLevel,
  type RiskFinding,
  type RiskReport,
  type TransferRiskInput,
} from "./validation.js";
export { deriveEd25519, parseHardenedPath, type Slip10Node } from "./slip10.js";

// EVM (Ethereum, BNB Smart Chain, Polygon — all share this derivation/provider)
export { deriveEvm, evmSigner, evmSignerFromKey } from "./evm/account.js";
export { EvmProvider, type EvmNativeTransferParams } from "./evm/provider.js";

// TON
export { deriveTon, tonPath, type TonAccount } from "./ton/account.js";
export {
  buildSignedTransferBoc,
  type TonTransferParams,
} from "./ton/transfer.js";
export { TonProvider } from "./ton/provider.js";

// Solana
export { deriveSolana, solanaPath } from "./solana/account.js";
export { SolanaProvider, solanaKeypair } from "./solana/provider.js";

// Bitcoin
export { deriveBitcoin, bitcoinPath, type BitcoinAccount } from "./bitcoin/account.js";
export { BitcoinProvider, type Utxo } from "./bitcoin/provider.js";
