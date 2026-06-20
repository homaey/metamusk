/**
 * Address validation + transaction risk assessment.
 *
 * This is the safety layer a first-class wallet shows BEFORE signing: it rejects
 * malformed addresses outright and surfaces red/yellow/green warnings for the
 * common foot-guns (address poisoning, first-time recipients, sending to a
 * contract, network mismatch, sending to yourself). It is pure and dependency-
 * light so it can run client-side on every keystroke.
 */
import { isAddress as isEvmAddress } from "viem";
import { Address as TonAddress } from "@ton/core";
import { Address as BtcAddress, NETWORK, TEST_NETWORK } from "@scure/btc-signer";
import { base58 } from "@scure/base";
import type { ChainFamily } from "./types.js";

export function isValidAddress(family: ChainFamily, address: string, isTestnet = false): boolean {
  const a = address.trim();
  if (!a) return false;
  try {
    switch (family) {
      case "evm":
        return isEvmAddress(a);
      case "ton":
        TonAddress.parse(a); // throws if invalid
        return true;
      case "solana": {
        const bytes = base58.decode(a);
        return bytes.length === 32;
      }
      case "bitcoin":
        BtcAddress(isTestnet ? TEST_NETWORK : NETWORK).decode(a); // throws if invalid
        return true;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

export type RiskLevel = "green" | "yellow" | "red";

export interface RiskFinding {
  level: RiskLevel;
  code:
    | "invalid_address"
    | "self_send"
    | "first_time_recipient"
    | "contract_recipient"
    | "high_value"
    | "address_poisoning"
    | "network_mismatch";
  message: string;
}

export interface TransferRiskInput {
  family: ChainFamily;
  from: string;
  to: string;
  /** Addresses the user has sent to before (lowercased compare). */
  knownRecipients?: string[];
  /** True if `to` is a smart contract (caller may resolve this from chain). */
  recipientIsContract?: boolean;
  /** Fiat value of the transfer, if known, for the high-value heuristic. */
  fiatValue?: number;
  /** Family the recipient address actually belongs to, if detectable. */
  detectedFamily?: ChainFamily;
  isTestnet?: boolean;
}

export interface RiskReport {
  level: RiskLevel;
  findings: RiskFinding[];
  /** True when nothing blocks signing (no red findings). */
  canProceed: boolean;
}

const HIGH_VALUE_USD = 1000;

/** Highest severity wins for the overall level. */
function rollup(findings: RiskFinding[]): RiskLevel {
  if (findings.some((f) => f.level === "red")) return "red";
  if (findings.some((f) => f.level === "yellow")) return "yellow";
  return "green";
}

/**
 * Detect likely address-poisoning: a look-alike that shares the first/last
 * characters with a known recipient but isn't actually the same address.
 */
function looksPoisoned(to: string, known: string[]): boolean {
  const t = to.toLowerCase();
  return known.some((k) => {
    const kk = k.toLowerCase();
    if (kk === t) return false;
    const head = t.slice(0, 6) === kk.slice(0, 6);
    const tail = t.slice(-6) === kk.slice(-6);
    return head && tail; // same visual prefix+suffix, different middle
  });
}

export function assessTransferRisk(input: TransferRiskInput): RiskReport {
  const findings: RiskFinding[] = [];
  const known = input.knownRecipients ?? [];

  if (!isValidAddress(input.family, input.to, input.isTestnet)) {
    findings.push({ level: "red", code: "invalid_address", message: "This address is not valid for the selected network." });
    return { level: "red", findings, canProceed: false };
  }

  if (input.detectedFamily && input.detectedFamily !== input.family) {
    findings.push({ level: "red", code: "network_mismatch", message: "This address belongs to a different network. Funds sent here may be lost." });
  }

  if (input.to.trim().toLowerCase() === input.from.trim().toLowerCase()) {
    findings.push({ level: "yellow", code: "self_send", message: "You're sending to your own address." });
  }

  if (looksPoisoned(input.to, known)) {
    findings.push({ level: "red", code: "address_poisoning", message: "This address looks similar to one you've used but is different — a possible scam." });
  }

  if (known.length > 0 && !known.map((k) => k.toLowerCase()).includes(input.to.toLowerCase())) {
    findings.push({ level: "yellow", code: "first_time_recipient", message: "First time sending to this address. Double-check it's correct." });
  }

  if (input.recipientIsContract) {
    findings.push({ level: "yellow", code: "contract_recipient", message: "This is a smart contract. Only continue if you intend to interact with it." });
  }

  if (typeof input.fiatValue === "number" && input.fiatValue >= HIGH_VALUE_USD) {
    findings.push({ level: "yellow", code: "high_value", message: "High-value transfer. Confirm the amount and recipient carefully." });
  }

  return { level: rollup(findings), findings, canProceed: !findings.some((f) => f.level === "red") };
}
