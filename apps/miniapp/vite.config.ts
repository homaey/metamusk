import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ include: ["buffer", "events", "stream", "util", "crypto"] }),
  ],
  define: {
    global: "globalThis",
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // TON SDK is the heaviest single chunk (~600 kB)
          if (id.includes("@ton/")) return "vendor-ton";
          // Solana web3.js is next (~250 kB)
          if (id.includes("@solana/")) return "vendor-solana";
          // Bitcoin signer + base
          if (id.includes("@scure/btc-signer") || id.includes("@scure/base")) return "vendor-bitcoin";
          // EVM / viem
          if (id.includes("viem") || id.includes("@noble/curves") || id.includes("@noble/hashes")) return "vendor-evm";
          // BIP39/32 mnemonic utilities
          if (id.includes("@scure/bip")) return "vendor-bip";
          // WalletConnect (heavy, lazy-loaded only when DApps tab is opened)
          if (id.includes("@walletconnect/") || id.includes("@reown/")) return "vendor-walletconnect";
          // React core stays in the main chunk (small; needed immediately)
        },
      },
    },
  },
});
