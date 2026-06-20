# Project Snapshot

- Generated at: 2026-06-19T17:28:01
- Root folder: `wwwwallet`
- Total scanned files: 109

## File Types

- `.ts`: 55
- `.tsx`: 19
- `.json`: 14
- `.md`: 8
- `[no extension]`: 4
- `.yml`: 2
- `.css`: 2
- `.mjs`: 1
- `.py`: 1
- `.html`: 1
- `.conf`: 1
- `.tsbuildinfo`: 1

## Project Structure

```text
wwwwallet/
├── .claude
│   ├── launch.json
│   └── settings.local.json
├── .github
│   └── workflows
│       └── ci.yml
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── plugins
│   │   │   │   └── telegramAuth.ts
│   │   │   ├── routes
│   │   │   │   └── index.ts
│   │   │   ├── services
│   │   │   │   ├── balances.ts
│   │   │   │   ├── prices.ts
│   │   │   │   ├── swap.ts
│   │   │   │   ├── tokenBalances.ts
│   │   │   │   └── tx.ts
│   │   │   ├── config.ts
│   │   │   └── server.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── miniapp
│       ├── src
│       │   ├── components
│       │   │   ├── CoinLogo.tsx
│       │   │   ├── ErrorBoundary.tsx
│       │   │   ├── LanguageSwitcher.tsx
│       │   │   ├── NetworkBadge.tsx
│       │   │   ├── NetworkSelector.tsx
│       │   │   └── PinPad.tsx
│       │   ├── context
│       │   │   └── network.tsx
│       │   ├── i18n
│       │   │   ├── index.ts
│       │   │   └── locales.ts
│       │   ├── screens
│       │   │   ├── CreateWallet.tsx
│       │   │   ├── Home.tsx
│       │   │   ├── ImportWallet.tsx
│       │   │   ├── Receive.tsx
│       │   │   ├── Send.tsx
│       │   │   ├── Swap.tsx
│       │   │   ├── Tokens.tsx
│       │   │   ├── Unlock.tsx
│       │   │   └── Welcome.tsx
│       │   ├── wallet
│       │   │   ├── accounts.ts
│       │   │   ├── db.ts
│       │   │   ├── recents.ts
│       │   │   ├── session.ts
│       │   │   ├── sign.ts
│       │   │   ├── store.tsx
│       │   │   └── usePortfolio.ts
│       │   ├── api.ts
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── networkMeta.ts
│       │   ├── polyfills.ts
│       │   ├── screens.css
│       │   ├── styles.css
│       │   └── telegram.ts
│       ├── Dockerfile
│       ├── index.html
│       ├── nginx.conf
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.tsbuildinfo
│       └── vite.config.ts
├── docs
│   ├── 00-PRD.md
│   ├── 01-ARCHITECTURE.md
│   ├── 02-SECURITY.md
│   ├── 03-DATA-MODEL.md
│   ├── 04-API.md
│   ├── 05-ROADMAP.md
│   └── 07-LAUNCH-READINESS.md
├── packages
│   ├── chains
│   │   ├── src
│   │   │   ├── bitcoin
│   │   │   │   ├── account.ts
│   │   │   │   └── provider.ts
│   │   │   ├── evm
│   │   │   │   ├── account.ts
│   │   │   │   └── provider.ts
│   │   │   ├── solana
│   │   │   │   ├── account.ts
│   │   │   │   └── provider.ts
│   │   │   ├── ton
│   │   │   │   ├── account.ts
│   │   │   │   ├── provider.ts
│   │   │   │   └── transfer.ts
│   │   │   ├── index.ts
│   │   │   ├── registry.ts
│   │   │   ├── slip10.ts
│   │   │   ├── tokens.ts
│   │   │   ├── types.ts
│   │   │   ├── units.ts
│   │   │   └── validation.ts
│   │   ├── test
│   │   │   ├── evm.test.ts
│   │   │   ├── multichain.test.ts
│   │   │   ├── providers.test.ts
│   │   │   ├── slip10.test.ts
│   │   │   ├── tokens.test.ts
│   │   │   ├── ton.test.ts
│   │   │   └── validation.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── telegram-auth
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── test
│   │   │   └── initData.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── wallet-core
│       ├── src
│       │   ├── accounts.ts
│       │   ├── bytes.ts
│       │   ├── index.ts
│       │   ├── mnemonic.ts
│       │   ├── random.ts
│       │   └── vault.ts
│       ├── test
│       │   ├── accounts.test.ts
│       │   └── vault.test.ts
│       ├── package.json
│       └── tsconfig.json
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── eslint.config.mjs
├── package.json
├── project_snapshot.md
├── README.md
├── sakhtar.py
└── tsconfig.base.json
```

## Important Files


### `.claude\launch.json`

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "api",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev", "-w", "@nova/api"],
      "port": 8787,
      "autoPort": false
    },
    {
      "name": "miniapp",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev", "-w", "@nova/miniapp"],
      "port": 5173
    }
  ]
}

```

### `.claude\settings.local.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm -v)",
      "Bash(npm install *)",
      "Bash(npm test *)",
      "Bash(node --import tsx --test test/evm.test.ts)",
      "Bash(npm run *)",
      "Bash(grep -v \"0$\")",
      "Bash(npm audit *)",
      "Bash(npm ls *)",
      "Bash(npm view *)",
      "Bash(grep -v \"fail 0$\")",
      "Bash(npx tsc *)",
      "Bash(echo \"EXIT=$?\")",
      "mcp__Claude_Preview__preview_start",
      "Bash(curl -s http://localhost:8787/health)",
      "Bash(curl -s http://localhost:8787/v1/networks)",
      "Bash(curl -s http://localhost:5173/)",
      "Bash(node -e \"let d='';process.stdin.on\\('data',c=>d+=c\\).on\\('end',\\(\\)=>{const n=JSON.parse\\(d\\).networks;console.log\\('count:',n.length\\);n.forEach\\(x=>console.log\\(' -',x.name.padEnd\\(18\\),x.family,x.nativeSymbol\\)\\)}\\)\")",
      "Bash(echo \"EXITBUILD=$?\")",
      "Bash(node -e \"let d='';process.stdin.on\\('data',c=>d+=c\\).on\\('end',\\(\\)=>{const a=JSON.parse\\(d\\);for\\(const k in a.vulnerabilities\\){const v=a.vulnerabilities[k];if\\(v.severity==='high'||v.severity==='moderate'\\)console.log\\(v.severity.padEnd\\(9\\),k,'| range:',v.range,'| fixAvail:',JSON.stringify\\(v.fixAvailable\\)\\)}}\\)\")",
      "Bash(grep -vE \"^$|^>\")",
      "Bash(curl -s -m 5 http://localhost:8787/health)",
      "Bash(curl -s -m 5 http://localhost:5173/)",
      "Bash(npx vite *)",
      "Bash(node --import tsx --test test/tokens.test.ts)",
      "Bash(grep -iE \"^i18next$|^react-i18next$|^i18next-browser\")",
      "Bash(node -e \"console.log\\(require\\('./apps/miniapp/package.json'\\).dependencies\\)\")",
      "Bash(cd /c/Users/HOSSEINI/Desktop/wwwwallet && ls node_modules | grep -iE \"^i18next$|^react-i18next$|^i18next-browser\" || echo \"NOT in root node_modules\")",
      "Bash(grep -iE \"^i18next$|^react-i18next$\")",
      "Bash(node --import tsx --test packages/chains/test/validation.test.ts)",
      "Bash(echo \"build exit: $?\")",
      "Bash(node -e \"const fs=require\\('fs'\\);const p='apps/miniapp/src/i18n/locales.ts';let s=fs.readFileSync\\(p,'utf8'\\);const n=\\(s.match\\(/: Dict = \\\\{/g\\)||[]\\).length;s=s.replace\\(/: Dict = \\\\{/g,': DeepPartial<Dict> = {'\\);fs.writeFileSync\\(p,s\\);console.log\\('replaced',n,'annotations'\\);\")",
      "Bash(echo \"chains build: $?\")",
      "Bash(npx eslint *)",
      "Bash(echo \"build: $?\")",
      "Bash(node --import tsx -e \"import\\('@nova/chains'\\).then\\(m=>{const n=Object.values\\(m.NETWORKS\\);console.log\\('total networks:',n.length\\);console.log\\('EVM:',n.filter\\(x=>x.family==='evm'\\).map\\(x=>x.name\\).join\\(', '\\)\\);console.log\\('tokens:',m.ALL_TOKENS.length\\)}\\)\")",
      "Bash(echo \"typecheck exit: $?\")",
      "Bash(curl -s -m 8 \"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd\")",
      "Bash(curl -s -m 8 -X POST https://ethereum-rpc.publicnode.com -H \"content-type: application/json\" -d '{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}')",
      "Bash(curl -s -m 8 -X POST https://api.mainnet-beta.solana.com -H \"content-type: application/json\" -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"getVersion\"}')",
      "Bash(curl -s -m 8 \"https://mempool.space/api/blocks/tip/height\")",
      "Bash(echo \"typecheck: $?\")",
      "Bash(curl -s -m 12 \"http://localhost:8787/v1/prices?ids=bitcoin,ethereum,solana,the-open-network\")",
      "Bash(curl -s -m 15 \"http://localhost:8787/v1/balances?network=evm:1&address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")",
      "Bash(curl -s -m 15 \"http://localhost:8787/v1/balances?network=bitcoin:mainnet&address=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\")",
      "Bash(curl -s -m 12 \"http://localhost:8787/health\")",
      "Bash(curl -s -m 20 \"http://localhost:8787/v1/balances?network=evm:1&address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")",
      "Bash(curl -s -m 20 \"http://localhost:8787/v1/balances?network=bitcoin:mainnet&address=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\")",
      "Bash(curl -s -m 20 \"http://localhost:8787/v1/balances?network=solana:mainnet&address=So11111111111111111111111111111111111111112\")",
      "Bash(curl -s -m 20 \"http://localhost:8787/v1/balances?network=ton:mainnet&address=UQAAB3njV_lT2eHd4n4Ffgls2OEmnTbm5Os6f6tStVCDk4dr\")",
      "Bash(node --import tsx -e \"import\\('@nova/wallet-core'\\).then\\(async w=>{const{deriveTon}=await import\\('@nova/chains'\\);const seed=w.mnemonicToSeed\\('test test test test test test test test test test test junk'\\);process.stdout.write\\(deriveTon\\(seed,0\\).address\\)}\\)\")",
      "Bash(curl -s -m 20 'http://localhost:8787/v1/balances?network=ton:mainnet&address=__CMDSUB_OUTPUT__')",
      "Bash(echo \"exit: $?\")",
      "Bash(curl -s -m 15 \"http://localhost:8787/v1/balances?network=bitcoin:mainnet&address=bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu\")",
      "Bash(curl -s -m 15 \"http://localhost:8787/v1/balances?network=evm:1&address=0x9858EfFD232B4033E47d90003D41EC34EcaEda94\")",
      "WebSearch",
      "Bash(curl -s -m 15 \"http://localhost:8787/v1/evm/prepare?network=evm:1&address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")",
      "Bash(curl -s -m 15 \"http://localhost:8787/v1/evm/prepare?network=evm:8453&address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")",
      "Bash(curl -s -m 15 -X POST \"http://localhost:8787/v1/broadcast\" -H \"content-type: application/json\" -d '{\"network\":\"evm:1\",\"signed\":\"0xdeadbeef\"}')",
      "Bash(echo \"tc: $?\")",
      "Bash(curl -s -m 25 \"http://localhost:8787/v1/token-balances?network=evm:1&address=0x28C6c06298d514Db089934071355E5743bf21d60\")",
      "Bash(curl -s -m 25 \"http://localhost:8787/v1/token-balances?network=evm:42161&address=0x28C6c06298d514Db089934071355E5743bf21d60\")",
      "Bash(curl -s -m 15 \"https://li.quest/v1/quote?fromChain=1&toChain=1&fromToken=0x0000000000000000000000000000000000000000&toToken=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&fromAmount=100000000000000000&fromAddress=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")",
      "Bash(node -e \"let d='';process.stdin.on\\('data',c=>d+=c\\).on\\('end',\\(\\)=>{try{const j=JSON.parse\\(d\\);console.log\\('tool:',j.tool,'| toAmount:',j.estimate?.toAmount,'| toToken:',j.action?.toToken?.symbol,'| hasTx:',!!j.transactionRequest\\);}catch\\(e\\){console.log\\('ERR/keyed:',d.slice\\(0,150\\)\\)}}\\)\")",
      "Bash(curl -s -m 15 \"https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50\")",
      "Bash(curl -s -m 20 \"http://localhost:8787/v1/swap/quote?network=evm:1&from=native&to=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&amount=0.1&address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")",
      "Bash(node -e \"let d='';process.stdin.on\\('data',c=>d+=c\\).on\\('end',\\(\\)=>{const j=JSON.parse\\(d\\);console.log\\('route:',j.route\\);console.log\\('pay:',j.fromToken?.symbol,'-> get:',j.toAmountFormatted,j.toToken?.symbol\\);console.log\\('minReceived:',j.toAmountMinFormatted\\);console.log\\('priceImpact:',j.priceImpact\\);console.log\\('gasUsd:',j.gasUsd,'| hasTx:',!!j.tx,'| txTo:',j.tx?.to?.slice\\(0,12\\)\\)}\\)\")",
      "Bash(curl -s -m 10 \"http://localhost:8787/v1/prices?ids=ethereum\")",
      "Bash(curl -s -m 20 \"http://localhost:8787/v1/swap/quote?network=evm:1&from=native&to=0xdAC17F958D2ee523a2206206994597C13D831ec7&amount=0.1&address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")",
      "Bash(node -e \"let d='';process.stdin.on\\('data',c=>d+=c\\).on\\('end',\\(\\)=>{const j=JSON.parse\\(d\\);console.log\\(' out:',j.toAmountFormatted,j.toToken?.symbol,'| fromUsd:',j.fromAmountUsd,'| toUsd:',j.toAmountUsd\\)}\\)\")"
    ]
  }
}

```

### `.github\workflows\ci.yml`

```yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Build libraries
        run: npm run build -w @nova/wallet-core -w @nova/telegram-auth -w @nova/chains

      - name: Typecheck
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Unit & integration tests
        run: npm test

      - name: Production build (Mini App)
        run: npm run build -w @nova/miniapp

      - name: Security audit (fail on high)
        run: npm audit --audit-level=high

```

### `apps\api\Dockerfile`

```text
# NovaWallet API (Fastify). Build context = repo root:
#   docker build -f apps/api/Dockerfile -t nova-api .
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY . .
# Install all workspaces, then build the library packages the API imports from dist/.
RUN npm ci && npm run build -w @nova/wallet-core -w @nova/telegram-auth -w @nova/chains

EXPOSE 8787
USER node
# The entrypoint runs the TS server via tsx (kept as a dependency for this).
CMD ["npm", "run", "start", "-w", "@nova/api"]

```

### `apps\api\package.json`

```json
{
  "name": "@nova/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "NovaWallet backend (Fastify). Verified Telegram sessions + wallet metadata. No key material.",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "start": "node --import tsx src/server.ts",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@fastify/cors": "^10.0.1",
    "@fastify/rate-limit": "^10.2.1",
    "@nova/chains": "*",
    "@nova/telegram-auth": "*",
    "dotenv": "^16.4.7",
    "fastify": "^5.2.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}

```

### `apps\api\src\config.ts`

```ts
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";

// Load .env from the repo root if present (dev convenience). Never commit secrets.
loadEnv({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });

export const config = {
  port: Number(process.env.PORT ?? process.env.API_PORT ?? 8787),
  nodeEnv: process.env.NODE_ENV ?? "development",
  botToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  initDataMaxAge: Number(process.env.INITDATA_MAX_AGE_SECONDS ?? 86400),
  /**
   * Dev-only escape hatch: when set AND not in production, skip initData
   * verification so the Mini App can be developed in a plain browser without a
   * bot token. NEVER enable in production.
   */
  devSkipInitData:
    process.env.DEV_SKIP_INITDATA === "1" && process.env.NODE_ENV !== "production",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173").split(","),
};

/**
 * Server-side RPC endpoints, one per network. Public defaults keep the wallet
 * functional out-of-the-box; override per chain via env for production rate limits.
 */
export const RPC: Record<string, string> = {
  "evm:1": process.env.EVM_RPC_URL ?? "https://ethereum-rpc.publicnode.com",
  "evm:42161": process.env.ARBITRUM_RPC_URL ?? "https://arbitrum-one-rpc.publicnode.com",
  "evm:10": process.env.OPTIMISM_RPC_URL ?? "https://optimism-rpc.publicnode.com",
  "evm:8453": process.env.BASE_RPC_URL ?? "https://base-rpc.publicnode.com",
  "evm:56": process.env.BSC_RPC_URL ?? "https://bsc-rpc.publicnode.com",
  "evm:137": process.env.POLYGON_RPC_URL ?? "https://polygon-bor-rpc.publicnode.com",
  "evm:43114": process.env.AVALANCHE_RPC_URL ?? "https://avalanche-c-chain-rpc.publicnode.com",
  "ton:mainnet": process.env.TON_RPC_URL ?? "https://toncenter.com/api/v2/jsonRPC",
  "solana:mainnet": process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com",
  "bitcoin:mainnet": process.env.BITCOIN_API_URL ?? "https://mempool.space/api",
};

export const PRICE_API = process.env.PRICE_API_URL ?? "https://api.coingecko.com/api/v3";

export function assertProdConfig(): void {
  if (config.nodeEnv === "production") {
    if (!config.botToken) throw new Error("TELEGRAM_BOT_TOKEN is required in production.");
    if (config.devSkipInitData) throw new Error("DEV_SKIP_INITDATA must be off in production.");
  }
}

```

### `apps\api\src\plugins\telegramAuth.ts`

```ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyInitData, InitDataError, type TelegramUser } from "@nova/telegram-auth";
import { config } from "../config.js";

declare module "fastify" {
  interface FastifyRequest {
    telegramUser?: TelegramUser;
  }
}

/**
 * preHandler that verifies the Telegram initData carried in
 * `Authorization: tma <initData>` and attaches the trusted user to the request.
 * In dev with DEV_SKIP_INITDATA it attaches a stub user so the UI can be built
 * without a bot token.
 */
export async function requireTelegramAuth(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (config.devSkipInitData) {
    req.telegramUser = { id: 1, username: "dev_user", language_code: "en" };
    return;
  }

  const header = req.headers["authorization"];
  if (!header || !header.startsWith("tma ")) {
    return reply.code(401).send({
      error: { code: "no_auth", message: "Missing Telegram session.", hint: "Open inside Telegram." },
    });
  }

  try {
    const verified = verifyInitData(header.slice(4), {
      botToken: config.botToken,
      maxAgeSeconds: config.initDataMaxAge,
    });
    req.telegramUser = verified.user;
  } catch (err) {
    const code = err instanceof InitDataError ? err.code : "bad_auth";
    return reply.code(401).send({
      error: { code, message: "Telegram session is invalid or expired.", hint: "Reopen the app." },
    });
  }
}

```

### `apps\api\src\routes\index.ts`

```ts
import type { FastifyInstance } from "fastify";
import { NETWORKS } from "@nova/chains";
import { requireTelegramAuth } from "../plugins/telegramAuth.js";
import { getPrices } from "../services/prices.js";
import { getNativeBalance } from "../services/balances.js";
import { prepareEvm, broadcast } from "../services/tx.js";
import { getTokenBalances } from "../services/tokenBalances.js";
import { swapQuote } from "../services/swap.js";

/**
 * Phase-1 routes. Read-only/metadata only — no endpoint accepts or returns key
 * material. Swap/bridge build (which return UNSIGNED txs) arrive in Phase 2.
 */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Liveness — unauthenticated so health checks / previews work without a session.
  app.get("/health", async () => ({ status: "ok", time: new Date().toISOString() }));

  // Public network registry.
  app.get("/v1/networks", async () => ({
    networks: Object.values(NETWORKS),
  }));

  // Token prices (USD) — comma-separated CoinGecko ids.
  app.get("/v1/prices", async (req, reply) => {
    const ids = String((req.query as { ids?: string }).ids ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 50);
    if (ids.length === 0) {
      return reply.code(400).send({ error: { code: "bad_request", message: "Provide ?ids=", hint: "e.g. ids=bitcoin,ethereum" } });
    }
    return { prices: await getPrices(ids) };
  });

  // Token (non-native) balances for an address on a network.
  app.get("/v1/token-balances", async (req, reply) => {
    const { network, address } = req.query as { network?: string; address?: string };
    if (!network || !NETWORKS[network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown network.", hint: "Use /v1/networks" } });
    }
    if (!address || address.length < 8 || address.length > 120) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Missing or malformed address.", hint: "Pass ?address=" } });
    }
    try {
      return { tokens: await getTokenBalances(network, address) };
    } catch (err) {
      req.log.warn({ network, err: (err as Error).message }, "token balances failed");
      return reply.code(502).send({ error: { code: "tokens_unavailable", message: "Couldn't load token balances.", hint: "Try again." } });
    }
  });

  // Native balance for an address on a network.
  app.get("/v1/balances", async (req, reply) => {
    const { network, address } = req.query as { network?: string; address?: string };
    if (!network || !NETWORKS[network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown or missing network.", hint: "Use an id from /v1/networks" } });
    }
    if (!address || address.length < 8 || address.length > 120) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Missing or malformed address.", hint: "Pass ?address=" } });
    }
    try {
      return await getNativeBalance(network, address);
    } catch (err) {
      req.log.warn({ network, err: (err as Error).message }, "balance lookup failed");
      return reply.code(502).send({ error: { code: "balance_unavailable", message: "Couldn't reach the network right now.", hint: "Try again shortly." } });
    }
  });

  // Prepare an EVM native transfer (nonce + fees). Client builds & signs locally.
  app.get("/v1/evm/prepare", async (req, reply) => {
    const { network, address } = req.query as { network?: string; address?: string };
    if (!network || !NETWORKS[network] || NETWORKS[network]!.family !== "evm") {
      return reply.code(400).send({ error: { code: "bad_network", message: "EVM network required.", hint: "Use an evm:* id" } });
    }
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Valid EVM address required.", hint: "0x…" } });
    }
    try {
      return await prepareEvm(network, address);
    } catch (err) {
      req.log.warn({ network, err: (err as Error).message }, "prepare failed");
      return reply.code(502).send({ error: { code: "prepare_failed", message: "Couldn't reach the network.", hint: "Try again." } });
    }
  });

  // DeFi swap quote (EVM via LI.FI). Returns a normalized quote + UNSIGNED tx.
  app.get("/v1/swap/quote", async (req, reply) => {
    const q = req.query as Record<string, string | undefined>;
    if (!q.network || !NETWORKS[q.network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown network.", hint: "Use /v1/networks" } });
    }
    if (!q.from || !q.to || !q.amount || !q.address) {
      return reply.code(400).send({ error: { code: "bad_request", message: "Missing from/to/amount/address.", hint: "" } });
    }
    if (!/^\d+(\.\d+)?$/.test(q.amount) || Number(q.amount) <= 0) {
      return reply.code(400).send({ error: { code: "bad_amount", message: "Invalid amount.", hint: "" } });
    }
    try {
      return await swapQuote({
        networkId: q.network, from: q.from, to: q.to, amount: q.amount, address: q.address,
        slippage: q.slippage ? Number(q.slippage) : undefined,
      });
    } catch (err) {
      return reply.code(502).send({ error: { code: "quote_failed", message: (err as Error).message.slice(0, 160), hint: "Try a different amount or pair." } });
    }
  });

  // Relay an already-signed transaction. Never signs.
  app.post("/v1/broadcast", async (req, reply) => {
    const { network, signed } = (req.body ?? {}) as { network?: string; signed?: string };
    if (!network || !NETWORKS[network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown network.", hint: "Use /v1/networks" } });
    }
    if (!signed || typeof signed !== "string" || signed.length < 8) {
      return reply.code(400).send({ error: { code: "bad_payload", message: "Missing signed transaction.", hint: "Send { network, signed }" } });
    }
    try {
      return await broadcast(network, signed);
    } catch (err) {
      // Node errors (e.g. insufficient funds) are surfaced verbatim-ish for the user.
      return reply.code(400).send({ error: { code: "broadcast_rejected", message: (err as Error).message.slice(0, 200), hint: "Check balance and inputs." } });
    }
  });

  // Verify the Telegram session and return a minimal profile.
  app.post("/v1/auth/session", { preHandler: requireTelegramAuth }, async (req) => ({
    user: req.telegramUser ?? null,
    featureFlags: { swaps: false, bridge: false, regulatedModules: false },
  }));

  // Example authenticated metadata route (wallet list would read from DB in full impl).
  app.get("/v1/me", { preHandler: requireTelegramAuth }, async (req) => ({
    user: req.telegramUser ?? null,
    prefs: { language: req.telegramUser?.language_code ?? "en", theme: "system" },
  }));
}

```

### `apps\api\src\server.ts`

```ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { config, assertProdConfig } from "./config.js";
import { registerRoutes } from "./routes/index.js";

async function main(): Promise<void> {
  assertProdConfig();

  const app = Fastify({
    logger: {
      level: config.nodeEnv === "production" ? "info" : "debug",
      // Never log secrets: redact common sensitive header/body paths defensively.
      redact: ["req.headers.authorization", "*.privateKey", "*.mnemonic", "*.seed"],
    },
  });

  // Security headers (a CDN/proxy should also set CSP/HSTS in production).
  app.addHook("onSend", async (_req, reply, payload) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("Referrer-Policy", "no-referrer");
    reply.header("X-Frame-Options", "DENY");
    return payload;
  });

  await app.register(cors, { origin: config.corsOrigins, credentials: true });
  await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
  await registerRoutes(app);

  await app.listen({ port: config.port, host: "0.0.0.0" });
  app.log.info(
    `NovaWallet API on :${config.port} (env=${config.nodeEnv}, devSkipInitData=${config.devSkipInitData})`,
  );
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

```

### `apps\api\src\services\balances.ts`

```ts
/**
 * Native balance lookups across chains. Uses the @nova/chains providers with the
 * server-side RPC endpoints. Read-only — never touches key material.
 */
import {
  getNetwork,
  formatUnits,
  EvmProvider,
  TonProvider,
  SolanaProvider,
  BitcoinProvider,
} from "@nova/chains";
import { RPC } from "../config.js";

export interface NativeBalanceResult {
  networkId: string;
  symbol: string;
  decimals: number;
  raw: string;
  formatted: string;
}

export async function getNativeBalance(
  networkId: string,
  address: string,
): Promise<NativeBalanceResult> {
  const net = getNetwork(networkId);
  const rpcUrl = RPC[networkId];
  if (!rpcUrl) throw new Error(`No RPC configured for ${networkId}`);
  const cfg = { ...net, rpcUrl };

  let raw: string, decimals: number, symbol: string;
  switch (net.family) {
    case "evm": {
      const b = await new EvmProvider(cfg).getNativeBalance(address as `0x${string}`);
      ({ raw, decimals, symbol } = b);
      break;
    }
    case "ton": {
      const b = await new TonProvider(cfg).getNativeBalance(address);
      ({ raw, decimals, symbol } = b);
      break;
    }
    case "solana": {
      const b = await new SolanaProvider(cfg).getNativeBalance(address);
      ({ raw, decimals, symbol } = b);
      break;
    }
    case "bitcoin": {
      const b = await new BitcoinProvider(cfg).getNativeBalance(address);
      ({ raw, decimals, symbol } = b);
      break;
    }
    default:
      throw new Error(`Unsupported family for ${networkId}`);
  }

  return { networkId, symbol, decimals, raw, formatted: formatUnits(BigInt(raw), decimals) };
}

```

### `apps\api\src\services\prices.ts`

```ts
/**
 * Token price service. Proxies CoinGecko (so the client needs no key / avoids
 * CORS) with a short in-memory cache to stay within free rate limits.
 */
import { PRICE_API } from "../config.js";

type PriceMap = Record<string, number>;
const TTL_MS = 60_000;

const cache = new Map<string, { at: number; usd: number }>();

export async function getPrices(ids: string[]): Promise<PriceMap> {
  const wanted = [...new Set(ids.filter(Boolean))];
  const now = Date.now();
  const fresh: PriceMap = {};
  const stale: string[] = [];

  for (const id of wanted) {
    const hit = cache.get(id);
    if (hit && now - hit.at < TTL_MS) fresh[id] = hit.usd;
    else stale.push(id);
  }

  if (stale.length > 0) {
    const url = `${PRICE_API}/simple/price?ids=${encodeURIComponent(stale.join(","))}&vs_currencies=usd`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (res.ok) {
      const data = (await res.json()) as Record<string, { usd?: number }>;
      for (const id of stale) {
        const usd = data[id]?.usd;
        if (typeof usd === "number") {
          cache.set(id, { at: now, usd });
          fresh[id] = usd;
        }
      }
    }
  }
  return fresh;
}

```

### `apps\api\src\services\swap.ts`

```ts
/**
 * Swap quotes via LI.FI (free, no key) — a DEX aggregator covering every EVM
 * chain we support. Returns a normalized quote PLUS the unsigned transaction, so
 * the client can review, sign locally, and broadcast — fully non-custodial. The
 * server never signs and never holds keys.
 */
import { getNetwork, tokensForNetwork, parseUnits, formatUnits } from "@nova/chains";

const LIFI = "https://li.quest/v1";
const NATIVE = "0x0000000000000000000000000000000000000000";

interface ResolvedToken { address: string; decimals: number; symbol: string }

function resolveToken(networkId: string, ref: string): ResolvedToken {
  const net = getNetwork(networkId);
  if (ref === "native" || ref.toLowerCase() === NATIVE) {
    return { address: NATIVE, decimals: net.nativeDecimals, symbol: net.nativeSymbol };
  }
  const tok = tokensForNetwork(networkId).find((t) => t.address?.toLowerCase() === ref.toLowerCase());
  if (!tok || !tok.address) throw new Error(`Unknown token ${ref} on ${networkId}`);
  return { address: tok.address, decimals: tok.decimals, symbol: tok.symbol };
}

export interface SwapQuote {
  route: string;
  fromToken: ResolvedToken;
  toToken: ResolvedToken;
  fromAmount: string;
  toAmount: string;
  toAmountFormatted: string;
  toAmountMinFormatted: string;
  fromAmountUsd: number | null;
  toAmountUsd: number | null;
  priceImpact: number | null;
  gasUsd: number | null;
  tx: { to: string; data: string; value: string; gasLimit: string; gasPrice: string; chainId: number } | null;
}

export async function swapQuote(params: {
  networkId: string;
  from: string;
  to: string;
  amount: string;
  address: string;
  slippage?: number;
}): Promise<SwapQuote> {
  const net = getNetwork(params.networkId);
  if (net.family !== "evm") throw new Error("Swap is currently supported on EVM networks only.");
  const fromT = resolveToken(params.networkId, params.from);
  const toT = resolveToken(params.networkId, params.to);
  const rawAmount = parseUnits(params.amount, fromT.decimals).toString();
  const slippage = params.slippage ?? 0.005;

  const url =
    `${LIFI}/quote?fromChain=${net.chainId}&toChain=${net.chainId}` +
    `&fromToken=${fromT.address}&toToken=${toT.address}` +
    `&fromAmount=${rawAmount}&fromAddress=${params.address}&slippage=${slippage}`;

  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Quote failed (${res.status}): ${body.slice(0, 140)}`);
  }
  const q = (await res.json()) as {
    tool?: string;
    estimate?: {
      fromAmount: string; toAmount: string; toAmountMin: string;
      fromAmountUSD?: string; toAmountUSD?: string;
      gasCosts?: { amountUSD?: string }[];
    };
    transactionRequest?: { to: string; data: string; value?: string; gasLimit?: string; gasPrice?: string };
  };
  const est = q.estimate;
  if (!est) throw new Error("No route found for this pair.");

  const fromUsd = Number(est.fromAmountUSD ?? 0);
  const toUsd = Number(est.toAmountUSD ?? 0);
  // Signed price impact: positive = you lose value (slippage/impact); negative =
  // output worth MORE than input, which for a real swap is impossible and flags a
  // mispriced/low-liquidity route. We do NOT clamp it — the client warns on anomalies.
  const priceImpact = fromUsd > 0 && toUsd > 0 ? (fromUsd - toUsd) / fromUsd : null;
  const gasUsd = (est.gasCosts ?? []).reduce((s, g) => s + Number(g.amountUSD ?? 0), 0) || null;

  return {
    route: q.tool ?? "aggregator",
    fromToken: fromT,
    toToken: toT,
    fromAmount: est.fromAmount,
    toAmount: est.toAmount,
    toAmountFormatted: formatUnits(BigInt(est.toAmount), toT.decimals),
    toAmountMinFormatted: formatUnits(BigInt(est.toAmountMin), toT.decimals),
    fromAmountUsd: fromUsd || null,
    toAmountUsd: toUsd || null,
    priceImpact,
    gasUsd,
    tx: q.transactionRequest
      ? {
          to: q.transactionRequest.to,
          data: q.transactionRequest.data,
          value: q.transactionRequest.value ?? "0x0",
          gasLimit: q.transactionRequest.gasLimit ?? "0x30000",
          gasPrice: q.transactionRequest.gasPrice ?? "0x0",
          chainId: net.chainId!,
        }
      : null,
  };
}

```

### `apps\api\src\services\tokenBalances.ts`

```ts
/**
 * Token (non-native) balances for an address on a network. EVM uses Multicall3
 * to batch ERC-20 balanceOf; Solana reads SPL token accounts. Only tokens from
 * the curated registry are returned (so we never surface unknown/spam tokens),
 * and only those with a non-zero balance.
 */
import {
  getNetwork,
  tokensForNetwork,
  formatUnits,
  EvmProvider,
  SolanaProvider,
  type TokenInfo,
} from "@nova/chains";
import { RPC } from "../config.js";

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  coingeckoId?: string;
  raw: string;
  formatted: string;
}

function toResult(tok: TokenInfo, raw: string): TokenBalance {
  return {
    symbol: tok.symbol,
    name: tok.name,
    address: tok.address!,
    decimals: tok.decimals,
    coingeckoId: tok.coingeckoId,
    raw,
    formatted: formatUnits(BigInt(raw), tok.decimals),
  };
}

export async function getTokenBalances(networkId: string, address: string): Promise<TokenBalance[]> {
  const net = getNetwork(networkId);
  const rpcUrl = RPC[networkId];
  if (!rpcUrl) return [];
  const tokens = tokensForNetwork(networkId).filter((t) => !t.native && t.address);

  if (net.family === "evm") {
    const provider = new EvmProvider({ ...net, rpcUrl });
    const raws = await provider.getTokenBalances(
      address as `0x${string}`,
      tokens.map((t) => t.address as `0x${string}`),
    );
    return tokens
      .map((t, i) => toResult(t, raws[i] ?? "0"))
      .filter((t) => BigInt(t.raw) > 0n);
  }

  if (net.family === "solana") {
    const provider = new SolanaProvider({ ...net, rpcUrl });
    const byMint = await provider.getTokenBalances(address);
    return tokens
      .map((t) => toResult(t, byMint[t.address!] ?? "0"))
      .filter((t) => BigInt(t.raw) > 0n);
  }

  // TON jettons / Bitcoin: no token balances yet.
  return [];
}

```

### `apps\api\src\services\tx.ts`

```ts
/**
 * Transaction prep + broadcast proxy. Keeps the wallet non-custodial: the server
 * supplies the data needed to build a tx (nonce/fees) and relays the already-
 * SIGNED payload, but never holds keys and never signs.
 */
import {
  getNetwork,
  EvmProvider,
  TonProvider,
  SolanaProvider,
  BitcoinProvider,
} from "@nova/chains";
import { RPC } from "../config.js";

function rpc(networkId: string): string {
  const url = RPC[networkId];
  if (!url) throw new Error(`No RPC for ${networkId}`);
  return url;
}

export interface EvmPrepared {
  chainId: number;
  nonce: number;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gas: string;
}

/** Fetch nonce + suggested EIP-1559 fees for a native EVM transfer. */
export async function prepareEvm(networkId: string, address: string): Promise<EvmPrepared> {
  const net = getNetwork(networkId);
  if (net.family !== "evm") throw new Error("prepareEvm: not an EVM network");
  const provider = new EvmProvider({ ...net, rpcUrl: rpc(networkId) });
  const [nonce, fees] = await Promise.all([
    provider.getNonce(address as `0x${string}`),
    provider.suggestFees(),
  ]);
  return {
    chainId: net.chainId!,
    nonce,
    maxFeePerGas: fees.maxFeePerGas.toString(),
    maxPriorityFeePerGas: fees.maxPriorityFeePerGas.toString(),
    gas: "21000",
  };
}

/** Relay a signed transaction for any family. Returns the tx hash where available. */
export async function broadcast(networkId: string, signed: string): Promise<{ hash: string | null }> {
  const net = getNetwork(networkId);
  const cfg = { ...net, rpcUrl: rpc(networkId) };
  switch (net.family) {
    case "evm":
      return { hash: await new EvmProvider(cfg).broadcast(signed as `0x${string}`) };
    case "ton":
      await new TonProvider(cfg).broadcastBoc(signed);
      return { hash: null };
    case "solana":
      return { hash: await new SolanaProvider(cfg).broadcast(signed) };
    case "bitcoin":
      return { hash: await new BitcoinProvider(cfg).broadcast(signed) };
    default:
      throw new Error(`Unsupported family for ${networkId}`);
  }
}

```

### `apps\api\tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "lib": ["ES2022"],
    "types": ["node"]
  },
  "include": ["src/**/*"]
}

```

### `apps\miniapp\Dockerfile`

```text
# NovaWallet Mini App (static). Build context = repo root:
#   docker build -f apps/miniapp/Dockerfile --build-arg VITE_API_BASE_URL=https://api.example.com -t nova-miniapp .
FROM node:20-slim AS build
WORKDIR /app
# VITE_* values are inlined at build time, so they must be passed as build args.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY . .
RUN npm ci \
 && npm run build -w @nova/wallet-core -w @nova/telegram-auth -w @nova/chains \
 && npm run build -w @nova/miniapp

FROM nginx:alpine AS run
COPY --from=build /app/apps/miniapp/dist /usr/share/nginx/html
COPY apps/miniapp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

```

### `apps\miniapp\index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
    <meta name="color-scheme" content="light dark" />
    <title>NovaWallet</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

### `apps\miniapp\package.json`

```json
{
  "name": "@nova/miniapp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "NovaWallet Telegram Mini App (Vite + React). The only place keys live (client-side).",
  "scripts": {
    "dev": "vite --port 5173 --host",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 5173",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@nova/chains": "*",
    "@nova/wallet-core": "*",
    "buffer": "^6.0.3",
    "i18next": "^24.2.1",
    "i18next-browser-languagedetector": "^8.0.2",
    "qrcode": "^1.5.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^15.4.0"
  },
  "devDependencies": {
    "@types/qrcode": "^1.5.5",
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "vite": "^6.0.5"
  }
}

```

### `apps\miniapp\src\api.ts`

```ts
import { getInitData } from "./telegram.js";

const BASE = (import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE_URL ?? "http://localhost:8787";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // Send the Telegram session for verification (empty string in plain browser).
      Authorization: `tma ${getInitData()}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export interface NetworkInfo {
  id: string;
  family: string;
  name: string;
  nativeSymbol: string;
  isTestnet: boolean;
}

export interface BalanceResult {
  networkId: string;
  symbol: string;
  decimals: number;
  raw: string;
  formatted: string;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  coingeckoId?: string;
  raw: string;
  formatted: string;
}

export interface SwapTx { to: string; data: string; value: string; gasLimit: string; gasPrice: string; chainId: number }
export interface SwapQuote {
  route: string;
  fromToken: { symbol: string; address: string; decimals: number };
  toToken: { symbol: string; address: string; decimals: number };
  toAmountFormatted: string;
  toAmountMinFormatted: string;
  fromAmountUsd: number | null;
  toAmountUsd: number | null;
  priceImpact: number | null;
  gasUsd: number | null;
  tx: SwapTx | null;
}

export const api = {
  health: () => request<{ status: string; time: string }>("/health"),
  networks: () => request<{ networks: NetworkInfo[] }>("/v1/networks"),
  session: () =>
    request<{ user: unknown; featureFlags: Record<string, boolean> }>("/v1/auth/session", {
      method: "POST",
    }),
  prices: (ids: string[]) =>
    request<{ prices: Record<string, number> }>(`/v1/prices?ids=${encodeURIComponent(ids.join(","))}`),
  balance: (network: string, address: string) =>
    request<BalanceResult>(`/v1/balances?network=${encodeURIComponent(network)}&address=${encodeURIComponent(address)}`),
  tokenBalances: (network: string, address: string) =>
    request<{ tokens: TokenBalance[] }>(`/v1/token-balances?network=${encodeURIComponent(network)}&address=${encodeURIComponent(address)}`),
  evmPrepare: (network: string, address: string) =>
    request<{ chainId: number; nonce: number; maxFeePerGas: string; maxPriorityFeePerGas: string; gas: string }>(
      `/v1/evm/prepare?network=${encodeURIComponent(network)}&address=${encodeURIComponent(address)}`,
    ),
  broadcast: (network: string, signed: string) =>
    request<{ hash: string | null }>("/v1/broadcast", {
      method: "POST",
      body: JSON.stringify({ network, signed }),
    }),
  swapQuote: (p: { network: string; from: string; to: string; amount: string; address: string }) =>
    request<SwapQuote>(
      `/v1/swap/quote?network=${encodeURIComponent(p.network)}&from=${encodeURIComponent(p.from)}&to=${encodeURIComponent(p.to)}&amount=${encodeURIComponent(p.amount)}&address=${encodeURIComponent(p.address)}`,
    ),
};

```

### `apps\miniapp\src\App.tsx`

```tsx
import { useState } from "react";
import { useWallet } from "./wallet/store.js";
import { Welcome } from "./screens/Welcome.js";
import { CreateWallet } from "./screens/CreateWallet.js";
import { ImportWallet } from "./screens/ImportWallet.js";
import { Unlock } from "./screens/Unlock.js";
import { Home } from "./screens/Home.js";

type OnboardingRoute = "welcome" | "create" | "import";

export default function App() {
  const { status } = useWallet();
  const [route, setRoute] = useState<OnboardingRoute>("welcome");

  if (status === "loading") {
    return (
      <div className="app center">
        <div className="brand big"><div className="mark" /><h1>NovaWallet</h1></div>
        <div className="skeleton" style={{ width: 180, height: 16 }} />
      </div>
    );
  }

  if (status === "unlocked") return <Home />;
  if (status === "locked") return <Unlock />;

  // status === "no-wallet" → onboarding
  if (route === "create") return <CreateWallet onDone={() => setRoute("welcome")} onBack={() => setRoute("welcome")} />;
  if (route === "import") return <ImportWallet onDone={() => setRoute("welcome")} onBack={() => setRoute("welcome")} />;
  return <Welcome onCreate={() => setRoute("create")} onImport={() => setRoute("import")} />;
}

```

### `apps\miniapp\src\components\CoinLogo.tsx`

```tsx
import { useState } from "react";
import { NetworkBadge } from "./NetworkBadge.js";

/**
 * Coin/token logo image with a graceful fallback to a colored badge when the
 * asset 404s or fails to load (not every token has a hosted logo).
 */
export function CoinLogo({
  src,
  networkId,
  symbol,
  size = 36,
}: {
  src?: string;
  networkId: string;
  symbol: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <NetworkBadge id={networkId} symbol={symbol} size={size} />;
  return (
    <img
      className="coin-logo"
      src={src}
      width={size}
      height={size}
      alt={symbol}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
    />
  );
}

```

### `apps\miniapp\src\components\ErrorBoundary.tsx`

```tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface State { error: Error | null }

/**
 * Top-level error boundary. Prevents a render crash from blanking the app and
 * shows a recoverable screen. Never logs sensitive payloads — only the message.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Message + component stack only; never wallet state or secrets.
    console.error("UI error:", error.message, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="app center">
          <div className="brand big"><div className="mark" /><h1>NovaWallet</h1></div>
          <p className="lead">Something went wrong. Your funds are safe — your keys never left this device.</p>
          <button className="btn" onClick={() => location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

```

### `apps\miniapp\src\components\LanguageSwitcher.tsx`

```tsx
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n/locales.js";
import { changeLanguage } from "../i18n/index.js";
import { haptic } from "../telegram.js";

/** Compact language picker (native <select> for accessibility + small footprint). */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const current = (i18n.language || "en").split("-")[0];

  return (
    <label className={`lang-switch ${compact ? "compact" : ""}`} aria-label={t("common.language")}>
      <span className="globe">🌐</span>
      <select
        value={current}
        onChange={(e) => { haptic("light"); changeLanguage(e.target.value); }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}

```

### `apps\miniapp\src\components\NetworkBadge.tsx`

```tsx
import { networkColor } from "../networkMeta.js";

/** Colored round badge with the network's native symbol. */
export function NetworkBadge({ id, symbol, size = 36 }: { id: string; symbol: string; size?: number }) {
  const color = networkColor(id);
  return (
    <span
      className="net-badge"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        fontSize: Math.max(9, Math.round(size * 0.3)),
      }}
    >
      {symbol.slice(0, 4)}
    </span>
  );
}

```

### `apps\miniapp\src\components\NetworkSelector.tsx`

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNetwork } from "../context/network.js";
import { CoinLogo } from "./CoinLogo.js";
import { nativeLogo } from "../networkMeta.js";
import { haptic } from "../telegram.js";

/** Network dropdown: a pill that opens a bottom sheet listing every network. */
export function NetworkSelector() {
  const { t } = useTranslation();
  const { networks, active, setActive } = useNetwork();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="net-pill" onClick={() => { haptic("light"); setOpen(true); }}>
        <CoinLogo src={nativeLogo(active.id)} networkId={active.id} symbol={active.nativeSymbol} size={22} />
        <span className="net-pill-name">{active.name}</span>
        <span className="net-pill-caret">▾</span>
      </button>

      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h2 className="sheet-title">{t("network.select")}</h2>
            <div className="net-list">
              {networks.map((n) => (
                <button
                  key={n.id}
                  className={`net-item ${n.id === active.id ? "active" : ""}`}
                  onClick={() => { haptic("light"); setActive(n.id); setOpen(false); }}
                >
                  <CoinLogo src={nativeLogo(n.id)} networkId={n.id} symbol={n.nativeSymbol} size={34} />
                  <div className="net-item-text">
                    <div className="net-item-name">{n.name}</div>
                    <div className="net-item-sym">{n.nativeSymbol}</div>
                  </div>
                  {n.id === active.id && <span className="net-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

```

### `apps\miniapp\src\components\PinPad.tsx`

```tsx
import { useEffect, useState } from "react";
import { haptic } from "../telegram.js";

const PIN_LENGTH = 6;

/** Numeric PIN entry. Calls onComplete once PIN_LENGTH digits are entered. */
export function PinPad({
  onComplete,
  resetSignal,
}: {
  onComplete: (pin: string) => void;
  /** Change this value to clear the current entry (e.g. after a wrong PIN). */
  resetSignal?: number;
}) {
  const [pin, setPin] = useState("");

  useEffect(() => setPin(""), [resetSignal]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) onComplete(pin);
  }, [pin]);

  const press = (d: string) => {
    haptic("light");
    setPin((p) => (p.length < PIN_LENGTH ? p + d : p));
  };
  const back = () => {
    haptic("light");
    setPin((p) => p.slice(0, -1));
  };

  return (
    <div className="pinpad">
      <div className="pin-dots">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span key={i} className={`pin-dot ${i < pin.length ? "filled" : ""}`} />
        ))}
      </div>
      <div className="pin-keys">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button key={d} className="pin-key" onClick={() => press(d)}>
            {d}
          </button>
        ))}
        <span />
        <button className="pin-key" onClick={() => press("0")}>0</button>
        <button className="pin-key ghost" onClick={back} aria-label="Delete">⌫</button>
      </div>
    </div>
  );
}

```

### `apps\miniapp\src\context\network.tsx`

```tsx
/**
 * Active-network context. Lets the user pick a network from a dropdown (MetaMask
 * pattern); the rest of the app reads `active` to decide which chain to show,
 * which account address applies, and which balance to fetch.
 */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { NETWORKS } from "@nova/chains";
import type { NetworkInfo } from "../api.js";

interface NetworkContextValue {
  networks: NetworkInfo[];
  active: NetworkInfo;
  setActive: (id: string) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const networks = useMemo(
    () => Object.values(NETWORKS).filter((n) => !n.isTestnet) as NetworkInfo[],
    [],
  );
  const [activeId, setActiveId] = useState<string>("evm:1");
  const active = (NETWORKS[activeId] ?? networks[0]) as NetworkInfo;

  return (
    <NetworkContext.Provider value={{ networks, active, setActive: setActiveId }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}

```

### `apps\miniapp\src\i18n\index.ts`

```ts
/**
 * i18n setup. Detects the user's language (Telegram language_code → browser →
 * stored choice), falls back to English, and keeps document direction (LTR/RTL)
 * in sync so Persian/Arabic render correctly.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources, RTL_LANGS } from "./locales.js";

const STORAGE_KEY = "nova_lang";

export function applyDirection(lang: string): void {
  const base = lang.split("-")[0]!;
  const dir = RTL_LANGS.includes(base) ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = base;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(resources),
    nonExplicitSupportedLngs: true, // map en-US → en, fa-IR → fa, etc.
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

applyDirection(i18n.language || "en");
i18n.on("languageChanged", applyDirection);

export function changeLanguage(lang: string): void {
  localStorage.setItem(STORAGE_KEY, lang);
  void i18n.changeLanguage(lang);
}

export default i18n;

```

### `apps\miniapp\src\i18n\locales.ts`

```ts
/**
 * Translation resources. English is the complete reference; i18next falls back
 * to it for any missing key, so partial locales are safe. RTL languages (fa, ar)
 * are flagged in RTL_LANGS and drive document direction in i18n/index.ts.
 */
export const RTL_LANGS = ["fa", "ar", "he", "ur"];

export interface LanguageMeta {
  code: string;
  /** Endonym (name in its own language). */
  label: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", label: "English" },
  { code: "fa", label: "فارسی" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "tr", label: "Türkçe" },
  { code: "zh", label: "中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "pt", label: "Português" },
  { code: "id", label: "Bahasa Indonesia" },
];

const en = {
  app: { tagline: "Self-custodial wallet for Telegram" },
  welcome: {
    lead: "You hold the keys — your recovery phrase stays on this device and is never sent to our servers.",
    create: "Create a new wallet",
    import: "I already have a wallet",
    fineprint: "Losing your recovery phrase means losing access to your funds — no one can restore it for you.",
  },
  bullets: { keys: "🔐 Keys encrypted on your device", chains: "🌐 Bitcoin, Ethereum, Solana, TON, BNB, Polygon, Arbitrum, Optimism, Base & Avalanche", warnings: "🛡️ Clear risk warnings before you sign" },
  create: {
    warnTitle: "Before you start", warnHeading: "Your recovery phrase is the only backup",
    warnBody: "You'll see 12 words. Write them down in order and keep them offline. Anyone with these words can take your funds.",
    write: "✍️ Write them on paper", share: "🙈 Never share them", chat: "📵 We never ask for them in chat",
    understand: "I understand, show my phrase", phraseTitle: "Your recovery phrase", reveal: "Tap to reveal", written: "I've written it down",
    confirmTitle: "Confirm your backup", confirmLead: "Enter the requested words to confirm you saved your phrase.",
    word: "Word #{{n}}", enterWord: "Enter word {{n}}", confirm: "Confirm",
    pinTitle: "Set a PIN", pinLead: "Your PIN encrypts the wallet on this device.",
  },
  import: { title: "Import wallet", lead: "Enter your 12 or 24-word recovery phrase.", valid: "✓ Valid recovery phrase", invalid: "Phrase is incomplete or invalid", privacy: "Your phrase is processed only on this device.", continue: "Continue" },
  unlock: { lead: "Enter your PIN to unlock.", wrong: "Incorrect PIN. Try again.", forgot: "Forgot PIN? Restore from recovery phrase" },
  home: { total: "Total balance", send: "Send", receive: "Receive", swap: "Swap", history: "History", tokens: "Tokens", accounts: "Wallet", lock: "Lock", selfCustody: "Self-custody active", selfCustodyBody: "Your phrase is encrypted on this device only. Switch networks with the selector above.", assetsOn: "Your account on {{network}}" },
  network: { select: "Select a network" },
  swap: {
    title: "Swap", youPay: "You pay", youReceive: "You receive", route: "Route", priceImpact: "Price impact",
    minReceived: "Minimum received", networkFee: "Network fee", confirm: "Confirm swap",
    notSupported: "Swap isn't available on this network yet. Try an EVM network (Ethereum, BSC, Polygon…).",
    sent: "Swap submitted", failed: "Swap failed",
  },
  receive: { title: "Receive {{symbol}}", copy: "Copy address", copied: "Copied ✓", close: "Close", warn: "Only send {{symbol}} and {{label}} assets to this address." },
  tokens: { title: "Tokens", search: "Search name or symbol", count: "{{count}} tokens supported", popular: "Popular tokens" },
  send: {
    title: "Send", from: "From", to: "To", recipient: "Recipient address", recipientPlaceholder: "Paste or enter address",
    amount: "Amount", max: "Max", network: "Network", fee: "Estimated network fee", review: "Review",
    reviewTitle: "Review transaction", confirm: "Confirm & sign", invalidAddress: "Enter a valid address for this network",
    insufficient: "Amount exceeds your balance", riskGreen: "Looks safe", riskYellow: "Review the warnings", riskRed: "Unsafe — blocked",
    notConnected: "Network not connected", needRpc: "Add an RPC endpoint for this network to send. Nothing was broadcast.",
    broadcastFail: "Couldn't broadcast — check your connection and try again.", sent: "Transaction sent", viewTx: "Transaction hash",
  },
  common: { language: "Language", cancel: "Cancel", done: "Done" },
};

type Dict = typeof en;
type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const fa: DeepPartial<Dict> = {
  app: { tagline: "کیف‌پول غیرامانی برای تلگرام" },
  welcome: { lead: "کلیدها در دست شماست — عبارت بازیابی روی همین دستگاه می‌ماند و هرگز به سرورهای ما ارسال نمی‌شود.", create: "ساخت کیف‌پول جدید", import: "از قبل کیف‌پول دارم", fineprint: "از دست دادن عبارت بازیابی یعنی از دست دادن دارایی‌ها — هیچ‌کس نمی‌تواند آن را برایتان بازگرداند." },
  bullets: { keys: "🔐 کلیدها روی دستگاه شما رمزگذاری می‌شوند", chains: "🌐 بیت‌کوین، اتریوم، سولانا، تون، بایننس، پالیگان، آربیتروم، اپتیمیزم، بیس و آوالانچ", warnings: "🛡️ هشدارهای ریسک شفاف پیش از امضا" },
  create: { warnTitle: "پیش از شروع", warnHeading: "عبارت بازیابی تنها نسخهٔ پشتیبان است", warnBody: "۱۲ کلمه می‌بینید. آن‌ها را به‌ترتیب بنویسید و آفلاین نگه دارید. هرکس این کلمات را داشته باشد می‌تواند دارایی‌تان را بردارد.", write: "✍️ روی کاغذ بنویسید", share: "🙈 هرگز با کسی به اشتراک نگذارید", chat: "📵 ما هرگز در چت آن را نمی‌خواهیم", understand: "متوجه شدم، عبارت را نشان بده", phraseTitle: "عبارت بازیابی شما", reveal: "برای نمایش بزنید", written: "نوشتم", confirmTitle: "تأیید پشتیبان", confirmLead: "برای تأیید ذخیرهٔ عبارت، کلمات خواسته‌شده را وارد کنید.", word: "کلمهٔ #{{n}}", enterWord: "کلمهٔ {{n}} را وارد کنید", confirm: "تأیید", pinTitle: "تنظیم پین", pinLead: "پین شما کیف‌پول را روی این دستگاه رمزگذاری می‌کند." },
  import: { title: "وارد کردن کیف‌پول", lead: "عبارت بازیابی ۱۲ یا ۲۴ کلمه‌ای را وارد کنید.", valid: "✓ عبارت بازیابی معتبر", invalid: "عبارت ناقص یا نامعتبر است", privacy: "عبارت شما فقط روی همین دستگاه پردازش می‌شود.", continue: "ادامه" },
  unlock: { lead: "برای باز کردن، پین را وارد کنید.", wrong: "پین نادرست است. دوباره تلاش کنید.", forgot: "پین را فراموش کرده‌اید؟ از عبارت بازیابی بازیابی کنید" },
  home: { total: "موجودی کل", send: "ارسال", receive: "دریافت", swap: "تبدیل", history: "تاریخچه", tokens: "توکن‌ها", accounts: "کیف‌پول", lock: "قفل", selfCustody: "حالت غیرامانی فعال", selfCustodyBody: "عبارت شما فقط روی همین دستگاه رمزگذاری شده است. با انتخاب‌گر بالا شبکه را عوض کنید.", assetsOn: "حساب شما در {{network}}" },
  network: { select: "انتخاب شبکه" },
  swap: {
    title: "تبدیل", youPay: "می‌پردازید", youReceive: "دریافت می‌کنید", route: "مسیر", priceImpact: "اثر قیمتی",
    minReceived: "حداقل دریافتی", networkFee: "کارمزد شبکه", confirm: "تأیید تبدیل",
    notSupported: "تبدیل روی این شبکه هنوز در دسترس نیست. یک شبکه‌ی EVM را امتحان کنید (اتریوم، بایننس، پالیگان…).",
    sent: "تبدیل ثبت شد", failed: "تبدیل ناموفق بود",
  },
  receive: { title: "دریافت {{symbol}}", copy: "کپی آدرس", copied: "کپی شد ✓", close: "بستن", warn: "فقط دارایی‌های {{symbol}} و {{label}} را به این آدرس بفرستید." },
  tokens: { title: "توکن‌ها", search: "جستجوی نام یا نماد", count: "{{count}} توکن پشتیبانی می‌شود", popular: "توکن‌های محبوب" },
  send: {
    title: "ارسال", from: "از", to: "به", recipient: "آدرس گیرنده", recipientPlaceholder: "آدرس را بچسبانید یا وارد کنید",
    amount: "مقدار", max: "حداکثر", network: "شبکه", fee: "کارمزد تخمینی شبکه", review: "بازبینی",
    reviewTitle: "بازبینی تراکنش", confirm: "تأیید و امضا", invalidAddress: "یک آدرس معتبر برای این شبکه وارد کنید",
    insufficient: "مقدار بیشتر از موجودی شماست", riskGreen: "امن به‌نظر می‌رسد", riskYellow: "هشدارها را بررسی کنید", riskRed: "ناامن — مسدود شد",
    notConnected: "شبکه متصل نیست", needRpc: "برای ارسال، یک نقطهٔ RPC برای این شبکه اضافه کنید. هیچ‌چیزی ارسال نشد.",
    broadcastFail: "ارسال نشد — اتصال را بررسی و دوباره تلاش کنید.", sent: "تراکنش ارسال شد", viewTx: "هش تراکنش",
  },
  common: { language: "زبان", cancel: "لغو", done: "انجام شد" },
};

const ar: DeepPartial<Dict> = {
  app: { tagline: "محفظة ذاتية الحفظ لتيليجرام" },
  welcome: { lead: "المفاتيح بحوزتك — تبقى عبارة الاسترداد على هذا الجهاز ولا تُرسل أبدًا إلى خوادمنا.", create: "إنشاء محفظة جديدة", import: "لديّ محفظة بالفعل", fineprint: "فقدان عبارة الاسترداد يعني فقدان أموالك — لا أحد يستطيع استعادتها لك." },
  bullets: { keys: "🔐 المفاتيح مشفّرة على جهازك", chains: "🌐 TON وإيثريوم وBSC وبوليجون وسولانا وبيتكوين", warnings: "🛡️ تحذيرات مخاطر واضحة قبل التوقيع" },
  create: { warnTitle: "قبل أن تبدأ", warnHeading: "عبارة الاسترداد هي النسخة الاحتياطية الوحيدة", warnBody: "سترى 12 كلمة. اكتبها بالترتيب واحتفظ بها دون اتصال. أي شخص يملك هذه الكلمات يمكنه أخذ أموالك.", write: "✍️ اكتبها على ورق", share: "🙈 لا تشاركها أبدًا", chat: "📵 لن نطلبها في المحادثة", understand: "فهمت، أظهر العبارة", phraseTitle: "عبارة الاسترداد", reveal: "اضغط للكشف", written: "لقد دوّنتها", confirmTitle: "أكّد نسختك الاحتياطية", confirmLead: "أدخل الكلمات المطلوبة لتأكيد حفظ العبارة.", word: "الكلمة #{{n}}", enterWord: "أدخل الكلمة {{n}}", confirm: "تأكيد", pinTitle: "تعيين رمز PIN", pinLead: "يشفّر رمزك المحفظة على هذا الجهاز." },
  import: { title: "استيراد محفظة", lead: "أدخل عبارة الاسترداد المكوّنة من 12 أو 24 كلمة.", valid: "✓ عبارة استرداد صالحة", invalid: "العبارة غير مكتملة أو غير صالحة", privacy: "تُعالَج عبارتك على هذا الجهاز فقط.", continue: "متابعة" },
  unlock: { lead: "أدخل رمز PIN لفتح القفل.", wrong: "رمز غير صحيح. حاول مجددًا.", forgot: "نسيت الرمز؟ استعد من عبارة الاسترداد" },
  home: { total: "الرصيد الإجمالي", send: "إرسال", receive: "استلام", swap: "تبديل", history: "السجل", tokens: "الرموز", accounts: "حساباتك", lock: "قفل", selfCustody: "الحفظ الذاتي مفعّل", selfCustodyBody: "عبارتك مشفّرة على هذا الجهاز فقط. اضغط على حساب لعرض عنوانه ورمز QR." },
  receive: { title: "استلام {{symbol}}", copy: "نسخ العنوان", copied: "تم النسخ ✓", close: "إغلاق", warn: "أرسل فقط أصول {{symbol}} و{{label}} إلى هذا العنوان." },
  tokens: { title: "الرموز", search: "ابحث بالاسم أو الرمز", count: "{{count}} رمزًا مدعومًا", popular: "الرموز الشائعة" },
  common: { language: "اللغة" },
};

const ru: DeepPartial<Dict> = {
  app: { tagline: "Несамостоятельный кошелёк для Telegram" },
  welcome: { lead: "Ключи у вас — фраза восстановления хранится на устройстве и не отправляется на наши серверы.", create: "Создать новый кошелёк", import: "У меня уже есть кошелёк", fineprint: "Потеря фразы восстановления означает потерю доступа к средствам — её никто не восстановит." },
  bullets: { keys: "🔐 Ключи зашифрованы на вашем устройстве", chains: "🌐 TON, Ethereum, BSC, Polygon, Solana и Bitcoin", warnings: "🛡️ Понятные предупреждения о рисках перед подписью" },
  create: { warnTitle: "Перед началом", warnHeading: "Фраза восстановления — единственная резервная копия", warnBody: "Вы увидите 12 слов. Запишите их по порядку и храните офлайн. Любой с этими словами может забрать ваши средства.", write: "✍️ Запишите на бумаге", share: "🙈 Никому не сообщайте", chat: "📵 Мы никогда не спросим их в чате", understand: "Понятно, показать фразу", phraseTitle: "Ваша фраза восстановления", reveal: "Нажмите, чтобы показать", written: "Я записал(а)", confirmTitle: "Подтвердите резервную копию", confirmLead: "Введите запрошенные слова, чтобы подтвердить сохранение фразы.", word: "Слово №{{n}}", enterWord: "Введите слово {{n}}", confirm: "Подтвердить", pinTitle: "Задайте PIN", pinLead: "PIN шифрует кошелёк на этом устройстве." },
  import: { title: "Импорт кошелька", lead: "Введите фразу восстановления из 12 или 24 слов.", valid: "✓ Верная фраза восстановления", invalid: "Фраза неполная или неверная", privacy: "Фраза обрабатывается только на этом устройстве.", continue: "Продолжить" },
  unlock: { lead: "Введите PIN для разблокировки.", wrong: "Неверный PIN.

...[truncated]...
```

### `apps\miniapp\src\main.tsx`

```tsx
// MUST be first: installs Buffer/process globals before @ton/@solana evaluate.
import "./polyfills.js";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { WalletProvider } from "./wallet/store.js";
import { NetworkProvider } from "./context/network.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";
import { initTelegram } from "./telegram.js";
import "./i18n/index.js";
import "./styles.css";
import "./screens.css";

initTelegram();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <NetworkProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </NetworkProvider>
    </ErrorBoundary>
  </StrictMode>,
);

```

### `apps\miniapp\src\networkMeta.ts`

```ts
/** Brand colors per network (for badges/UI). Verified against each project's identity. */
export const NETWORK_COLORS: Record<string, string> = {
  "evm:1": "#627EEA", // Ethereum
  "evm:42161": "#28A0F0", // Arbitrum
  "evm:10": "#FF0420", // Optimism
  "evm:8453": "#0052FF", // Base
  "evm:56": "#F3BA2F", // BNB
  "evm:137": "#8247E5", // Polygon
  "evm:43114": "#E84142", // Avalanche
  "solana:mainnet": "#14F195", // Solana
  "bitcoin:mainnet": "#F7931A", // Bitcoin
  "ton:mainnet": "#0098EA", // TON
  "ton:testnet": "#7AA7C7",
};

export const networkColor = (id: string): string => NETWORK_COLORS[id] ?? "#4f7cff";

/** Network id → Trust Wallet blockchain folder (for logo asset URLs). */
const TW_CHAIN: Record<string, string> = {
  "evm:1": "ethereum",
  "evm:42161": "arbitrum",
  "evm:10": "optimism",
  "evm:8453": "base",
  "evm:56": "smartchain",
  "evm:137": "polygon",
  "evm:43114": "avalanchec",
  "solana:mainnet": "solana",
  "bitcoin:mainnet": "bitcoin",
  "ton:mainnet": "ton",
};

const TW_BASE = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";

/** Logo URL for a network's native coin (undefined → caller shows a fallback badge). */
export function nativeLogo(networkId: string): string | undefined {
  const c = TW_CHAIN[networkId];
  return c ? `${TW_BASE}/${c}/info/logo.png` : undefined;
}

/** Logo URL for a token by its contract/mint address on a network. */
export function tokenLogo(networkId: string, address: string | null): string | undefined {
  const c = TW_CHAIN[networkId];
  if (!c || !address) return nativeLogo(networkId);
  return `${TW_BASE}/${c}/assets/${address}/logo.png`;
}

/** Family → CoinGecko id for native-asset pricing (mirrors the token registry). */
export const NATIVE_CG: Record<string, string> = {
  "evm:1": "ethereum",
  "evm:42161": "ethereum",
  "evm:10": "ethereum",
  "evm:8453": "ethereum",
  "evm:56": "binancecoin",
  "evm:137": "matic-network",
  "evm:43114": "avalanche-2",
  "solana:mainnet": "solana",
  "bitcoin:mainnet": "bitcoin",
  "ton:mainnet": "the-open-network",
};

```

### `apps\miniapp\src\polyfills.ts`

```ts
/**
 * Node-global polyfills for crypto libs (@ton/core, @solana/web3.js) that
 * reference `Buffer`/`process` at module-evaluation time.
 *
 * This MUST be the first import in the entry module. ES modules evaluate all of
 * a module's imports before its body runs, so an inline polyfill in main.tsx
 * would execute too late — by then @ton/core has already thrown. Keeping the
 * polyfill in its own module, imported before any wallet code, guarantees the
 * globals exist before those packages are evaluated.
 */
import { Buffer } from "buffer";

const g = globalThis as unknown as {
  Buffer?: typeof Buffer;
  global?: typeof globalThis;
  process?: { env: Record<string, string> };
};

if (!g.Buffer) g.Buffer = Buffer;
if (!g.global) g.global = globalThis;
if (!g.process) g.process = { env: {} };

```

### `apps\miniapp\src\screens\CreateWallet.tsx`

```tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createMnemonic } from "@nova/wallet-core";
import { useWallet } from "../wallet/store.js";
import { PinPad } from "../components/PinPad.js";
import { haptic } from "../telegram.js";

type Step = "warn" | "reveal" | "confirm" | "pin";

export function CreateWallet({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const { t } = useTranslation();
  const { createFromMnemonic } = useWallet();
  const [step, setStep] = useState<Step>("warn");
  const mnemonic = useMemo(() => createMnemonic(128), []); // 12 words
  const words = useMemo(() => mnemonic.split(" "), [mnemonic]);
  const [revealed, setRevealed] = useState(false);

  const quiz = useMemo(() => {
    const idxs = new Set<number>();
    while (idxs.size < 2) idxs.add(Math.floor(Math.random() * words.length));
    return [...idxs];
  }, [words]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const quizPass = quiz.every((i) => answers[i]?.trim().toLowerCase() === words[i]);

  if (step === "warn") {
    return (
      <div className="screen">
        <BackBar onBack={onBack} title={t("create.warnTitle")} />
        <div className="banner danger">
          <span className="ico">⚠️</span>
          <div><b>{t("create.warnHeading")}</b>{t("create.warnBody")}</div>
        </div>
        <ul className="bullets">
          <li>{t("create.write")}</li>
          <li>{t("create.share")}</li>
          <li>{t("create.chat")}</li>
        </ul>
        <button className="btn" onClick={() => { haptic("medium"); setStep("reveal"); }}>{t("create.understand")}</button>
      </div>
    );
  }

  if (step === "reveal") {
    return (
      <div className="screen">
        <BackBar onBack={() => setStep("warn")} title={t("create.phraseTitle")} />
        <div className={`seed-grid ${revealed ? "" : "blurred"}`}>
          {words.map((w, i) => (
            <div key={i} className="seed-word"><span className="num">{i + 1}</span>{w}</div>
          ))}
          {!revealed && (
            <button className="reveal-overlay" onClick={() => { haptic("light"); setRevealed(true); }}>{t("create.reveal")}</button>
          )}
        </div>
        <button className="btn" disabled={!revealed} onClick={() => { haptic("medium"); setStep("confirm"); }}>{t("create.written")}</button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="screen">
        <BackBar onBack={() => setStep("reveal")} title={t("create.confirmTitle")} />
        <p className="lead">{t("create.confirmLead")}</p>
        {quiz.map((i) => (
          <label key={i} className="field">
            <span>{t("create.word", { n: i + 1 })}</span>
            <input autoCapitalize="none" autoCorrect="off" value={answers[i] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
              placeholder={t("create.enterWord", { n: i + 1 })} />
          </label>
        ))}
        <button className="btn" disabled={!quizPass} onClick={() => { haptic("medium"); setStep("pin"); }}>{t("create.confirm")}</button>
      </div>
    );
  }

  return (
    <div className="screen center">
      <BackBar onBack={() => setStep("confirm")} title={t("create.pinTitle")} />
      <p className="lead">{t("create.pinLead")}</p>
      <PinPad onComplete={async (pin) => { await createFromMnemonic(mnemonic, pin); haptic("heavy"); onDone(); }} />
    </div>
  );
}

function BackBar({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="backbar">
      <button className="back" onClick={() => { haptic("light"); onBack(); }}>‹</button>
      <span>{title}</span>
    </div>
  );
}

```

### `apps\miniapp\src\screens\Home.tsx`

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "../wallet/store.js";
import { useNetwork } from "../context/network.js";
import { usePortfolio, useAssets, formatUsd, trimAmount } from "../wallet/usePortfolio.js";
import { NATIVE_CG, nativeLogo, tokenLogo } from "../networkMeta.js";
import { NetworkSelector } from "../components/NetworkSelector.js";
import { CoinLogo } from "../components/CoinLogo.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { Receive } from "./Receive.js";
import { Send } from "./Send.js";
import { Swap } from "./Swap.js";
import { Tokens } from "./Tokens.js";
import { haptic } from "../telegram.js";

const short = (a: string) => (a.length > 18 ? `${a.slice(0, 9)}…${a.slice(-7)}` : a);
type Tab = "wallet" | "tokens";

export function Home() {
  const { t } = useTranslation();
  const { accounts, lock } = useWallet();
  const { active } = useNetwork();
  const { totalFiat, loading: totalLoading } = usePortfolio(accounts);
  const [receive, setReceive] = useState(false);
  const [send, setSend] = useState(false);
  const [swap, setSwap] = useState(false);
  const [tab, setTab] = useState<Tab>("wallet");
  const [copied, setCopied] = useState(false);

  const account = accounts.find((a) => a.family === active.family) ?? accounts[0];
  const { assets, loading: assetsLoading } = useAssets(active.id, account?.address ?? "", NATIVE_CG[active.id] ?? "ethereum");

  const copy = async () => {
    if (!account) return;
    try { await navigator.clipboard.writeText(account.address); haptic("medium"); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { /* unavailable */ }
  };

  if (tab === "tokens") {
    return (
      <>
        <Tokens />
        <BottomNav tab={tab} setTab={setTab} t={t} />
      </>
    );
  }

  return (
    <>
      <div className="app">
        <header className="brand">
          <div className="mark" />
          <h1>NovaWallet</h1>
          <div className="header-actions">
            <LanguageSwitcher compact />
            <button className="icon-btn" onClick={() => { haptic("light"); lock(); }} aria-label={t("home.lock")}>🔒</button>
          </div>
        </header>

        <div className="net-row"><NetworkSelector /></div>

        <section className="balance-card">
          <div className="label">{t("home.total")}</div>
          {totalLoading ? <div className="amount"><span className="skeleton balance-skel" /></div>
            : <div className="amount">{formatUsd(totalFiat)}</div>}
          <div className="sub">{accounts.length} chains · {active.name}</div>
        </section>

        <div className="actions">
          <button className="action" onClick={() => { haptic("light"); setSend(true); }}><span className="ico">↑</span>{t("home.send")}</button>
          <button className="action" onClick={() => { haptic("light"); setReceive(true); }}><span className="ico">↓</span>{t("home.receive")}</button>
          <button className="action" onClick={() => { haptic("light"); setSwap(true); }}><span className="ico">⇄</span>{t("home.swap")}</button>
          <button className="action" onClick={() => haptic("light")}><span className="ico">⧉</span>{t("home.history")}</button>
        </div>

        <div className="card asset-card">
          <div className="asset-card-head">
            <h2>{t("home.assetsOn", { network: active.name })}</h2>
            <button className="asset-addr" onClick={copy}>{copied ? t("receive.copied") : short(account?.address ?? "")}</button>
          </div>

          {assetsLoading ? (
            [0, 1].map((i) => <div key={i} className="asset-row"><span className="skeleton" style={{ width: 38, height: 38, borderRadius: "50%" }} /><div className="skeleton" style={{ width: 120, height: 14 }} /></div>)
          ) : (
            assets.map((a) => (
              <div key={a.address ?? "native"} className="asset-row">
                <CoinLogo src={a.address ? tokenLogo(active.id, a.address) : nativeLogo(active.id)} networkId={active.id} symbol={a.symbol} size={38} />
                <div className="asset-info">
                  <div className="asset-name">{a.symbol}</div>
                  <div className="asset-sub">{a.name}</div>
                </div>
                <div className="asset-bal">
                  <div className="bal-amount">{trimAmount(a.formatted)}</div>
                  <div className="bal-fiat">{formatUsd(a.fiat)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="banner">
          <span className="ico">🛡️</span>
          <div><b>{t("home.selfCustody")}</b>{t("home.selfCustodyBody")}</div>
        </div>
      </div>

      <BottomNav tab={tab} setTab={setTab} t={t} />
      {receive && account && <Receive account={account} networkName={active.name} symbol={active.nativeSymbol} networkId={active.id} onClose={() => setReceive(false)} />}
      {send && account && <Send account={account} networkId={active.id} symbol={active.nativeSymbol} networkName={active.name} onClose={() => setSend(false)} />}
      {swap && account && <Swap account={account} networkId={active.id} networkName={active.name} onClose={() => setSwap(false)} />}
    </>
  );
}

function BottomNav({ tab, setTab, t }: { tab: Tab; setTab: (t: Tab) => void; t: (k: string) => string }) {
  return (
    <nav className="bottom-nav">
      <button className={tab === "wallet" ? "on" : ""} onClick={() => { haptic("light"); setTab("wallet"); }}><span>👛</span>{t("home.accounts")}</button>
      <button className={tab === "tokens" ? "on" : ""} onClick={() => { haptic("light"); setTab("tokens"); }}><span>🪙</span>{t("home.tokens")}</button>
    </nav>
  );
}

```

### `apps\miniapp\src\screens\ImportWallet.tsx`

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isValidMnemonic, normalizeMnemonic } from "@nova/wallet-core";
import { useWallet } from "../wallet/store.js";
import { PinPad } from "../components/PinPad.js";
import { haptic } from "../telegram.js";

export function ImportWallet({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const { t } = useTranslation();
  const { importMnemonic } = useWallet();
  const [phrase, setPhrase] = useState("");
  const [step, setStep] = useState<"phrase" | "pin">("phrase");
  const [err, setErr] = useState<string | null>(null);

  const valid = isValidMnemonic(normalizeMnemonic(phrase));

  if (step === "pin") {
    return (
      <div className="screen center">
        <div className="backbar"><button className="back" onClick={() => setStep("phrase")}>‹</button><span>{t("create.pinTitle")}</span></div>
        <p className="lead">{t("create.pinLead")}</p>
        <PinPad onComplete={async (pin) => {
          try { await importMnemonic(phrase, pin); haptic("heavy"); onDone(); }
          catch (e) { setErr(e instanceof Error ? e.message : "Import failed."); setStep("phrase"); }
        }} />
        {err && <p className="error-text">{err}</p>}
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="backbar"><button className="back" onClick={() => { haptic("light"); onBack(); }}>‹</button><span>{t("import.title")}</span></div>
      <p className="lead">{t("import.lead")}</p>
      <textarea className="seed-input" rows={4} autoCapitalize="none" autoCorrect="off" spellCheck={false}
        value={phrase} onChange={(e) => { setPhrase(e.target.value); setErr(null); }} placeholder="word1 word2 word3 …" />
      <div className="hint-row">
        {phrase.trim() === "" ? <span className="muted">{t("import.privacy")}</span>
          : valid ? <span className="ok-text">{t("import.valid")}</span>
          : <span className="error-text">{t("import.invalid")}</span>}
      </div>
      <button className="btn" disabled={!valid} onClick={() => { haptic("medium"); setStep("pin"); }}>{t("import.continue")}</button>
    </div>
  );
}

```

### `apps\miniapp\src\screens\Receive.tsx`

```tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import type { ChainAccount } from "../wallet/accounts.js";
import { CoinLogo } from "../components/CoinLogo.js";
import { nativeLogo } from "../networkMeta.js";
import { haptic } from "../telegram.js";

export function Receive({
  account, networkName, symbol, networkId, onClose,
}: {
  account: ChainAccount; networkName: string; symbol: string; networkId: string; onClose: () => void;
}) {
  const { t } = useTranslation();
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(account.address, { margin: 1, width: 220 }).then(setQr).catch(() => setQr(""));
  }, [account.address]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(account.address); haptic("medium"); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* unavailable */ }
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <CoinLogo src={nativeLogo(networkId)} networkId={networkId} symbol={symbol} size={28} />
          <h2 className="sheet-title">{t("receive.title", { symbol })}</h2>
        </div>
        <p className="muted center-text">{networkName}</p>
        <div className="qr-box">{qr ? <img src={qr} alt="address QR" /> : <div className="skeleton qr-skel" />}</div>
        <div className="address-box">{account.address}</div>
        <button className="btn" onClick={copy}>{copied ? t("receive.copied") : t("receive.copy")}</button>
        <div className="banner warn small">
          <span className="ico">ℹ️</span>
          <div>{t("receive.warn", { symbol, label: networkName })}</div>
        </div>
        <button className="btn secondary" onClick={onClose}>{t("receive.close")}</button>
      </div>
    </div>
  );
}

```

### `apps\miniapp\src\screens\Send.tsx`

```tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { assessTransferRisk, type RiskReport } from "@nova/chains";
import type { ChainAccount } from "../wallet/accounts.js";
import { getRecents, addRecent } from "../wallet/recents.js";
import { signAndSend, type SendResult } from "../wallet/sign.js";
import { CoinLogo } from "../components/CoinLogo.js";
import { nativeLogo } from "../networkMeta.js";
import { haptic } from "../telegram.js";

export function Send({
  account, networkId, symbol, networkName, onClose,
}: {
  account: ChainAccount; networkId: string; symbol: string; networkName: string; onClose: () => void;
}) {
  const { t } = useTranslation();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [recents, setRecents] = useState<string[]>([]);
  const [step, setStep] = useState<"form" | "review">("form");
  const [result, setResult] = useState<SendResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { void getRecents(account.family).then(setRecents); }, [account.family]);

  const risk: RiskReport | null = useMemo(() => {
    if (!to.trim()) return null;
    return assessTransferRisk({ family: account.family, from: account.address, to: to.trim(), knownRecipients: recents });
  }, [to, account, recents]);

  const canReview = Boolean(risk?.canProceed) && amount !== "" && Number(amount) > 0;

  const confirm = async () => {
    setBusy(true); haptic("medium");
    const res = await signAndSend({ family: account.family, networkId, to: to.trim(), amount });
    if (res.status === "sent") { void addRecent(account.family, to.trim()); haptic("heavy"); }
    setResult(res); setBusy(false);
  };

  if (result) {
    const ok = result.status === "sent";
    return (
      <Sheet onClose={onClose}>
        <h2 className="sheet-title">{ok ? t("send.sent") : result.error === "needRpc" ? t("send.notConnected") : t("send.broadcastFail")}</h2>
        <div className={`result-badge ${ok ? "ok" : result.error === "needRpc" ? "warn" : "err"}`}>{ok ? "✓" : "⚠"}</div>
        {result.error === "needRpc" && <p className="muted center-text">{t("send.needRpc")}</p>}
        {result.error && result.error !== "needRpc" && <p className="muted center-text">{result.error}</p>}
        {result.hash && <div className="address-box">{result.hash}</div>}
        <button className="btn" onClick={onClose}>{t("common.done")}</button>
      </Sheet>
    );
  }

  if (step === "review") {
    return (
      <Sheet onClose={() => setStep("form")}>
        <h2 className="sheet-title">{t("send.reviewTitle")}</h2>
        <dl className="review">
          <Row k={t("send.from")} v={`${symbol} · ${shorten(account.address)}`} />
          <Row k={t("send.to")} v={shorten(to)} />
          <Row k={t("send.amount")} v={`${amount} ${symbol}`} />
          <Row k={t("send.network")} v={networkName} />
        </dl>
        {risk && risk.findings.length > 0 && (
          <div className={`risk-box ${risk.level}`}>
            <b>{risk.level === "red" ? t("send.riskRed") : risk.level === "yellow" ? t("send.riskYellow") : t("send.riskGreen")}</b>
            <ul>{risk.findings.map((f) => <li key={f.code}>{f.message}</li>)}</ul>
          </div>
        )}
        <button className="btn" disabled={busy || !risk?.canProceed} onClick={confirm}>{busy ? "…" : t("send.confirm")}</button>
        <button className="btn secondary" onClick={() => setStep("form")}>{t("common.cancel")}</button>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose}>
      <div className="sheet-head">
        <CoinLogo src={nativeLogo(networkId)} networkId={networkId} symbol={symbol} size={28} />
        <h2 className="sheet-title">{t("send.title")} · {networkName}</h2>
      </div>

      <label className="field">
        <span>{t("send.recipient")}</span>
        <input value={to} autoCapitalize="none" autoCorrect="off" spellCheck={false}
          onChange={(e) => setTo(e.target.value)} placeholder={t("send.recipientPlaceholder")} />
      </label>

      {risk && (
        <div className={`risk-pill ${risk.level}`}>
          {risk.level === "green" ? "🟢" : risk.level === "yellow" ? "🟡" : "🔴"}{" "}
          {risk.findings[0]?.message ?? t("send.riskGreen")}
        </div>
      )}

      <label className="field">
        <span>{t("send.amount")} ({symbol})</span>
        <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.0" />
      </label>

      <button className="btn" disabled={!canReview} onClick={() => { haptic("light"); setStep("review"); }}>{t("send.review")}</button>
      <button className="btn secondary" onClick={onClose}>{t("common.cancel")}</button>
    </Sheet>
  );
}

const shorten = (a: string) => (a.length > 18 ? `${a.slice(0, 10)}…${a.slice(-8)}` : a);
function Row({ k, v }: { k: string; v: string }) { return <div className="review-row"><dt>{k}</dt><dd className="mono">{v}</dd></div>; }
function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        {children}
      </div>
    </div>
  );
}

```

### `apps\miniapp\src\screens\Swap.tsx`

```tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NETWORKS, tokensForNetwork } from "@nova/chains";
import type { ChainAccount } from "../wallet/accounts.js";
import { api, type SwapQuote } from "../api.js";
import { executeSwap, type SendResult } from "../wallet/sign.js";
import { CoinLogo } from "../components/CoinLogo.js";
import { nativeLogo, tokenLogo } from "../networkMeta.js";
import { formatUsd } from "../wallet/usePortfolio.js";
import { haptic } from "../telegram.js";

interface TokenOpt { ref: string; symbol: string; address: string | null }

export function Swap({
  networkId, networkName, account, onClose,
}: {
  networkId: string; networkName: string; account: ChainAccount; onClose: () => void;
}) {
  const { t } = useTranslation();
  const net = NETWORKS[networkId]!;
  const isEvm = net.family === "evm";

  const options: TokenOpt[] = useMemo(() => {
    const native: TokenOpt = { ref: "native", symbol: net.nativeSymbol, address: null };
    const toks = tokensForNetwork(networkId)
      .filter((tk) => !tk.native && tk.address)
      .map((tk) => ({ ref: tk.address!, symbol: tk.symbol, address: tk.address! }));
    return [native, ...toks];
  }, [networkId, net.nativeSymbol]);

  const [from, setFrom] = useState<TokenOpt>(options[0]!);
  const [to, setTo] = useState<TokenOpt>(options[1] ?? options[0]!);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const [busy, setBusy] = useState(false);

  // Debounced quote fetch.
  useEffect(() => {
    setQuote(null); setErrMsg(null);
    if (!isEvm || from.ref === to.ref || amount === "" || Number(amount) <= 0) { setStatus("idle"); return; }
    setStatus("loading");
    const id = setTimeout(async () => {
      try {
        const q = await api.swapQuote({ network: networkId, from: from.ref, to: to.ref, amount, address: account.address });
        setQuote(q); setStatus("idle");
      } catch (e) { setStatus("error"); setErrMsg(e instanceof Error ? e.message : "No route"); }
    }, 500);
    return () => clearTimeout(id);
  }, [isEvm, from.ref, to.ref, amount, networkId, account.address]);

  const impact = quote?.priceImpact ?? null;
  // Too-good-to-be-true (output worth >2% more than input) signals a mispriced
  // route — treat as unsafe, not as a bargain.
  const suspicious = impact != null && impact < -0.02;
  const impactLevel = impact == null ? "green" : suspicious || impact > 0.05 ? "red" : impact > 0.01 ? "yellow" : "green";

  const confirm = async () => {
    if (!quote?.tx) return;
    setBusy(true); haptic("medium");
    const res = await executeSwap(networkId, quote.tx);
    if (res.status === "sent") haptic("heavy");
    setResult(res); setBusy(false);
  };

  const swapSides = () => { setFrom(to); setTo(from); setAmount(""); };

  if (result) {
    const ok = result.status === "sent";
    return (
      <Sheet onClose={onClose}>
        <h2 className="sheet-title">{ok ? t("swap.sent") : t("swap.failed")}</h2>
        <div className={`result-badge ${ok ? "ok" : "err"}`}>{ok ? "✓" : "⚠"}</div>
        {!ok && result.error && <p className="muted center-text">{result.error}</p>}
        {result.hash && <div className="address-box">{result.hash}</div>}
        <button className="btn" onClick={onClose}>{t("common.done")}</button>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose}>
      <h2 className="sheet-title">{t("swap.title")} · {networkName}</h2>

      {!isEvm ? (
        <p className="muted center-text" style={{ padding: "20px 0" }}>{t("swap.notSupported")}</p>
      ) : (
        <>
          <div className="swap-box">
            <div className="swap-label">{t("swap.youPay")}</div>
            <div className="swap-row">
              <input className="swap-amount" inputMode="decimal" value={amount} placeholder="0.0"
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} />
              <TokenSelect networkId={networkId} options={options} value={from} onChange={setFrom} />
            </div>
          </div>

          <button className="swap-flip" onClick={() => { haptic("light"); swapSides(); }} aria-label="flip">⇅</button>

          <div className="swap-box">
            <div className="swap-label">{t("swap.youReceive")}</div>
            <div className="swap-row">
              <div className="swap-amount out">
                {status === "loading" ? <span className="skeleton" style={{ width: 90, height: 22, display: "inline-block" }} />
                  : quote ? `≈ ${trim(quote.toAmountFormatted)}` : "0.0"}
              </div>
              <TokenSelect networkId={networkId} options={options} value={to} onChange={setTo} />
            </div>
            {quote?.toAmountUsd != null && <div className="swap-usd">{formatUsd(quote.toAmountUsd)}</div>}
          </div>

          {errMsg && <div className="risk-pill red">🔴 {errMsg}</div>}

          {quote && (
            <dl className="review">
              <Row k={t("swap.route")} v={quote.route} />
              <Row k={t("swap.priceImpact")} v={quote.priceImpact != null ? `${(quote.priceImpact * 100).toFixed(2)}%` : "—"} cls={impactLevel} />
              <Row k={t("swap.minReceived")} v={`${trim(quote.toAmountMinFormatted)} ${quote.toToken.symbol}`} />
              <Row k={t("swap.networkFee")} v={quote.gasUsd != null ? formatUsd(quote.gasUsd) : "—"} />
            </dl>
          )}

          <button className="btn" disabled={!quote?.tx || busy} onClick={confirm}>
            {busy ? "…" : t("swap.confirm")}
          </button>
        </>
      )}
      <button className="btn secondary" onClick={onClose}>{t("common.cancel")}</button>
    </Sheet>
  );
}

const trim = (s: string) => { const n = Number(s); return n >= 1 ? n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") : n.toPrecision(4); };

function TokenSelect({ networkId, options, value, onChange }: { networkId: string; options: TokenOpt[]; value: TokenOpt; onChange: (o: TokenOpt) => void }) {
  return (
    <label className="token-select">
      <CoinLogo src={value.address ? tokenLogo(networkId, value.address) : nativeLogo(networkId)} networkId={networkId} symbol={value.symbol} size={24} />
      <select value={value.ref} onChange={(e) => onChange(options.find((o) => o.ref === e.target.value) ?? value)}>
        {options.map((o) => <option key={o.ref} value={o.ref}>{o.symbol}</option>)}
      </select>
    </label>
  );
}

function Row({ k, v, cls }: { k: string; v: string; cls?: string }) {
  return <div className="review-row"><dt>{k}</dt><dd className={cls ? `risk-text ${cls}` : "mono"}>{v}</dd></div>;
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        {children}
      </div>
    </div>
  );
}

```

### `apps\miniapp\src\screens\Tokens.tsx`

```tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ALL_TOKENS, searchTokens, NETWORKS } from "@nova/chains";
import { CoinLogo } from "../components/CoinLogo.js";
import { tokenLogo } from "../networkMeta.js";

const networkName = (id: string) => NETWORKS[id]?.name ?? id;

/** Searchable catalog of supported tokens across all chains. */
export function Tokens() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [chain, setChain] = useState<string>("all");

  const chains = useMemo(
    () => [...new Set(ALL_TOKENS.map((tok) => tok.networkId))].filter((id) => !NETWORKS[id]?.isTestnet),
    [],
  );

  const results = useMemo(
    () => searchTokens(query, chain === "all" ? undefined : chain),
    [query, chain],
  );

  return (
    <div className="app">
      <header className="brand">
        <div className="mark" />
        <h1>{t("tokens.title")}</h1>
        <span className="net">{t("tokens.count", { count: ALL_TOKENS.length })}</span>
      </header>

      <input
        className="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("tokens.search")}
      />

      <div className="chips">
        <button className={`chip ${chain === "all" ? "on" : ""}`} onClick={() => setChain("all")}>All</button>
        {chains.map((id) => (
          <button key={id} className={`chip ${chain === id ? "on" : ""}`} onClick={() => setChain(id)}>
            {networkName(id)}
          </button>
        ))}
      </div>

      <div className="card">
        <h2>{t("tokens.popular")}</h2>
        {results.map((tok) => (
          <div key={`${tok.networkId}:${tok.address ?? "native"}`} className="row">
            <CoinLogo src={tokenLogo(tok.networkId, tok.address)} networkId={tok.networkId} symbol={tok.symbol} size={36} />
            <div>
              <div className="name">{tok.name} {tok.native && <em className="tag">native</em>}</div>
              <div className="meta">{tok.symbol} · {networkName(tok.networkId)}</div>
            </div>
            <span className="right mono">{tok.address ? `${tok.address.slice(0, 6)}…` : "—"}</span>
          </div>
        ))}
        {results.length === 0 && <p className="muted center-text" style={{ padding: 16 }}>—</p>}
      </div>
    </div>
  );
}

```

### `apps\miniapp\src\screens\Unlock.tsx`

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "../wallet/store.js";
import { PinPad } from "../components/PinPad.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { haptic } from "../telegram.js";

export function Unlock() {
  const { t } = useTranslation();
  const { unlock, error, clearError, reset } = useWallet();
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <div className="screen center">
      <div className="topbar"><LanguageSwitcher /></div>
      <div className="brand big"><div className="mark" /><h1>NovaWallet</h1></div>
      <p className="lead">{t("unlock.lead")}</p>
      <PinPad resetSignal={resetSignal} onComplete={async (pin) => {
        const ok = await unlock(pin);
        if (!ok) { haptic("heavy"); setResetSignal((n) => n + 1); }
      }} />
      {error && <p className="error-text" onAnimationEnd={clearError}>{t("unlock.wrong")}</p>}
      <button className="link-btn" onClick={() => {
        if (confirm(t("unlock.forgot"))) void reset();
      }}>{t("unlock.forgot")}</button>
    </div>
  );
}

```

### `apps\miniapp\src\screens\Welcome.tsx`

```tsx
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { haptic } from "../telegram.js";

export function Welcome({ onCreate, onImport }: { onCreate: () => void; onImport: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="screen center">
      <div className="topbar"><LanguageSwitcher /></div>
      <div className="brand big">
        <div className="mark" />
        <h1>NovaWallet</h1>
      </div>
      <p className="lead">{t("welcome.lead")}</p>

      <ul className="bullets">
        <li>{t("bullets.keys")}</li>
        <li>{t("bullets.chains")}</li>
        <li>{t("bullets.warnings")}</li>
      </ul>

      <div className="stack">
        <button className="btn" onClick={() => { haptic("medium"); onCreate(); }}>{t("welcome.create")}</button>
        <button className="btn secondary" onClick={() => { haptic("light"); onImport(); }}>{t("welcome.import")}</button>
      </div>

      <p className="fineprint">{t("welcome.fineprint")}</p>
    </div>
  );
}

```

### `apps\miniapp\src\screens.css`

```css
.screen {
  max-width: 480px;
  margin: 0 auto;
  padding: 20px 18px 40px;
  min-height: 100vh;
}
.screen.center { display: flex; flex-direction: column; justify-content: center; }
.app.center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; gap: 16px; }

.brand.big { flex-direction: column; gap: 12px; align-items: center; padding: 12px 0 8px; }
.brand.big .mark { width: 56px; height: 56px; border-radius: 16px; }
.brand.big h1 { font-size: 26px; }

.lead { color: var(--muted); font-size: 14px; line-height: 1.5; text-align: center; margin: 8px 0 18px; }

.bullets { list-style: none; padding: 0; margin: 0 0 22px; display: grid; gap: 10px; }
.bullets li { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; font-size: 14px; }

.stack { display: grid; gap: 10px; }
.fineprint { color: var(--muted); font-size: 12px; text-align: center; margin-top: 18px; line-height: 1.5; }

.backbar { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; font-weight: 600; }
.backbar .back { background: none; border: none; font-size: 28px; line-height: 1; color: var(--text); cursor: pointer; padding: 0 6px 0 0; }

.banner.danger { background: color-mix(in srgb, var(--danger) 12%, var(--surface)); border-color: color-mix(in srgb, var(--danger) 35%, transparent); }
.banner.warn { background: color-mix(in srgb, var(--warning) 12%, var(--surface)); border-color: color-mix(in srgb, var(--warning) 35%, transparent); }
.banner.small { font-size: 12px; padding: 10px 12px; margin: 12px 0; }

/* Seed phrase grid */
.seed-grid { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
.seed-word { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; font-weight: 600; font-size: 14px; display: flex; gap: 8px; align-items: center; }
.seed-word .num { color: var(--muted); font-size: 12px; min-width: 18px; }
.seed-grid.blurred .seed-word { filter: blur(6px); }
.reveal-overlay { position: absolute; inset: 0; border: none; border-radius: 14px; background: color-mix(in srgb, var(--accent) 12%, var(--surface)); color: var(--accent); font-weight: 600; font-size: 15px; cursor: pointer; }

.field { display: grid; gap: 6px; margin-bottom: 14px; }
.field span { font-size: 13px; color: var(--muted); }
.field input, .seed-input { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; font-size: 15px; color: var(--text); font-family: inherit; }
.seed-input { resize: none; line-height: 1.6; }

.hint-row { font-size: 13px; margin: 10px 0 18px; }
.ok-text { color: var(--ok); }
.error-text { color: var(--danger); font-size: 13px; text-align: center; margin-top: 12px; }
.muted { color: var(--muted); }

/* PIN pad */
.pinpad { display: flex; flex-direction: column; align-items: center; gap: 26px; margin-top: 8px; }
.pin-dots { display: flex; gap: 14px; }
.pin-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--muted); }
.pin-dot.filled { background: var(--accent); border-color: var(--accent); }
.pin-keys { display: grid; grid-template-columns: repeat(3, 72px); gap: 14px; }
.pin-key { height: 72px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); font-size: 24px; color: var(--text); cursor: pointer; }
.pin-key:active { transform: scale(0.95); }
.pin-key.ghost { border: none; background: none; }

.link-btn { background: none; border: none; color: var(--accent); font-size: 14px; cursor: pointer; margin-top: 18px; }

.pressable { width: 100%; background: none; border: none; border-bottom: 1px solid var(--border); cursor: pointer; text-align: left; color: var(--text); padding: 12px 0; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

/* Receive sheet */
.sheet-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 50; }
.sheet { background: var(--bg); width: 100%; max-width: 480px; border-radius: 22px 22px 0 0; padding: 12px 18px 28px; animation: slideup 0.18s ease; }
@keyframes slideup { from { transform: translateY(20px); opacity: 0.6; } to { transform: none; opacity: 1; } }
.sheet-handle { width: 40px; height: 4px; border-radius: 2px; background: var(--border); margin: 4px auto 12px; }
.sheet-title { text-align: center; margin: 4px 0 2px; font-size: 18px; }
.center-text { text-align: center; }
.qr-box { display: flex; justify-content: center; margin: 16px 0; }
.qr-box img { border-radius: 12px; background: #fff; padding: 10px; }
.qr-skel { width: 220px; height: 220px; }
.address-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px; font-family: ui-monospace, monospace; font-size: 13px; word-break: break-all; text-align: center; margin-bottom: 12px; }

/* Language switcher */
.topbar { display: flex; justify-content: flex-end; margin-bottom: 4px; }
.lang-switch { display: inline-flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; padding: 6px 10px; font-size: 13px; }
.lang-switch select { border: none; background: none; color: var(--text); font-size: 13px; font-family: inherit; outline: none; }
.lang-switch.compact { padding: 4px 8px; }
.lang-switch .globe { font-size: 14px; }
.header-actions { margin-inline-start: auto; display: flex; align-items: center; gap: 8px; }

/* Tokens screen */
.search { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; font-size: 15px; color: var(--text); font-family: inherit; margin-bottom: 12px; }
.chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; }
.chip { white-space: nowrap; border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 999px; padding: 7px 14px; font-size: 13px; cursor: pointer; }
.chip.on { background: var(--accent); color: #fff; border-color: var(--accent); }
.token-badge { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.tag { font-style: normal; font-size: 10px; background: var(--border); border-radius: 4px; padding: 1px 5px; margin-inline-start: 6px; color: var(--muted); }

/* Bottom navigation (Telegram-native style) */
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto; display: flex; background: var(--surface); border-top: 1px solid var(--border); }
.bottom-nav button { flex: 1; background: none; border: none; color: var(--muted); font-size: 11px; padding: 10px 0 14px; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; }
.bottom-nav button span { font-size: 20px; }
.bottom-nav button.on { color: var(--accent); }

/* Send: risk indicators */
.field select { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; font-size: 15px; color: var(--text); font-family: inherit; }
.risk-pill { display: flex; gap: 6px; align-items: center; font-size: 13px; padding: 10px 12px; border-radius: 10px; margin: -4px 0 12px; }
.risk-pill.green { background: color-mix(in srgb, var(--ok) 12%, var(--surface)); color: var(--ok); }
.risk-pill.yellow { background: color-mix(in srgb, var(--warning) 14%, var(--surface)); color: var(--warning); }
.risk-pill.red { background: color-mix(in srgb, var(--danger) 14%, var(--surface)); color: var(--danger); }
.review { margin: 8px 0 16px; }
.review-row { display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.review-row dt { color: var(--muted); }
.review-row dd { margin: 0; text-align: end; word-break: break-all; }
.risk-box { border-radius: 12px; padding: 12px 14px; margin-bottom: 16px; font-size: 13px; }
.risk-box ul { margin: 6px 0 0; padding-inline-start: 18px; }
.risk-box.red { background: color-mix(in srgb, var(--danger) 12%, var(--surface)); border: 1px solid color-mix(in srgb, var(--danger) 35%, transparent); }
.risk-box.yellow { background: color-mix(in srgb, var(--warning) 12%, var(--surface)); border: 1px solid color-mix(in srgb, var(--warning) 35%, transparent); }
.risk-box.green { background: color-mix(in srgb, var(--ok) 12%, var(--surface)); border: 1px solid color-mix(in srgb, var(--ok) 35%, transparent); }
.result-badge { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; margin: 14px auto 16px; }
.result-badge.ok { background: color-mix(in srgb, var(--ok) 18%, var(--surface)); color: var(--ok); }
.result-badge.warn { background: color-mix(in srgb, var(--warning) 18%, var(--surface)); color: var(--warning); }
.result-badge.err { background: color-mix(in srgb, var(--danger) 18%, var(--surface)); color: var(--danger); }

/* Network badge + selector */
.coin-logo { border-radius: 50%; object-fit: cover; background: var(--surface); flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.10); }
.net-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: #fff; font-weight: 700; letter-spacing: -0.02em; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
.net-row { display: flex; justify-content: center; margin: 2px 0 16px; }
.net-pill { display: inline-flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; padding: 7px 14px 7px 8px; font-size: 14px; font-weight: 600; color: var(--text); cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.net-pill:active { transform: scale(0.98); }
.net-pill-caret { color: var(--muted); font-size: 11px; }
.net-list { display: grid; gap: 6px; max-height: 60vh; overflow-y: auto; padding-bottom: 8px; }
.net-item { display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: 1px solid transparent; border-radius: 14px; padding: 10px 12px; cursor: pointer; color: var(--text); text-align: start; }
.net-item:active { transform: scale(0.99); }
.net-item.active { background: color-mix(in srgb, var(--accent) 10%, var(--surface)); border-color: color-mix(in srgb, var(--accent) 30%, transparent); }
.net-item-text { display: flex; flex-direction: column; }
.net-item-name { font-weight: 600; font-size: 15px; }
.net-item-sym { color: var(--muted); font-size: 12px; }
.net-check { margin-inline-start: auto; color: var(--accent); font-weight: 700; }

.icon-btn { background: var(--surface); border: 1px solid var(--border); border-radius: 50%; width: 34px; height: 34px; font-size: 15px; cursor: pointer; }
.sheet-head { display: flex; align-items: center; justify-content: center; gap: 10px; }

/* Active-network account card + assets list */
.asset-card-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 6px; }
.asset-card-head h2 { margin: 0; }
.asset-row { display: flex; align-items: center; gap: 14px; padding: 11px 0; border-bottom: 1px solid var(--border); }
.asset-row:last-child { border-bottom: none; }
.asset-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.asset-name { font-weight: 700; font-size: 15px; }
.asset-sub { color: var(--muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
.asset-addr { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 4px 8px; color: var(--muted); font-size: 11px; font-family: ui-monospace, monospace; cursor: pointer; }
.asset-bal { margin-inline-start: auto; text-align: end; }

/* Live balances */
.bal { margin-inline-start: auto; text-align: end; }
.bal-am

...[truncated]...
```

### `apps\miniapp\src\styles.css`

```css
:root {
  /* Brand: cool aurora (deliberately not any existing wallet's palette). */
  --accent: #4f7cff;
  --accent-2: #16c2a3;
  --danger: #ef4444;
  --warning: #f59e0b;
  --ok: #16c2a3;

  /* Fallbacks; overridden by Telegram theme vars (--tg-bg-color, etc.) when present. */
  --bg: var(--tg-bg-color, #f4f5f7);
  --surface: var(--tg-secondary-bg-color, #ffffff);
  --text: var(--tg-text-color, #0f1115);
  --muted: var(--tg-hint-color, #8a909c);
  --border: rgba(0, 0, 0, 0.08);
}

:root[data-theme="dark"] {
  --bg: var(--tg-bg-color, #0f1115);
  --surface: var(--tg-secondary-bg-color, #1a1d24);
  --text: var(--tg-text-color, #f4f5f7);
  --muted: var(--tg-hint-color, #8a909c);
  --border: rgba(255, 255, 255, 0.08);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

.app { max-width: 480px; margin: 0 auto; padding: 16px 16px 96px; }

.brand { display: flex; align-items: center; gap: 10px; padding: 8px 0 18px; }
.brand .mark {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}
.brand h1 { font-size: 19px; margin: 0; letter-spacing: -0.02em; }
.brand .net { margin-left: auto; font-size: 12px; color: var(--muted);
  background: var(--surface); border: 1px solid var(--border); padding: 6px 10px; border-radius: 999px; }

.balance-card {
  background: linear-gradient(160deg, var(--accent), var(--accent-2));
  color: #fff; border-radius: 20px; padding: 22px; margin-bottom: 16px;
  box-shadow: 0 12px 30px rgba(79, 124, 255, 0.25);
}
.balance-card .label { opacity: 0.85; font-size: 13px; }
.balance-card .amount { font-size: 34px; font-weight: 700; margin-top: 6px; letter-spacing: -0.03em; }
.balance-card .sub { opacity: 0.85; font-size: 13px; margin-top: 4px; }

.actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
.action {
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
  padding: 14px 6px; text-align: center; cursor: pointer; font-size: 12px; color: var(--text);
  transition: transform 0.06s ease;
}
.action:active { transform: scale(0.96); }
.action .ico { font-size: 20px; display: block; margin-bottom: 6px; }

.card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 16px; margin-bottom: 14px; }
.card h2 { font-size: 14px; margin: 0 0 12px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }

.banner {
  display: flex; gap: 10px; align-items: flex-start;
  background: color-mix(in srgb, var(--warning) 12%, var(--surface));
  border: 1px solid color-mix(in srgb, var(--warning) 35%, transparent);
  border-radius: 14px; padding: 14px; margin-bottom: 16px; font-size: 13px;
}
.banner .ico { font-size: 18px; }
.banner b { display: block; margin-bottom: 2px; }

.row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.row:last-child { border-bottom: none; }
.row .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); }
.row .dot.off { background: var(--muted); }
.row .name { font-weight: 600; font-size: 14px; }
.row .meta { color: var(--muted); font-size: 12px; }
.row .right { margin-left: auto; color: var(--muted); font-size: 12px; }

.status { font-size: 12px; color: var(--muted); text-align: center; padding-top: 8px; }
.status .ok { color: var(--ok); }
.status .err { color: var(--danger); }

.btn {
  display: block; width: 100%; border: none; border-radius: 14px; padding: 14px;
  background: var(--accent); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer;
}
.btn.secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); }

.skeleton { background: linear-gradient(90deg, var(--border), transparent, var(--border));
  background-size: 200% 100%; animation: sk 1.2s infinite; border-radius: 8px; height: 14px; }
@keyframes sk { to { background-position: -200% 0; } }

```

### `apps\miniapp\src\telegram.ts`

```ts
/**
 * Thin wrapper over the Telegram WebApp runtime (window.Telegram.WebApp).
 * Degrades gracefully in a normal browser so the app is developable without
 * Telegram. We never trust the client-side user object for auth — `initData`
 * is verified server-side; this is for UX only.
 */

type ThemeParams = Record<string, string>;

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: { id: number; username?: string; first_name?: string } };
  colorScheme?: "light" | "dark";
  themeParams?: ThemeParams;
  ready: () => void;
  expand: () => void;
  HapticFeedback?: { impactOccurred: (s: "light" | "medium" | "heavy") => void };
  onEvent?: (event: string, cb: () => void) => void;
}

function getWebApp(): TelegramWebApp | undefined {
  return (globalThis as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
}

const TELEGRAM_SDK_URL = "https://telegram.org/js/telegram-web-app.js";

/**
 * Load the Telegram WebApp runtime AFTER first paint (non-blocking). Loading it
 * as a render-blocking <script> stalls the page if telegram.org is unreachable
 * (e.g. dev sandboxes). When absent, the app degrades to browser mode.
 */
function loadTelegramSdk(): Promise<void> {
  return new Promise((resolve) => {
    if (getWebApp() || document.querySelector(`script[src="${TELEGRAM_SDK_URL}"]`)) {
      return resolve();
    }
    const s = document.createElement("script");
    s.src = TELEGRAM_SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve(); // tolerate offline / blocked: continue in browser mode
    document.head.appendChild(s);
  });
}

export const isTelegram = (): boolean => Boolean(getWebApp()?.initData);

/** The raw initData string to send to the backend as `Authorization: tma ...`. */
export const getInitData = (): string => getWebApp()?.initData ?? "";

export function applyTelegramTheme(): void {
  const wa = getWebApp();
  const root = document.documentElement;
  const scheme = wa?.colorScheme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.theme = scheme;
  const params = wa?.themeParams ?? {};
  // Map Telegram theme vars onto our CSS custom properties when present.
  for (const [key, value] of Object.entries(params)) {
    root.style.setProperty(`--tg-${key.replace(/_/g, "-")}`, value);
  }
}

export async function initTelegram(): Promise<void> {
  applyTelegramTheme(); // paint immediately with system theme
  await loadTelegramSdk();
  const wa = getWebApp();
  wa?.ready();
  wa?.expand();
  applyTelegramTheme(); // re-apply with Telegram theme once available
  wa?.onEvent?.("themeChanged", applyTelegramTheme);
}

export function haptic(kind: "light" | "medium" | "heavy" = "light"): void {
  getWebApp()?.HapticFeedback?.impactOccurred(kind);
}

```

### `apps\miniapp\src\wallet\accounts.ts`

```ts
/**
 * Derive display accounts (addresses) from a mnemonic for every supported chain
 * family. Private keys are derived transiently to compute addresses, then
 * zeroized — only addresses live in UI state. The mnemonic itself is held in the
 * in-memory session (see session.ts), never in React state or storage.
 */
import { mnemonicToSeed, zeroize } from "@nova/wallet-core";
import { deriveEvm, deriveTon, deriveSolana, deriveBitcoin } from "@nova/chains";

export interface ChainAccount {
  family: "ton" | "evm" | "solana" | "bitcoin";
  /** Human label; EVM address is shared across Ethereum/BSC/Polygon. */
  label: string;
  symbol: string;
  address: string;
}

export function deriveAccounts(mnemonic: string): ChainAccount[] {
  const seed = mnemonicToSeed(mnemonic);
  try {
    const ton = deriveTon(seed, 0);
    const evm = deriveEvm(seed, 0);
    const sol = deriveSolana(seed, 0);
    const btc = deriveBitcoin(seed, 0);

    const accounts: ChainAccount[] = [
      { family: "ton", label: "TON", symbol: "TON", address: ton.address },
      { family: "evm", label: "EVM", symbol: "ETH", address: evm.address },
      { family: "solana", label: "Solana", symbol: "SOL", address: sol.address },
      { family: "bitcoin", label: "Bitcoin", symbol: "BTC", address: btc.address },
    ];

    // Wipe private key material now that addresses are captured.
    zeroize(ton.privateKey, evm.privateKey, sol.privateKey, btc.privateKey);
    return accounts;
  } finally {
    zeroize(seed);
  }
}

```

### `apps\miniapp\src\wallet\db.ts`

```ts
/**
 * Minimal IndexedDB key-value store (no dependency). Used ONLY to persist the
 * encrypted vault envelope and non-sensitive metadata. Never stores plaintext
 * secrets — the envelope is already AES-256-GCM sealed by @nova/wallet-core.
 */
const DB_NAME = "nova-wallet";
const STORE = "kv";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const store = db.transaction(STORE, mode).objectStore(STORE);
    const req = fn(store);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export const kvGet = <T>(key: string): Promise<T | undefined> =>
  tx<T | undefined>("readonly", (s) => s.get(key));

export const kvSet = (key: string, value: unknown): Promise<void> =>
  tx<void>("readwrite", (s) => s.put(value, key));

export const kvDel = (key: string): Promise<void> =>
  tx<void>("readwrite", (s) => s.delete(key));

```

### `apps\miniapp\src\wallet\recents.ts`

```ts
/**
 * Recent recipients per chain family — non-sensitive, used to power the
 * "first-time recipient" and address-poisoning risk checks. Stored in IndexedDB.
 */
import { kvGet, kvSet } from "./db.js";

const KEY = "recents";
type RecentsMap = Partial<Record<string, string[]>>;

export async function getRecents(family: string): Promise<string[]> {
  const map = (await kvGet<RecentsMap>(KEY)) ?? {};
  return map[family] ?? [];
}

export async function addRecent(family: string, address: string): Promise<void> {
  const map = (await kvGet<RecentsMap>(KEY)) ?? {};
  const list = map[family] ?? [];
  const next = [address, ...list.filter((a) => a.toLowerCase() !== address.toLowerCase())].slice(0, 20);
  await kvSet(KEY, { ...map, [family]: next });
}

```

### `apps\miniapp\src\wallet\session.ts`

```ts
/**
 * In-memory wallet session. Holds the decrypted mnemonic ONLY while unlocked,
 * outside React state (so it is never serialized into the DOM, devtools, or
 * persisted snapshots). Cleared on lock.
 */
let unlockedMnemonic: string | null = null;

export const setSessionMnemonic = (m: string): void => {
  unlockedMnemonic = m;
};

export const getSessionMnemonic = (): string | null => unlockedMnemonic;

export const clearSession = (): void => {
  unlockedMnemonic = null;
};

```

### `apps\miniapp\src\wallet\sign.ts`

```ts
/**
 * Build → sign → broadcast a native transfer, entirely client-side.
 *
 * The private key is derived transiently from the in-memory session mnemonic,
 * used to sign, and the seed is zeroized. Broadcasting requires a configured RPC
 * (VITE_*_RPC_URL); without one we still sign locally and report `needRpc` so the
 * user understands the transaction was prepared but not sent — never silently.
 */
import { mnemonicToSeed, zeroize } from "@nova/wallet-core";
import {
  NETWORKS,
  deriveEvm, evmSigner, EvmProvider,
  deriveTon, TonProvider, buildSignedTransferBoc,
  deriveSolana, SolanaProvider,
  deriveBitcoin, BitcoinProvider,
} from "@nova/chains";
import { getSessionMnemonic } from "./session.js";
import { api, type SwapTx } from "../api.js";

export type SendStatus = "sent" | "signed_local" | "error";
export interface SendResult { status: SendStatus; hash?: string; error?: string; }

type Env = Record<string, string | undefined>;
const env = (import.meta as { env?: Env }).env ?? {};

function rpcFor(networkId: string): string | undefined {
  const map: Record<string, string | undefined> = {
    "evm:1": env.VITE_EVM_RPC_URL,
    "evm:42161": env.VITE_ARBITRUM_RPC_URL,
    "evm:10": env.VITE_OPTIMISM_RPC_URL,
    "evm:8453": env.VITE_BASE_RPC_URL,
    "evm:56": env.VITE_BSC_RPC_URL,
    "evm:137": env.VITE_POLYGON_RPC_URL,
    "evm:43114": env.VITE_AVALANCHE_RPC_URL,
    "ton:mainnet": env.VITE_TON_RPC_URL,
    "solana:mainnet": env.VITE_SOLANA_RPC_URL,
    "bitcoin:mainnet": env.VITE_BITCOIN_API_URL,
  };
  return map[networkId];
}

/**
 * Execute an EVM swap: take the aggregator's unsigned tx, attach a fresh nonce
 * from the backend, sign locally, and broadcast. Non-custodial — the key never
 * leaves the device.
 */
export async function executeSwap(networkId: string, tx: SwapTx): Promise<SendResult> {
  const mnemonic = getSessionMnemonic();
  if (!mnemonic) return { status: "error", error: "locked" };
  const net = NETWORKS[networkId];
  if (!net || net.family !== "evm") return { status: "error", error: "unsupported_family" };
  const seed = mnemonicToSeed(mnemonic);
  try {
    const acct = deriveEvm(seed, 0);
    const prep = await api.evmPrepare(networkId, acct.address);
    const builder = new EvmProvider({ ...net, rpcUrl: "http://placeholder" });
    const gasPrice = BigInt(tx.gasPrice) > 0n ? BigInt(tx.gasPrice) : BigInt(prep.maxFeePerGas);
    const txObj = builder.buildLegacyCall({
      to: tx.to as `0x${string}`,
      data: tx.data as `0x${string}`,
      value: BigInt(tx.value),
      gas: BigInt(tx.gasLimit),
      gasPrice,
      nonce: prep.nonce,
      chainId: tx.chainId,
    });
    const signed = await EvmProvider.sign(evmSigner(acct), txObj);
    zeroize(acct.privateKey);
    const res = await api.broadcast(networkId, signed);
    return { status: "sent", hash: res.hash ?? undefined };
  } catch (err) {
    return { status: "error", error: err instanceof Error ? err.message : "swap_failed" };
  } finally {
    zeroize(seed);
  }
}

export async function signAndSend(params: {
  family: string;
  networkId: string;
  to: string;
  amount: string;
}): Promise<SendResult> {
  const mnemonic = getSessionMnemonic();
  if (!mnemonic) return { status: "error", error: "locked" };
  const net = NETWORKS[params.networkId];
  if (!net) return { status: "error", error: "unknown_network" };
  const seed = mnemonicToSeed(mnemonic);

  try {
    // EVM: build & sign locally, but use the backend for nonce/fees + broadcast,
    // so the client needs no RPC keys (signing still happens here — non-custodial).
    if (params.family === "evm") {
      const acct = deriveEvm(seed, 0);
      const prep = await api.evmPrepare(params.networkId, acct.address);
      const builder = new EvmProvider({ ...net, rpcUrl: "http://placeholder" });
      const tx = builder.buildNativeTransfer({
        to: params.to as `0x${string}`,
        amountEth: params.amount,
        nonce: prep.nonce,
        chainId: prep.chainId,
        maxFeePerGas: BigInt(prep.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(prep.maxPriorityFeePerGas),
        gas: BigInt(prep.gas),
      });
      const signed = await EvmProvider.sign(evmSigner(acct), tx);
      zeroize(acct.privateKey);
      const res = await api.broadcast(params.networkId, signed);
      return { status: "sent", hash: res.hash ?? undefined };
    }

    // Non-EVM families build client-side and still need a client RPC for now.
    const rpc = rpcFor(params.networkId);
    if (!rpc) return { status: "error", error: "needRpc" };

    switch (params.family) {
      case "ton": {
        const acct = deriveTon(seed, 0);
        const provider = new TonProvider({ ...net, rpcUrl: rpc });
        const seqno = await provider.getSeqno(acct.publicKey);
        const boc = buildSignedTransferBoc(acct, { to: params.to, amountTon: params.amount, seqno });
        zeroize(acct.privateKey);
        await provider.broadcastBoc(boc);
        return { status: "sent" };
      }
      case "solana": {
        const acct = deriveSolana(seed, 0);
        const provider = new SolanaProvider({ ...net, rpcUrl: rpc });
        const signed = await provider.buildSignedTransfer(acct, params.to, params.amount);
        zeroize(acct.privateKey);
        return { status: "sent", hash: await provider.broadcast(signed) };
      }
      case "bitcoin": {
        const acct = deriveBitcoin(seed, 0);
        const provider = new BitcoinProvider({ ...net, rpcUrl: rpc });
        const utxos = await provider.getUtxos(acct.address);
        const { hex } = provider.buildSignedTransfer({
          account: acct,
          to: params.to,
          amountSats: BigInt(Math.round(Number(params.amount) * 1e8)),
          feeRateSatVb: 10,
          utxos,
        });
        zeroize(acct.privateKey);
        return { status: "sent", hash: await provider.broadcast(hex) };
      }
      default:
        return { status: "error", error: "unsupported_family" };
    }
  } catch (err) {
    return { status: "error", error: err instanceof Error ? err.message : "broadcast_failed" };
  } finally {
    zeroize(seed);
  }
}

```

### `apps\miniapp\src\wallet\store.tsx`

```tsx
/**
 * Wallet state container. Orchestrates the encrypted vault + in-memory session
 * and exposes a small action surface to the UI. No private key or mnemonic ever
 * enters this React state — only derived addresses and a lock status.
 */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  sealVault,
  openVault,
  isValidMnemonic,
  normalizeMnemonic,
  type VaultEnvelope,
} from "@nova/wallet-core";
import { kvGet, kvSet, kvDel } from "./db.js";
import { deriveAccounts, type ChainAccount } from "./accounts.js";
import { setSessionMnemonic, getSessionMnemonic, clearSession } from "./session.js";

const VAULT_KEY = "vault";
const AUTO_LOCK_MS = 5 * 60 * 1000; // 5 minutes of inactivity

export type WalletStatus = "loading" | "no-wallet" | "locked" | "unlocked";

interface WalletContextValue {
  status: WalletStatus;
  accounts: ChainAccount[];
  error: string | null;
  /** Seal a (new or imported) mnemonic under a PIN and unlock. */
  createFromMnemonic: (mnemonic: string, pin: string) => Promise<void>;
  /** Import: validates the phrase, then seals it. */
  importMnemonic: (mnemonic: string, pin: string) => Promise<void>;
  /** Decrypt the stored vault with a PIN. Throws-safe: sets error on failure. */
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  /** Destroy the wallet on this device (does not touch funds on-chain). */
  reset: () => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<WalletStatus>("loading");
  const [accounts, setAccounts] = useState<ChainAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const lockTimer = useRef<number | undefined>(undefined);

  // Detect an existing vault on boot.
  useEffect(() => {
    kvGet<VaultEnvelope>(VAULT_KEY)
      .then((env) => setStatus(env ? "locked" : "no-wallet"))
      .catch(() => setStatus("no-wallet"));
  }, []);

  function activateSession(mnemonic: string) {
    setSessionMnemonic(mnemonic);
    setAccounts(deriveAccounts(mnemonic));
    setStatus("unlocked");
    setError(null);
  }

  const lock = useMemo(
    () => () => {
      clearSession();
      setAccounts([]);
      setStatus((s) => (s === "unlocked" ? "locked" : s));
    },
    [],
  );

  // Auto-lock on inactivity while unlocked.
  useEffect(() => {
    if (status !== "unlocked") return;
    const reset = () => {
      window.clearTimeout(lockTimer.current);
      lockTimer.current = window.setTimeout(lock, AUTO_LOCK_MS);
    };
    reset();
    const events = ["pointerdown", "keydown", "visibilitychange"];
    events.forEach((e) => window.addEventListener(e, reset));
    return () => {
      window.clearTimeout(lockTimer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [status, lock]);

  const value: WalletContextValue = {
    status,
    accounts,
    error,
    clearError: () => setError(null),

    createFromMnemonic: async (mnemonic, pin) => {
      const env = sealVault(mnemonic, pin);
      await kvSet(VAULT_KEY, env);
      activateSession(mnemonic);
    },

    importMnemonic: async (mnemonic, pin) => {
      const normalized = normalizeMnemonic(mnemonic);
      if (!isValidMnemonic(normalized)) throw new Error("That recovery phrase isn't valid.");
      const env = sealVault(normalized, pin);
      await kvSet(VAULT_KEY, env);
      activateSession(normalized);
    },

    unlock: async (pin) => {
      try {
        const env = await kvGet<VaultEnvelope>(VAULT_KEY);
        if (!env) {
          setStatus("no-wallet");
          return false;
        }
        const mnemonic = openVault(env, pin); // throws on wrong PIN
        activateSession(mnemonic);
        return true;
      } catch {
        setError("Incorrect PIN. Try again.");
        return false;
      }
    },

    lock,

    reset: async () => {
      clearSession();
      await kvDel(VAULT_KEY);
      setAccounts([]);
      setStatus("no-wallet");
    },
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

/** Read the current mnemonic for an explicit, gated reveal (backup/export). */
export const peekMnemonic = (): string | null => getSessionMnemonic();

```

### `apps\miniapp\src\wallet\usePortfolio.ts`

```ts
/**
 * Live portfolio: fetches USD prices once and a native balance per account, then
 * computes per-account fiat and total net worth. Read-only — addresses only.
 */
import { useEffect, useState } from "react";
import { api } from "../api.js";
import type { ChainAccount } from "./accounts.js";

/** Primary network + CoinGecko id used to value each account's native asset. */
const FAMILY_MAP: Record<ChainAccount["family"], { net: string; cg: string }> = {
  ton: { net: "ton:mainnet", cg: "the-open-network" },
  evm: { net: "evm:1", cg: "ethereum" },
  solana: { net: "solana:mainnet", cg: "solana" },
  bitcoin: { net: "bitcoin:mainnet", cg: "bitcoin" },
};

export interface AccountBalance {
  account: ChainAccount;
  formatted: string;
  symbol: string;
  fiat: number | null;
  error: boolean;
}

export interface Portfolio {
  items: AccountBalance[];
  totalFiat: number | null;
  loading: boolean;
}

export function usePortfolio(accounts: ChainAccount[]): Portfolio {
  const [items, setItems] = useState<AccountBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accounts.length === 0) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      const ids = [...new Set(accounts.map((a) => FAMILY_MAP[a.family].cg))];
      const priceRes = await api.prices(ids).catch(() => ({ prices: {} as Record<string, number> }));
      const prices = priceRes.prices;

      const results = await Promise.all(
        accounts.map(async (account): Promise<AccountBalance> => {
          const m = FAMILY_MAP[account.family];
          try {
            const b = await api.balance(m.net, account.address);
            const price = prices[m.cg];
            const amount = Number(b.formatted);
            return {
              account,
              formatted: b.formatted,
              symbol: b.symbol,
              fiat: typeof price === "number" ? amount * price : null,
              error: false,
            };
          } catch {
            return { account, formatted: "—", symbol: account.symbol, fiat: null, error: true };
          }
        }),
      );

      if (!cancelled) {
        setItems(results);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [accounts]);

  const withFiat = items.filter((i) => i.fiat !== null);
  const totalFiat = withFiat.length > 0 ? withFiat.reduce((s, i) => s + (i.fiat ?? 0), 0) : null;

  return { items, totalFiat, loading };
}

/** Live native balance for one specific network + address (e.g. the active network). */
export function useNetworkBalance(networkId: string, address: string, cgId: string) {
  const [state, setState] = useState<{ formatted: string; symbol: string; fiat: number | null; loading: boolean; error: boolean }>(
    { formatted: "0", symbol: "", fiat: null, loading: true, error: false },
  );

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: false }));
    (async () => {
      try {
        const [b, p] = await Promise.all([api.balance(networkId, address), api.prices([cgId])]);
        const price = p.prices[cgId];
        if (!cancelled) {
          setState({
            formatted: b.formatted,
            symbol: b.symbol,
            fiat: typeof price === "number" ? Number(b.formatted) * price : null,
            loading: false,
            error: false,
          });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: true }));
      }
    })();
    return () => { cancelled = true; };
  }, [networkId, address, cgId]);

  return state;
}

export interface Asset {
  symbol: string;
  name: string;
  /** null for the native coin. */
  address: string | null;
  formatted: string;
  fiat: number | null;
}

/**
 * Full asset list for one network: native coin + non-zero token balances, each
 * valued in USD. Powers the MetaMask-style assets list on Home.
 */
export function useAssets(networkId: string, address: string, nativeCg: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [nativeBal, tokenRes] = await Promise.all([
        api.balance(networkId, address).catch(() => null),
        api.tokenBalances(networkId, address).catch(() => ({ tokens: [] })),
      ]);
      const tokens = tokenRes.tokens;
      const ids = [nativeCg, ...tokens.map((tk) => tk.coingeckoId).filter(Boolean) as string[]];
      const priceRes = await api.prices([...new Set(ids)]).catch(() => ({ prices: {} as Record<string, number> }));
      const prices = priceRes.prices;
      const valued = (cg: string | undefined, formatted: string): number | null =>
        cg && typeof prices[cg] === "number" ? Number(formatted) * prices[cg]! : null;

      const list: Asset[] = [];
      if (nativeBal) list.push({ symbol: nativeBal.symbol, name: nativeBal.symbol, address: null, formatted: nativeBal.formatted, fiat: valued(nativeCg, nativeBal.formatted) });
      for (const tk of tokens) list.push({ symbol: tk.symbol, name: tk.name, address: tk.address, formatted: tk.formatted, fiat: valued(tk.coingeckoId, tk.formatted) });

      if (!cancelled) { setAssets(list); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [networkId, address, nativeCg]);

  return { assets, loading };
}

/** Trim a decimal string to a readable length without rounding up the integer part. */
export function trimAmount(formatted: string, maxFrac = 6): string {
  if (!formatted.includes(".")) return formatted;
  const [whole, frac] = formatted.split(".");
  const trimmed = frac!.slice(0, maxFrac).replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole!;
}

export function formatUsd(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

```

### `apps\miniapp\tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}

```

### `apps\miniapp\vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Crypto libs (@ton, @solana) expect Node globals; map `global` to the browser.
  define: {
    global: "globalThis",
  },
  server: {
    port: 5173,
    host: true,
  },
});

```

### `docker-compose.yml`

```yml
# Local production-like stack. For real deployment, run api/miniapp behind an
# HTTPS reverse proxy (Caddy/Traefik/Cloud LB) — Telegram requires HTTPS.
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      NODE_ENV: production
      API_PORT: 8787
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      INITDATA_MAX_AGE_SECONDS: 86400
      CORS_ORIGINS: ${CORS_ORIGINS:-http://localhost:8080}
      DATABASE_URL: postgres://nova:${POSTGRES_PASSWORD:-nova}@postgres:5432/nova
      REDIS_URL: redis://redis:6379
      # Dedicated RPC providers (recommended for production):
      EVM_RPC_URL: ${EVM_RPC_URL:-}
      SOLANA_RPC_URL: ${SOLANA_RPC_URL:-}
      TON_RPC_URL: ${TON_RPC_URL:-}
      BITCOIN_API_URL: ${BITCOIN_API_URL:-}
    ports:
      - "8787:8787"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  miniapp:
    build:
      context: .
      dockerfile: apps/miniapp/Dockerfile
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL:-http://localhost:8787}
    ports:
      - "8080:80"
    depends_on:
      - api
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: nova
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-nova}
      POSTGRES_DB: nova
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  pgdata:

```

### `package.json`

```json
{
  "name": "novawallet",
  "version": "0.1.0",
  "private": true,
  "description": "Non-custodial crypto wallet as a Telegram Mini App (TON-first, EVM-ready).",
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@eslint/js": "^9.18.0",
    "eslint": "^9.18.0",
    "globals": "^15.14.0",
    "typescript-eslint": "^8.20.0"
  },
  "engines": {
    "node": ">=20"
  },
  "comment:overrides": "Force patched transitive deps (ws via viem/solana; uuid via solana's jayson RPC client) instead of major-downgrading viem/web3.js. See docs/02-SECURITY.md.",
  "overrides": {
    "ws": "^8.21.0",
    "uuid": "^11.1.1"
  },
  "license": "UNLICENSED"
}

```

### `packages\chains\package.json`

```json
{
  "name": "@nova/chains",
  "version": "0.1.0",
  "private": true,
  "description": "Chain abstraction: TON (ed25519/SLIP-0010) + EVM (viem) derivation, providers, unsigned-tx builders, local signers.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "node --import tsx --test \"test/**/*.test.ts\""
  },
  "dependencies": {
    "@nova/wallet-core": "*",
    "@noble/curves": "^1.8.1",
    "@noble/hashes": "^1.7.1",
    "@scure/base": "^1.2.4",
    "@scure/btc-signer": "^1.5.0",
    "@solana/web3.js": "^1.98.0",
    "@ton/core": "^0.62.0",
    "@ton/crypto": "^3.3.0",
    "@ton/ton": "^15.1.0",
    "viem": "^2.21.55"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}

```

### `packages\chains\src\bitcoin\account.ts`

```ts
/**
 * Bitcoin account derivation (BIP84 native SegWit, P2WPKH / bech32 `bc1…`).
 * Reuses the shared secp256k1 BIP32 derivation from @nova/wallet-core, then
 * renders a native-segwit address via the audited @scure/btc-signer.
 */
import { deriveSecp256k1 } from "@nova/wallet-core";
import { p2wpkh, NETWORK, TEST_NETWORK } from "@scure/btc-signer";
import type { DerivedAccount } from "../types.js";

/** BIP84 account path. Receiving chain (0), address index i. */
export function bitcoinPath(accountIndex: number): string {
  if (!Number.isInteger(accountIndex) || accountIndex < 0) {
    throw new Error("accountIndex must be a non-negative integer.");
  }
  return `m/84'/0'/0'/0/${accountIndex}`;
}

export interface BitcoinAccount extends DerivedAccount {
  isTestnet: boolean;
}

/** Derive the i-th Bitcoin native-segwit account from a BIP39 seed. */
export function deriveBitcoin(
  seed: Uint8Array,
  accountIndex: number,
  isTestnet = false,
): BitcoinAccount {
  const key = deriveSecp256k1(seed, bitcoinPath(accountIndex));
  const payment = p2wpkh(key.publicKey, isTestnet ? TEST_NETWORK : NETWORK);
  if (!payment.address) throw new Error("Failed to derive Bitcoin address.");
  return {
    family: "bitcoin",
    path: key.path,
    address: payment.address,
    publicKey: key.publicKey,
    privateKey: key.privateKey,
    isTestnet,
  };
}

```

### `packages\chains\src\bitcoin\provider.ts`

```ts
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

```

### `packages\chains\src\evm\account.ts`

```ts
/**
 * EVM account derivation + local signing. Keys come from the shared BIP39 seed
 * via @nova/wallet-core (secp256k1 / BIP44). Signing happens here, locally; the
 * private key never leaves the process and is the caller's to zeroize.
 */
import { deriveEvmAccount } from "@nova/wallet-core";
import {
  privateKeyToAccount,
  type PrivateKeyAccount,
} from "viem/accounts";
import type { DerivedAccount } from "../types.js";

function hex(bytes: Uint8Array): `0x${string}` {
  let s = "0x";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s as `0x${string}`;
}

/** Derive the i-th EVM account from a 64-byte BIP39 seed. */
export function deriveEvm(seed: Uint8Array, accountIndex: number): DerivedAccount {
  const acct = deriveEvmAccount(seed, accountIndex);
  return {
    family: "evm",
    path: acct.path,
    address: acct.address,
    publicKey: acct.publicKey,
    privateKey: acct.privateKey,
  };
}

/** Build a viem signer (local account) from a derived account's private key. */
export function evmSigner(account: DerivedAccount): PrivateKeyAccount {
  return privateKeyToAccount(hex(account.privateKey));
}

```

### `packages\chains\src\evm\provider.ts`

```ts
/**
 * EVM provider: read-only chain access + unsigned transaction building + local
 * signing + broadcast. The build/sign/broadcast split mirrors the wallet's
 * golden rule — the server may build & broadcast, but only the client signs.
 */
import {
  createPublicClient,
  http,
  parseEther,
  formatEther,
  recoverTransactionAddress,
  erc20Abi,
  type Hex,
  type PublicClient,
  type TransactionSerializable,
  type TransactionSerialized,
} from "viem";

/** Multicall3 — deployed at this same address on every major EVM chain. */
const MULTICALL3 = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;
import type { PrivateKeyAccount } from "viem/accounts";
import type { NativeBalance, NetworkConfig } from "../types.js";

export interface EvmNativeTransferParams {
  to: `0x${string}`;
  /** Amount in ETH (decimal string), e.g. "0.01". */
  amountEth: string;
  nonce: number;
  chainId: number;
  /** EIP-1559 fees in wei. */
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  gas?: bigint;
}

export class EvmProvider {
  private readonly client: PublicClient;

  constructor(private readonly network: NetworkConfig) {
    if (network.family !== "evm" || !network.rpcUrl) {
      throw new Error("EvmProvider requires an EVM network with an rpcUrl.");
    }
    this.client = createPublicClient({ transport: http(network.rpcUrl) });
  }

  async getNativeBalance(address: `0x${string}`): Promise<NativeBalance> {
    const raw = await this.client.getBalance({ address });
    return {
      raw: raw.toString(),
      decimals: this.network.nativeDecimals,
      symbol: this.network.nativeSymbol,
    };
  }

  formatNative(raw: string): string {
    return formatEther(BigInt(raw));
  }

  async getNonce(address: `0x${string}`): Promise<number> {
    return this.client.getTransactionCount({ address });
  }

  /** Suggest EIP-1559 fees from the node. */
  async suggestFees(): Promise<{ maxFeePerGas: bigint; maxPriorityFeePerGas: bigint }> {
    const fees = await this.client.estimateFeesPerGas();
    return {
      maxFeePerGas: fees.maxFeePerGas ?? 2_000_000_000n,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas ?? 1_000_000_000n,
    };
  }

  /** Whether `address` is a smart contract (has code) — used for risk checks. */
  async isContract(address: `0x${string}`): Promise<boolean> {
    const code = await this.client.getCode({ address });
    return Boolean(code && code !== "0x");
  }

  /**
   * Batch ERC-20 balanceOf for `owner` via Multicall3 (same address on every
   * major EVM chain). Returns raw balances aligned with the input token order.
   */
  async getTokenBalances(
    owner: `0x${string}`,
    tokenAddresses: `0x${string}`[],
  ): Promise<string[]> {
    if (tokenAddresses.length === 0) return [];
    const results = await this.client.multicall({
      multicallAddress: MULTICALL3,
      allowFailure: true,
      contracts: tokenAddresses.map((address) => ({
        address,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [owner] as const,
      })),
    });
    return results.map((r) => (r.status === "success" ? (r.result as bigint).toString() : "0"));
  }

  /** Build an UNSIGNED EIP-1559 native transfer. No keys involved. */
  buildNativeTransfer(p: EvmNativeTransferParams): TransactionSerializable {
    return {
      type: "eip1559",
      to: p.to,
      value: parseEther(p.amountEth),
      chainId: p.chainId,
      nonce: p.nonce,
      gas: p.gas ?? 21000n,
      maxFeePerGas: p.maxFeePerGas,
      maxPriorityFeePerGas: p.maxPriorityFeePerGas,
    };
  }

  /**
   * Build an arbitrary contract-call tx (legacy type) — used for aggregator swaps
   * where the tx carries `data`. Pure (no network); fields come from the quote +
   * a fetched nonce.
   */
  buildLegacyCall(p: {
    to: `0x${string}`;
    data: `0x${string}`;
    value: bigint;
    gas: bigint;
    gasPrice: bigint;
    nonce: number;
    chainId: number;
  }): TransactionSerializable {
    return {
      type: "legacy",
      to: p.to,
      data: p.data,
      value: p.value,
      gas: p.gas,
      gasPrice: p.gasPrice,
      nonce: p.nonce,
      chainId: p.chainId,
    };
  }

  /** Sign an unsigned tx locally with the account's key. Returns raw signed hex. */
  static async sign(
    signer: PrivateKeyAccount,
    tx: TransactionSerializable,
  ): Promise<Hex> {
    return signer.signTransaction(tx);
  }

  /** Recover the sender of a signed raw tx (used by tests + risk display). */
  static async senderOf(serialized: Hex): Promise<`0x${string}`> {
    // viem's recover expects the narrowed serialized-tx union; a signed hex is
    // exactly that at runtime, so the cast is sound.
    return recoverTransactionAddress({
      serializedTransaction: serialized as TransactionSerialized,
    });
  }

  /** Broadcast an already-signed raw transaction. Never signs. */
  async broadcast(serialized: Hex): Promise<`0x${string}`> {
    return this.client.sendRawTransaction({ serializedTransaction: serialized });
  }
}

```

### `packages\chains\src\index.ts`

```ts
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
export { deriveEvm, evmSigner } from "./evm/account.js";
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

```

### `packages\chains\src\registry.ts`

```ts
/**
 * Network registry. TON stays as the Telegram-native priority; alongside it we
 * support the requested set: Ethereum, BNB Smart Chain, Polygon (all EVM),
 * Solana (ed25519), and Bitcoin (secp256k1 / native segwit).
 *
 * rpcUrl is intentionally omitted here — endpoints are injected from env/secrets
 * at provider-construction time, never hardcoded.
 */
import type { NetworkConfig } from "./types.js";

export const NETWORKS: Record<string, NetworkConfig> = {
  "ton:mainnet": {
    id: "ton:mainnet",
    family: "ton",
    name: "TON",
    nativeSymbol: "TON",
    nativeDecimals: 9,
    explorerUrl: "https://tonviewer.com",
    isTestnet: false,
  },
  "ton:testnet": {
    id: "ton:testnet",
    family: "ton",
    name: "TON Testnet",
    nativeSymbol: "TON",
    nativeDecimals: 9,
    explorerUrl: "https://testnet.tonviewer.com",
    isTestnet: true,
  },
  "evm:1": {
    id: "evm:1",
    family: "evm",
    name: "Ethereum",
    nativeSymbol: "ETH",
    nativeDecimals: 18,
    chainId: 1,
    explorerUrl: "https://etherscan.io",
    isTestnet: false,
  },
  "evm:42161": {
    id: "evm:42161",
    family: "evm",
    name: "Arbitrum One",
    nativeSymbol: "ETH",
    nativeDecimals: 18,
    chainId: 42161,
    explorerUrl: "https://arbiscan.io",
    isTestnet: false,
  },
  "evm:10": {
    id: "evm:10",
    family: "evm",
    name: "Optimism",
    nativeSymbol: "ETH",
    nativeDecimals: 18,
    chainId: 10,
    explorerUrl: "https://optimistic.etherscan.io",
    isTestnet: false,
  },
  "evm:8453": {
    id: "evm:8453",
    family: "evm",
    name: "Base",
    nativeSymbol: "ETH",
    nativeDecimals: 18,
    chainId: 8453,
    explorerUrl: "https://basescan.org",
    isTestnet: false,
  },
  "evm:56": {
    id: "evm:56",
    family: "evm",
    name: "BNB Smart Chain",
    nativeSymbol: "BNB",
    nativeDecimals: 18,
    chainId: 56,
    explorerUrl: "https://bscscan.com",
    isTestnet: false,
  },
  "evm:137": {
    id: "evm:137",
    family: "evm",
    name: "Polygon",
    nativeSymbol: "POL",
    nativeDecimals: 18,
    chainId: 137,
    explorerUrl: "https://polygonscan.com",
    isTestnet: false,
  },
  "evm:43114": {
    id: "evm:43114",
    family: "evm",
    name: "Avalanche",
    nativeSymbol: "AVAX",
    nativeDecimals: 18,
    chainId: 43114,
    explorerUrl: "https://snowtrace.io",
    isTestnet: false,
  },
  "solana:mainnet": {
    id: "solana:mainnet",
    family: "solana",
    name: "Solana",
    nativeSymbol: "SOL",
    nativeDecimals: 9,
    explorerUrl: "https://solscan.io",
    isTestnet: false,
  },
  "bitcoin:mainnet": {
    id: "bitcoin:mainnet",
    family: "bitcoin",
    name: "Bitcoin",
    nativeSymbol: "BTC",
    nativeDecimals: 8,
    explorerUrl: "https://mempool.space",
    isTestnet: false,
  },
};

export function getNetwork(id: string): NetworkConfig {
  const n = NETWORKS[id];
  if (!n) throw new Error(`Unknown network: ${id}`);
  return n;
}

/** All networks of a given family (e.g. every EVM chain). */
export function networksByFamily(family: NetworkConfig["family"]): NetworkConfig[] {
  return Object.values(NETWORKS).filter((n) => n.family === family);
}

```

### `packages\chains\src\slip10.ts`

```ts
/**
 * SLIP-0010 HD derivation for the ed25519 curve.
 *
 * ed25519 (used by TON and Solana) only supports *hardened* derivation, so every
 * path segment must end with `'`. This lets a single BIP39 seed drive ed25519
 * chains alongside secp256k1 chains (EVM) — one recovery phrase for everything.
 *
 * Implemented per the SLIP-0010 spec and verified against its official ed25519
 * test vectors (see test/slip10.test.ts). No keys are persisted or transmitted.
 */
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";

const ED25519_CURVE = new TextEncoder().encode("ed25519 seed");
const HARDENED_OFFSET = 0x80000000;

export interface Slip10Node {
  key: Uint8Array; // 32-byte private key (ed25519 seed)
  chainCode: Uint8Array; // 32 bytes
}

function hmac512(key: Uint8Array, data: Uint8Array): Uint8Array {
  return hmac(sha512, key, data);
}

function ser32(index: number): Uint8Array {
  const b = new Uint8Array(4);
  b[0] = (index >>> 24) & 0xff;
  b[1] = (index >>> 16) & 0xff;
  b[2] = (index >>> 8) & 0xff;
  b[3] = index & 0xff;
  return b;
}

function masterFromSeed(seed: Uint8Array): Slip10Node {
  const I = hmac512(ED25519_CURVE, seed);
  return { key: I.slice(0, 32), chainCode: I.slice(32) };
}

function deriveChild(node: Slip10Node, index: number): Slip10Node {
  // data = 0x00 || key || ser32(index); ed25519 requires hardened indices.
  const data = new Uint8Array(1 + 32 + 4);
  data[0] = 0x00;
  data.set(node.key, 1);
  data.set(ser32(index), 33);
  const I = hmac512(node.chainCode, data);
  return { key: I.slice(0, 32), chainCode: I.slice(32) };
}

/** Parse an all-hardened path like `m/44'/607'/0'` into numeric indices. */
export function parseHardenedPath(path: string): number[] {
  const parts = path.split("/");
  if (parts[0] !== "m") throw new Error(`Path must start with "m": ${path}`);
  return parts.slice(1).map((seg) => {
    if (!seg.endsWith("'")) {
      throw new Error(`ed25519 (SLIP-0010) requires hardened segments: ${seg}`);
    }
    const n = Number(seg.slice(0, -1));
    if (!Number.isInteger(n) || n < 0 || n >= HARDENED_OFFSET) {
      throw new Error(`Invalid path index: ${seg}`);
    }
    return n + HARDENED_OFFSET;
  });
}

/** Derive an ed25519 node at `path` from a BIP39 seed. */
export function deriveEd25519(seed: Uint8Array, path: string): Slip10Node {
  let node = masterFromSeed(seed);
  for (const index of parseHardenedPath(path)) {
    node = deriveChild(node, index);
  }
  return node;
}

```

### `packages\chains\src\solana\account.ts`

```ts
/**
 * Solana account derivation. Solana uses ed25519, so we reuse the shared
 * SLIP-0010 derivation (the same path machinery as TON) with Solana's coin type
 * 501. Path m/44'/501'/i'/0' matches the common Phantom layout. The address is
 * the base58-encoded 32-byte public key.
 */
import { ed25519 } from "@noble/curves/ed25519";
import { base58 } from "@scure/base";
import { deriveEd25519 } from "../slip10.js";
import type { DerivedAccount } from "../types.js";

export function solanaPath(accountIndex: number): string {
  if (!Number.isInteger(accountIndex) || accountIndex < 0) {
    throw new Error("accountIndex must be a non-negative integer.");
  }
  return `m/44'/501'/${accountIndex}'/0'`;
}

/** Derive the i-th Solana account from a BIP39 seed. */
export function deriveSolana(seed: Uint8Array, accountIndex: number): DerivedAccount {
  const path = solanaPath(accountIndex);
  const node = deriveEd25519(seed, path);
  const publicKey = ed25519.getPublicKey(node.key);
  return {
    family: "solana",
    path,
    address: base58.encode(publicKey), // Solana addresses are base58(pubkey)
    publicKey,
    privateKey: node.key,
  };
}

```

### `packages\chains\src\solana\provider.ts`

```ts
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
    const from = solanaKeypair(account);
    const lamports = parseUnits(amountSol, 9);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: new PublicKey(to),
        lamports,
      }),
    );
    const { blockhash } = await this.conn.getLatestBlockhash();
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

```

### `packages\chains\src\tokens.ts`

```ts
/**
 * Token registry.
 *
 * Safety note: a wallet that shows the wrong contract address for a token is
 * dangerous. So we ship a *curated, verified* set of the most important tokens
 * (native coins, major stablecoins, blue-chips) with hand-checked addresses, and
 * support loading the full "top ~200" from standard token-list feeds at runtime
 * (`loadTokenList`). The curated set is the offline fallback; the fetched list
 * extends coverage to hundreds of assets without baking unverified addresses in.
 */
import type { ChainFamily } from "./types.js";

export interface TokenInfo {
  /** Network id from the registry, e.g. "evm:1", "solana:mainnet". */
  networkId: string;
  family: ChainFamily;
  symbol: string;
  name: string;
  decimals: number;
  /** Contract/mint/jetton address. `null` for the chain's native coin. */
  address: string | null;
  /** CoinGecko id for price lookups, where known. */
  coingeckoId?: string;
  logoURI?: string;
  /** True for the chain's gas/native asset. */
  native?: boolean;
}

const t = (x: TokenInfo): TokenInfo => x;

/** Native gas coins for every supported network. */
const NATIVE: TokenInfo[] = [
  t({ networkId: "ton:mainnet", family: "ton", symbol: "TON", name: "Toncoin", decimals: 9, address: null, native: true, coingeckoId: "the-open-network" }),
  t({ networkId: "evm:1", family: "evm", symbol: "ETH", name: "Ether", decimals: 18, address: null, native: true, coingeckoId: "ethereum" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "ETH", name: "Ether", decimals: 18, address: null, native: true, coingeckoId: "ethereum" }),
  t({ networkId: "evm:10", family: "evm", symbol: "ETH", name: "Ether", decimals: 18, address: null, native: true, coingeckoId: "ethereum" }),
  t({ networkId: "evm:8453", family: "evm", symbol: "ETH", name: "Ether", decimals: 18, address: null, native: true, coingeckoId: "ethereum" }),
  t({ networkId: "evm:56", family: "evm", symbol: "BNB", name: "BNB", decimals: 18, address: null, native: true, coingeckoId: "binancecoin" }),
  t({ networkId: "evm:137", family: "evm", symbol: "POL", name: "Polygon", decimals: 18, address: null, native: true, coingeckoId: "matic-network" }),
  t({ networkId: "evm:43114", family: "evm", symbol: "AVAX", name: "Avalanche", decimals: 18, address: null, native: true, coingeckoId: "avalanche-2" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "SOL", name: "Solana", decimals: 9, address: null, native: true, coingeckoId: "solana" }),
  t({ networkId: "bitcoin:mainnet", family: "bitcoin", symbol: "BTC", name: "Bitcoin", decimals: 8, address: null, native: true, coingeckoId: "bitcoin" }),
];

/** Verified major tokens (addresses hand-checked). Extend via loadTokenList(). */
const CURATED: TokenInfo[] = [
  // Ethereum mainnet
  t({ networkId: "evm:1", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", coingeckoId: "tether" }),
  t({ networkId: "evm:1", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:1", family: "evm", symbol: "DAI", name: "Dai", decimals: 18, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", coingeckoId: "dai" }),
  t({ networkId: "evm:1", family: "evm", symbol: "WETH", name: "Wrapped Ether", decimals: 18, address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", coingeckoId: "weth" }),
  t({ networkId: "evm:1", family: "evm", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", coingeckoId: "wrapped-bitcoin" }),
  t({ networkId: "evm:1", family: "evm", symbol: "LINK", name: "Chainlink", decimals: 18, address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", coingeckoId: "chainlink" }),
  t({ networkId: "evm:1", family: "evm", symbol: "UNI", name: "Uniswap", decimals: 18, address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", coingeckoId: "uniswap" }),
  t({ networkId: "evm:1", family: "evm", symbol: "AAVE", name: "Aave", decimals: 18, address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", coingeckoId: "aave" }),
  t({ networkId: "evm:1", family: "evm", symbol: "SHIB", name: "Shiba Inu", decimals: 18, address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", coingeckoId: "shiba-inu" }),
  t({ networkId: "evm:1", family: "evm", symbol: "PEPE", name: "Pepe", decimals: 18, address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", coingeckoId: "pepe" }),
  t({ networkId: "evm:1", family: "evm", symbol: "MKR", name: "Maker", decimals: 18, address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", coingeckoId: "maker" }),
  t({ networkId: "evm:1", family: "evm", symbol: "LDO", name: "Lido DAO", decimals: 18, address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32", coingeckoId: "lido-dao" }),
  t({ networkId: "evm:1", family: "evm", symbol: "CRV", name: "Curve DAO", decimals: 18, address: "0xD533a949740bb3306d119CC777fa900bA034cd52", coingeckoId: "curve-dao-token" }),

  // BNB Smart Chain
  t({ networkId: "evm:56", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 18, address: "0x55d398326f99059fF775485246999027B3197955", coingeckoId: "tether" }),
  t({ networkId: "evm:56", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 18, address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:56", family: "evm", symbol: "BUSD", name: "Binance USD", decimals: 18, address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", coingeckoId: "binance-usd" }),
  t({ networkId: "evm:56", family: "evm", symbol: "CAKE", name: "PancakeSwap", decimals: 18, address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", coingeckoId: "pancakeswap-token" }),
  t({ networkId: "evm:56", family: "evm", symbol: "WBNB", name: "Wrapped BNB", decimals: 18, address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", coingeckoId: "wbnb" }),

  // Polygon
  t({ networkId: "evm:137", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", coingeckoId: "tether" }),
  t({ networkId: "evm:137", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:137", family: "evm", symbol: "DAI", name: "Dai", decimals: 18, address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", coingeckoId: "dai" }),
  t({ networkId: "evm:137", family: "evm", symbol: "WMATIC", name: "Wrapped POL", decimals: 18, address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", coingeckoId: "wmatic" }),

  // Arbitrum One
  t({ networkId: "evm:42161", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", coingeckoId: "tether" }),
  t({ networkId: "evm:42161", family: "evm", symbol: "ARB", name: "Arbitrum", decimals: 18, address: "0x912CE59144191C1204E64559FE8253a0e49E6548", coingeckoId: "arbitrum" }),

  // Optimism
  t({ networkId: "evm:10", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:10", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", coingeckoId: "tether" }),
  t({ networkId: "evm:10", family: "evm", symbol: "OP", name: "Optimism", decimals: 18, address: "0x4200000000000000000000000000000000000042", coingeckoId: "optimism" }),

  // Base
  t({ networkId: "evm:8453", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:8453", family: "evm", symbol: "DAI", name: "Dai", decimals: 18, address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", coingeckoId: "dai" }),

  // Avalanche C-Chain
  t({ networkId: "evm:43114", family: "evm", symbol: "USDC", name: "USD Coin", decimals: 6, address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", coingeckoId: "usd-coin" }),
  t({ networkId: "evm:43114", family: "evm", symbol: "USDT", name: "Tether USD", decimals: 6, address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", coingeckoId: "tether" }),

  // Solana (SPL mints)
  t({ networkId: "solana:mainnet", family: "solana", symbol: "USDC", name: "USD Coin", decimals: 6, address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", coingeckoId: "usd-coin" }),
  t({ networkId: "solana:mainnet", family: "solana", symbol: "USDT", name: "Tether USD", decimals: 6, address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", coingeckoId: "tether" }),

  // TON (jetton masters)
  t({ networkId: "ton:mainnet", family: "ton", symbol: "USDT", name: "Tether USD", decimals: 6, address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs", coingeckoId: "tether" }),
];

export const ALL_TOKENS: TokenInfo[] = [...NATIVE, ...CURATED];

export const tokensForNetwork = (networkId: string): TokenInfo[] =>
  ALL_TOKENS.filter((tok) => tok.networkId === networkId);

export function searchTokens(query: string, networkId?: string): TokenInfo[] {
  const q = query.trim().toLowerCase();
  return ALL_TOKENS.filter((tok) => {
    if (networkId && tok.networkId !== networkId) return false;
    if (!q) return true;
    return (
      tok.symbol.toLowerCase().includes(q) ||
      tok.name.toLowerCase().includes(q) ||
      (tok.address?.toLowerCase().includes(q) ?? false)
    );
  });
}

/**
 * Token-list schema (Uniswap/CoinGecko-compatible) for runtime extension to the
 * full top-200+. Maps a fetched list onto our TokenInfo for one network.
 */
interface RawTokenListEntry {
  chainId?: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export async function loadTokenList(
  url: string,
  networkId: string,
  family: ChainFamily,
): Promise<TokenInfo[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Token list fetch failed (${res.status}).`);
  const data = (await res.json()) as { tokens?: RawTokenListEntry[] };
  return (data.tokens ?? []).map((e) => ({
    networkId,
    family,
    symbol: e.symbol,
    name: e.name,
    decimals: e.decimals,
    address: e.address,
    logoURI: e.logoURI,
  }));
}

```

### `packages\chains\src\ton\account.ts`

```ts
/**
 * TON account derivation. Uses the shared BIP39 seed → SLIP-0010 ed25519
 * (path m/44'/607'/0') → @ton/crypto keypair → Wallet v4 contract address.
 *
 * This is the deliberate "TON ed25519 lives in chains, not wallet-core" boundary
 * from the architecture doc: ed25519 derivation is curve-specific and we keep it
 * out of the secp256k1-only core.
 */
import { keyPairFromSeed } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { deriveEd25519 } from "../slip10.js";
import type { DerivedAccount } from "../types.js";

/** TON's registered coin type is 607. One account per index via the last segment. */
export function tonPath(accountIndex: number): string {
  if (!Number.isInteger(accountIndex) || accountIndex < 0) {
    throw new Error("accountIndex must be a non-negative integer.");
  }
  return `m/44'/607'/${accountIndex}'`;
}

export interface TonAccount extends DerivedAccount {
  /** 32-byte ed25519 public key. */
  publicKey: Uint8Array;
  /** Whether the address was rendered for testnet. */
  isTestnet: boolean;
}

/**
 * Derive the i-th TON account from a BIP39 seed. `isTestnet` only affects the
 * human-readable address rendering (the keypair is identical across networks).
 */
export function deriveTon(
  seed: Uint8Array,
  accountIndex: number,
  isTestnet = false,
): TonAccount {
  const path = tonPath(accountIndex);
  const node = deriveEd25519(seed, path);
  const keypair = keyPairFromSeed(Buffer.from(node.key));
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keypair.publicKey,
  });
  const address = wallet.address.toString({
    urlSafe: true,
    bounceable: false,
    testOnly: isTestnet,
  });
  return {
    family: "ton",
    path,
    address,
    publicKey: new Uint8Array(keypair.publicKey),
    // @ton secretKey is 64 bytes (seed||pub); keep the 32-byte ed25519 seed as the private key.
    privateKey: node.key,
    isTestnet,
  };
}

```

### `packages\chains\src\ton\provider.ts`

```ts
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

```

### `packages\chains\src\ton\transfer.ts`

```ts
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

```

### `packages\chains\src\types.ts`

```ts
/**
 * Cross-chain type surface. Families differ enough (account model vs. UTXO-ish
 * message model) that we keep family-specific adapters rather than a leaky
 * lowest-common-denominator interface, but share these primitives.
 */
export type ChainFamily = "evm" | "ton" | "solana" | "bitcoin";

export interface NetworkConfig {
  /** Stable internal id, e.g. "evm:8453" or "ton:mainnet". */
  id: string;
  family: ChainFamily;
  name: string;
  /** Native gas token. */
  nativeSymbol: string;
  nativeDecimals: number;
  rpcUrl?: string;
  explorerUrl?: string;
  isTestnet: boolean;
  /** EVM only. */
  chainId?: number;
}

/** A derived account: address + the keys needed to sign locally. */
export interface DerivedAccount {
  family: ChainFamily;
  /** BIP32/SLIP-0010 path used. */
  path: string;
  /** Friendly, display/transfer address for the family. */
  address: string;
  /** Raw public key bytes. */
  publicKey: Uint8Array;
  /** Raw private key / seed bytes. Caller must zeroize after use. */
  privateKey: Uint8Array;
}

export interface NativeBalance {
  /** Smallest unit (wei / nanoton) as a string to avoid precision loss. */
  raw: string;
  decimals: number;
  symbol: string;
}

```

### `packages\chains\src\units.ts`

```ts
/**
 * Decimal <-> smallest-unit conversion using BigInt string math (no floats),
 * so amounts never lose precision. Used for SOL (9), BTC (8), and any token.
 */

/** Parse a human decimal string (e.g. "1.5") into the smallest unit. */
export function parseUnits(amount: string, decimals: number): bigint {
  if (!/^\d+(\.\d+)?$/.test(amount.trim())) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  const [whole, frac = ""] = amount.trim().split(".");
  if (frac.length > decimals) {
    throw new Error(`Amount has more than ${decimals} decimal places.`);
  }
  const padded = frac.padEnd(decimals, "0");
  return BigInt(whole + padded);
}

/** Format a smallest-unit value back to a human decimal string. */
export function formatUnits(value: bigint, decimals: number): string {
  const neg = value < 0n;
  const v = neg ? -value : value;
  const s = v.toString().padStart(decimals + 1, "0");
  const whole = s.slice(0, s.length - decimals);
  const frac = s.slice(s.length - decimals).replace(/0+$/, "");
  return (neg ? "-" : "") + (frac ? `${whole}.${frac}` : whole);
}

```

### `packages\chains\src\validation.ts`

```ts
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

```

### `packages\chains\test\evm.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mnemonicToSeed } from "@nova/wallet-core";
import { deriveEvm, evmSigner, EvmProvider } from "../src/index.js";
import type { NetworkConfig } from "../src/types.js";

const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

const NET: NetworkConfig = {
  id: "evm:8453",
  family: "evm",
  name: "Base",
  nativeSymbol: "ETH",
  nativeDecimals: 18,
  chainId: 8453,
  rpcUrl: "http://localhost:8545", // not contacted in these offline tests
  isTestnet: false,
};

test("derives the canonical EVM address from the shared seed", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveEvm(seed, 0);
  assert.equal(acct.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
});

test("build → sign → recover yields the signing account (offline)", async () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveEvm(seed, 0);
  const signer = evmSigner(acct);
  const provider = new EvmProvider(NET);

  const tx = provider.buildNativeTransfer({
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    amountEth: "0.01",
    nonce: 0,
    chainId: 8453,
    maxFeePerGas: 2_000_000_000n,
    maxPriorityFeePerGas: 1_000_000_000n,
  });

  const signed = await EvmProvider.sign(signer, tx);
  const sender = await EvmProvider.senderOf(signed);
  assert.equal(sender.toLowerCase(), acct.address.toLowerCase());
});

```

### `packages\chains\test\multichain.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { base58 } from "@scure/base";
import { ed25519 } from "@noble/curves/ed25519";
import { mnemonicToSeed } from "@nova/wallet-core";
import {
  deriveSolana,
  solanaPath,
  deriveBitcoin,
  bitcoinPath,
} from "../src/index.js";

// Official BIP84 test vector mnemonic.
const BIP84_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

test("Bitcoin matches the official BIP84 vector (m/84'/0'/0'/0/0)", () => {
  const seed = mnemonicToSeed(BIP84_MNEMONIC);
  const acct = deriveBitcoin(seed, 0);
  assert.equal(acct.address, "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu");
  assert.equal(acct.path, bitcoinPath(0));
});

test("Bitcoin index 1 matches the BIP84 vector and differs from index 0", () => {
  const seed = mnemonicToSeed(BIP84_MNEMONIC);
  assert.equal(
    deriveBitcoin(seed, 1).address,
    "bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g",
  );
  assert.notEqual(deriveBitcoin(seed, 0).address, deriveBitcoin(seed, 1).address);
});

test("Bitcoin testnet renders a tb1 address", () => {
  const seed = mnemonicToSeed(BIP84_MNEMONIC);
  assert.ok(deriveBitcoin(seed, 0, true).address.startsWith("tb1"));
});

test("Solana address is base58 of the 32-byte ed25519 public key", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveSolana(seed, 0);
  assert.equal(acct.path, solanaPath(0));
  // Internal consistency: address decodes to exactly the derived public key.
  const decoded = base58.decode(acct.address);
  assert.equal(decoded.length, 32);
  assert.deepEqual(decoded, ed25519.getPublicKey(acct.privateKey));
  assert.deepEqual(decoded, acct.publicKey);
});

test("Solana derivation is deterministic and index-distinct", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  assert.equal(deriveSolana(seed, 0).address, deriveSolana(seed, 0).address);
  assert.notEqual(deriveSolana(seed, 0).address, deriveSolana(seed, 1).address);
});

```

### `packages\chains\test\providers.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mnemonicToSeed } from "@nova/wallet-core";
import {
  deriveSolana,
  solanaKeypair,
  deriveBitcoin,
  BitcoinProvider,
  parseUnits,
  formatUnits,
  NETWORKS,
} from "../src/index.js";

const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

test("units round-trip without float error", () => {
  assert.equal(parseUnits("1.5", 9), 1_500_000_000n);
  assert.equal(parseUnits("0.00000001", 8), 1n);
  assert.equal(formatUnits(1_500_000_000n, 9), "1.5");
  assert.equal(formatUnits(1n, 8), "0.00000001");
  assert.throws(() => parseUnits("1.234", 2), /decimal places/);
});

test("Solana keypair from derived account matches its address", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveSolana(seed, 0);
  // web3.js independently derives the same public key from our 32-byte seed.
  assert.equal(solanaKeypair(acct).publicKey.toBase58(), acct.address);
});

test("Bitcoin transfer builds, signs, and finalizes offline", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const account = deriveBitcoin(seed, 0);
  const provider = new BitcoinProvider({
    ...NETWORKS["bitcoin:mainnet"]!,
    rpcUrl: "https://mempool.space/api", // not contacted in this offline build
  });

  const result = provider.buildSignedTransfer({
    account,
    to: "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
    amountSats: 50_000n,
    feeRateSatVb: 10,
    utxos: [
      { txid: "a".repeat(64), vout: 0, value: 100_000 },
    ],
  });

  assert.ok(result.hex.length > 0, "produced signed tx hex");
  assert.match(result.txid, /^[0-9a-f]{64}$/);
  assert.ok(result.fee > 0n, "non-zero fee");
  // 100k in, 50k out, fee small → change should be present and balance.
  assert.equal(50_000n + result.fee + result.change, 100_000n);
});

test("Bitcoin transfer rejects insufficient funds", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const account = deriveBitcoin(seed, 0);
  const provider = new BitcoinProvider({
    ...NETWORKS["bitcoin:mainnet"]!,
    rpcUrl: "https://mempool.space/api",
  });
  assert.throws(
    () =>
      provider.buildSignedTransfer({
        account,
        to: "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
        amountSats: 200_000n,
        feeRateSatVb: 10,
        utxos: [{ txid: "a".repeat(64), vout: 0, value: 100_000 }],
      }),
    /Insufficient funds/,
  );
});

```

### `packages\chains\test\slip10.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { ed25519 } from "@noble/curves/ed25519";
import { deriveEd25519, parseHardenedPath } from "../src/slip10.js";

// Official SLIP-0010 ed25519 Test Vector 1.
const SEED = hexToBytes("000102030405060708090a0b0c0d0e0f");

test("master node matches SLIP-0010 ed25519 vector", () => {
  const m = deriveEd25519(SEED, "m");
  assert.equal(
    bytesToHex(m.key),
    "2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7",
  );
  assert.equal(
    bytesToHex(m.chainCode),
    "90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb",
  );
  // Public key (SLIP-0010 prefixes ed25519 pubkeys with 0x00).
  assert.equal(
    bytesToHex(ed25519.getPublicKey(m.key)),
    "a4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed",
  );
});

test("m/0' matches SLIP-0010 ed25519 vector", () => {
  const node = deriveEd25519(SEED, "m/0'");
  assert.equal(
    bytesToHex(node.key),
    "68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3",
  );
  assert.equal(
    bytesToHex(node.chainCode),
    "8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69",
  );
});

test("non-hardened segments are rejected for ed25519", () => {
  assert.throws(() => parseHardenedPath("m/44'/607'/0"), /hardened/);
});

```

### `packages\chains\test\tokens.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_TOKENS,
  tokensForNetwork,
  searchTokens,
  NETWORKS,
} from "../src/index.js";

test("every token references a known network", () => {
  for (const tok of ALL_TOKENS) {
    assert.ok(NETWORKS[tok.networkId], `unknown network ${tok.networkId} for ${tok.symbol}`);
  }
});

test("every network has a native token, and only one", () => {
  for (const id of Object.keys(NETWORKS)) {
    if (NETWORKS[id]!.isTestnet) continue;
    const natives = tokensForNetwork(id).filter((tk) => tk.native);
    assert.equal(natives.length, 1, `network ${id} should have exactly one native token`);
    assert.equal(natives[0]!.address, null);
  }
});

test("EVM token addresses are well-formed; non-native tokens have an address", () => {
  for (const tok of ALL_TOKENS) {
    if (tok.native) continue;
    assert.ok(tok.address, `${tok.symbol} on ${tok.networkId} missing address`);
    if (tok.family === "evm") {
      assert.match(tok.address!, /^0x[0-9a-fA-F]{40}$/, `${tok.symbol} bad EVM address`);
    }
    assert.ok(tok.decimals >= 0 && tok.decimals <= 18, `${tok.symbol} bad decimals`);
  }
});

test("no duplicate (networkId, address) entries", () => {
  const seen = new Set<string>();
  for (const tok of ALL_TOKENS) {
    const key = `${tok.networkId}|${tok.address ?? "native"}`;
    assert.ok(!seen.has(key), `duplicate token ${key}`);
    seen.add(key);
  }
});

test("search matches by symbol and name, scoped by network", () => {
  assert.ok(searchTokens("usdt").length >= 3); // present on several chains
  assert.ok(searchTokens("tether", "evm:1").every((tk) => tk.networkId === "evm:1"));
  assert.equal(searchTokens("definitely-not-a-token").length, 0);
});

```

### `packages\chains\test\ton.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { Address } from "@ton/core";
import { mnemonicToSeed } from "@nova/wallet-core";
import { deriveTon, buildSignedTransferBoc, tonPath } from "../src/index.js";

const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

test("derives a deterministic, valid TON address", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const a = deriveTon(seed, 0);
  const b = deriveTon(seed, 0);
  assert.equal(a.address, b.address);
  assert.equal(a.path, tonPath(0));
  assert.equal(a.publicKey.length, 32);
  // Round-trips through the TON address parser.
  assert.doesNotThrow(() => Address.parse(a.address));
});

test("different indices give different addresses", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  assert.notEqual(deriveTon(seed, 0).address, deriveTon(seed, 1).address);
});

test("builds a deterministic signed transfer BOC", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveTon(seed, 0);
  const boc1 = buildSignedTransferBoc(acct, {
    to: deriveTon(seed, 1).address,
    amountTon: "0.5",
    seqno: 0,
    comment: "gm",
  });
  const boc2 = buildSignedTransferBoc(acct, {
    to: deriveTon(seed, 1).address,
    amountTon: "0.5",
    seqno: 0,
    comment: "gm",
  });
  assert.equal(typeof boc1, "string");
  assert.ok(boc1.length > 0);
  // ed25519 signatures over identical content are deterministic.
  assert.equal(boc1, boc2);
});

```

### `packages\chains\test\validation.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mnemonicToSeed } from "@nova/wallet-core";
import {
  isValidAddress,
  assessTransferRisk,
  deriveEvm,
  deriveTon,
  deriveSolana,
  deriveBitcoin,
} from "../src/index.js";

const seed = mnemonicToSeed("test test test test test test test test test test test junk");
const evm = deriveEvm(seed, 0).address;
const ton = deriveTon(seed, 0).address;
const sol = deriveSolana(seed, 0).address;
const btc = deriveBitcoin(seed, 0).address;

test("validates real derived addresses per family", () => {
  assert.ok(isValidAddress("evm", evm));
  assert.ok(isValidAddress("ton", ton));
  assert.ok(isValidAddress("solana", sol));
  assert.ok(isValidAddress("bitcoin", btc));
});

test("rejects malformed and cross-family addresses", () => {
  assert.equal(isValidAddress("evm", "0x1234"), false);
  assert.equal(isValidAddress("evm", ""), false);
  assert.equal(isValidAddress("solana", evm), false); // EVM hex isn't 32-byte base58
  assert.equal(isValidAddress("bitcoin", evm), false);
});

test("invalid address is a red, blocking finding", () => {
  const r = assessTransferRisk({ family: "evm", from: evm, to: "0xnotvalid" });
  assert.equal(r.level, "red");
  assert.equal(r.canProceed, false);
  assert.equal(r.findings[0]!.code, "invalid_address");
});

test("first-time recipient is a yellow, non-blocking warning", () => {
  const r = assessTransferRisk({
    family: "evm",
    from: evm,
    to: deriveEvm(seed, 1).address,
    knownRecipients: [deriveEvm(seed, 2).address],
  });
  assert.equal(r.level, "yellow");
  assert.equal(r.canProceed, true);
  assert.ok(r.findings.some((f) => f.code === "first_time_recipient"));
});

test("self-send and contract recipient are flagged", () => {
  const r = assessTransferRisk({ family: "evm", from: evm, to: evm, recipientIsContract: true });
  assert.ok(r.findings.some((f) => f.code === "self_send"));
  assert.ok(r.findings.some((f) => f.code === "contract_recipient"));
});

test("network mismatch (wrong-family address) is red and blocking", () => {
  const r = assessTransferRisk({ family: "evm", from: evm, to: evm, detectedFamily: "solana" });
  assert.equal(r.level, "red");
  assert.ok(r.findings.some((f) => f.code === "network_mismatch"));
});

test("address-poisoning look-alike is detected", () => {
  // Build a fake that shares prefix+suffix with a known recipient.
  const known = "0xabcdef0000000000000000000000000000abcdef";
  const poison = "0xabcdef1111111111111111111111111111abcdef";
  const r = assessTransferRisk({ family: "evm", from: evm, to: poison, knownRecipients: [known] });
  assert.ok(r.findings.some((f) => f.code === "address_poisoning"));
  assert.equal(r.level, "red");
});

test("clean known recipient is green and proceeds", () => {
  const to = deriveEvm(seed, 3).address;
  const r = assessTransferRisk({ family: "evm", from: evm, to, knownRecipients: [to] });
  assert.equal(r.level, "green");
  assert.equal(r.canProceed, true);
  assert.equal(r.findings.length, 0);
});

```

### `packages\chains\tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}

```

### `packages\telegram-auth\package.json`

```json
{
  "name": "@nova/telegram-auth",
  "version": "0.1.0",
  "private": true,
  "description": "Server-side verification of Telegram Mini App initData (HMAC-SHA256). No key material.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "node --import tsx --test \"test/**/*.test.ts\""
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}

```

### `packages\telegram-auth\src\index.ts`

```ts
/**
 * Telegram Mini App `initData` verification (server-side ONLY).
 *
 * Telegram signs the launch parameters with a key derived from the bot token.
 * We recompute the HMAC and compare in constant time. Client-provided user data
 * is NEVER trusted until this passes.
 *
 * Algorithm (Telegram official):
 *   secret_key       = HMAC_SHA256(key="WebAppData", message=bot_token)
 *   data_check_string= "key=value\n..." for all fields except `hash`, sorted by key
 *   expected_hash    = HMAC_SHA256(key=secret_key, message=data_check_string)
 *   valid            = constantTimeEqual(expected_hash, provided hash)
 *
 * We additionally enforce an `auth_date` freshness window to limit replay.
 *
 * NOTE: bot tokens used for verification are stored only on the server (env /
 * secrets manager) and are never sent to the client.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface VerifiedInitData {
  user?: TelegramUser;
  authDate: Date;
  queryId?: string;
  startParam?: string;
  /** Raw parsed fields, for any value not surfaced above. */
  raw: Record<string, string>;
}

export interface VerifyOptions {
  /** Bot token (server secret). */
  botToken: string;
  /** Max allowed age of initData in seconds. Default 24h. */
  maxAgeSeconds?: number;
  /** Override "now" for testing. */
  now?: () => number;
}

export class InitDataError extends Error {
  constructor(
    message: string,
    readonly code:
      | "missing_hash"
      | "bad_signature"
      | "expired"
      | "malformed"
      | "config",
  ) {
    super(message);
    this.name = "InitDataError";
  }
}

function constantTimeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length || ab.length === 0) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Verify a raw `initData` query string. Returns parsed, trusted data or throws
 * an `InitDataError`. Pass the exact string Telegram provided
 * (e.g. `window.Telegram.WebApp.initData`).
 */
export function verifyInitData(
  initData: string,
  opts: VerifyOptions,
): VerifiedInitData {
  if (!opts.botToken) {
    throw new InitDataError("Bot token not configured.", "config");
  }

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(initData);
  } catch {
    throw new InitDataError("initData is not a valid query string.", "malformed");
  }

  const hash = params.get("hash");
  if (!hash) throw new InitDataError("Missing hash.", "missing_hash");

  // Build the data-check-string: all fields except `hash`, sorted by key.
  const pairs: string[] = [];
  const raw: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key === "hash") continue;
    raw[key] = value;
    pairs.push(`${key}=${value}`);
  }
  pairs.sort();
  const dataCheckString = pairs.join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(opts.botToken)
    .digest();
  const expectedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (!constantTimeEqualHex(expectedHash, hash)) {
    throw new InitDataError("Signature verification failed.", "bad_signature");
  }

  // Freshness check.
  const authDateSec = Number(raw.auth_date);
  if (!Number.isFinite(authDateSec)) {
    throw new InitDataError("Missing or invalid auth_date.", "malformed");
  }
  const nowSec = Math.floor((opts.now?.() ?? Date.now()) / 1000);
  const maxAge = opts.maxAgeSeconds ?? 86400;
  if (nowSec - authDateSec > maxAge) {
    throw new InitDataError("initData has expired.", "expired");
  }

  let user: TelegramUser | undefined;
  if (raw.user) {
    try {
      user = JSON.parse(raw.user) as TelegramUser;
    } catch {
      throw new InitDataError("user field is not valid JSON.", "malformed");
    }
  }

  return {
    user,
    authDate: new Date(authDateSec * 1000),
    queryId: raw.query_id,
    startParam: raw.start_param,
    raw,
  };
}

```

### `packages\telegram-auth\test\initData.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyInitData, InitDataError } from "../src/index.js";

const BOT_TOKEN = "123456:TEST_BOT_TOKEN_do_not_use";

/** Produce a valid signed initData string the way Telegram would. */
function signInitData(fields: Record<string, string>): string {
  const pairs = Object.entries(fields)
    .map(([k, v]) => `${k}=${v}`)
    .sort();
  const dataCheckString = pairs.join("\n");
  const secret = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const hash = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  const params = new URLSearchParams({ ...fields, hash });
  return params.toString();
}

const NOW = 1_700_000_000_000; // fixed clock (ms)
const freshAuthDate = String(Math.floor(NOW / 1000) - 10);

test("accepts a correctly signed, fresh initData", () => {
  const initData = signInitData({
    auth_date: freshAuthDate,
    query_id: "AAEx",
    user: JSON.stringify({ id: 42, username: "satoshi", language_code: "en" }),
  });
  const result = verifyInitData(initData, { botToken: BOT_TOKEN, now: () => NOW });
  assert.equal(result.user?.id, 42);
  assert.equal(result.user?.username, "satoshi");
  assert.equal(result.queryId, "AAEx");
});

test("rejects a forged hash", () => {
  const initData = signInitData({ auth_date: freshAuthDate, user: '{"id":1}' });
  const tampered = initData.replace(/hash=[0-9a-f]+/, "hash=" + "0".repeat(64));
  assert.throws(
    () => verifyInitData(tampered, { botToken: BOT_TOKEN, now: () => NOW }),
    (e: unknown) => e instanceof InitDataError && e.code === "bad_signature",
  );
});

test("rejects a tampered field (signature no longer matches)", () => {
  const initData = signInitData({
    auth_date: freshAuthDate,
    user: JSON.stringify({ id: 42 }),
  });
  // Swap the user id without re-signing.
  const tampered = initData.replace("%22id%22%3A42", "%22id%22%3A999");
  assert.throws(
    () => verifyInitData(tampered, { botToken: BOT_TOKEN, now: () => NOW }),
    (e: unknown) => e instanceof InitDataError && e.code === "bad_signature",
  );
});

test("rejects expired initData", () => {
  const old = String(Math.floor(NOW / 1000) - 100_000);
  const initData = signInitData({ auth_date: old, user: '{"id":1}' });
  assert.throws(
    () =>
      verifyInitData(initData, {
        botToken: BOT_TOKEN,
        maxAgeSeconds: 3600,
        now: () => NOW,
      }),
    (e: unknown) => e instanceof InitDataError && e.code === "expired",
  );
});

test("rejects missing hash", () => {
  assert.throws(
    () => verifyInitData("auth_date=1&user=%7B%7D", { botToken: BOT_TOKEN, now: () => NOW }),
    (e: unknown) => e instanceof InitDataError && e.code === "missing_hash",
  );
});

test("rejects when bot token is not configured", () => {
  assert.throws(
    () => verifyInitData("hash=x", { botToken: "" }),
    (e: unknown) => e instanceof InitDataError && e.code === "config",
  );
});

```

### `packages\telegram-auth\tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "lib": ["ES2022"]
  },
  "include": ["src/**/*"]
}

```

### `packages\wallet-core\package.json`

```json
{
  "name": "@nova/wallet-core",
  "version": "0.1.0",
  "private": true,
  "description": "Isomorphic crypto core: encrypted vault, BIP39/32 derivation, accounts. The only place keys live.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "node --import tsx --test \"test/**/*.test.ts\""
  },
  "dependencies": {
    "@noble/ciphers": "^1.2.1",
    "@noble/curves": "^1.8.1",
    "@noble/hashes": "^1.7.1",
    "@scure/bip32": "^1.6.2",
    "@scure/bip39": "^1.5.4"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}

```

### `packages\wallet-core\src\accounts.ts`

```ts
/**
 * Hierarchical-deterministic account derivation from a single BIP39 seed.
 *
 * One recovery phrase drives every chain:
 *   - EVM (and BTC) use secp256k1 via BIP32 (BIP44 path m/44'/60'/0'/0/i).
 *   - TON uses ed25519; its derivation lives in the chains package (SLIP-0010 /
 *     @ton/crypto) to avoid baking a subtly-wrong ed25519 path into the core.
 *
 * This module never persists or transmits keys. Returned private keys are
 * caller-owned and should be zeroized after signing.
 */
import { HDKey } from "@scure/bip32";
import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";

export type ChainFamily = "evm" | "ton" | "solana" | "btc";

/** Standard BIP44 derivation path for EVM accounts. */
export function evmPath(accountIndex: number): string {
  if (!Number.isInteger(accountIndex) || accountIndex < 0) {
    throw new Error("accountIndex must be a non-negative integer.");
  }
  return `m/44'/60'/0'/0/${accountIndex}`;
}

export interface Secp256k1Key {
  path: string;
  privateKey: Uint8Array; // 32 bytes
  publicKey: Uint8Array; // 33 bytes (compressed)
}

/** Derive a secp256k1 key at an arbitrary BIP32 path from a 64-byte seed. */
export function deriveSecp256k1(seed: Uint8Array, path: string): Secp256k1Key {
  const root = HDKey.fromMasterSeed(seed);
  const node = root.derive(path);
  if (!node.privateKey || !node.publicKey) {
    throw new Error(`Failed to derive key at path ${path}.`);
  }
  return { path, privateKey: node.privateKey, publicKey: node.publicKey };
}

/** Compute the checksummed-lowercase EVM address for a private key. */
export function evmAddressFromPrivateKey(privateKey: Uint8Array): string {
  const uncompressed = secp256k1.getPublicKey(privateKey, false); // 65 bytes, 0x04 prefix
  const hash = keccak_256(uncompressed.slice(1)); // drop 0x04
  const addr = hash.slice(-20);
  return "0x" + toEip55(addr);
}

/** EIP-55 checksum encoding of a 20-byte address. */
function toEip55(addressBytes: Uint8Array): string {
  let hex = "";
  for (const b of addressBytes) hex += b.toString(16).padStart(2, "0");
  const hashHex = bytesToHex(keccak_256(new TextEncoder().encode(hex)));
  let out = "";
  for (let i = 0; i < hex.length; i++) {
    const c = hex[i]!;
    out += parseInt(hashHex[i]!, 16) >= 8 ? c.toUpperCase() : c;
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

/** Convenience: derive the i-th EVM account (path, keys, address) from a seed. */
export function deriveEvmAccount(seed: Uint8Array, accountIndex: number) {
  const key = deriveSecp256k1(seed, evmPath(accountIndex));
  return { ...key, family: "evm" as const, address: evmAddressFromPrivateKey(key.privateKey) };
}

```

### `packages\wallet-core\src\bytes.ts`

```ts
/**
 * Small isomorphic byte/encoding helpers. No secrets are logged here; callers
 * are responsible for zeroizing sensitive Uint8Arrays after use.
 */

const hasBuffer = typeof globalThis.Buffer !== "undefined";

/** Encode bytes to standard base64 (browser + Node). */
export function bytesToBase64(bytes: Uint8Array): string {
  if (hasBuffer) return globalThis.Buffer.from(bytes).toString("base64");
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

/** Decode standard base64 to bytes (browser + Node). */
export function base64ToBytes(b64: string): Uint8Array {
  if (hasBuffer) return new Uint8Array(globalThis.Buffer.from(b64, "base64"));
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const utf8ToBytes = (s: string): Uint8Array => encoder.encode(s);
export const bytesToUtf8 = (b: Uint8Array): string => decoder.decode(b);

/**
 * Best-effort in-place wipe of sensitive data. JS cannot guarantee memory is
 * cleared (GC, string immutability), but zeroizing the buffers we control
 * meaningfully shrinks the window a secret is recoverable.
 */
export function zeroize(...buffers: (Uint8Array | undefined | null)[]): void {
  for (const b of buffers) {
    if (b) b.fill(0);
  }
}

```

### `packages\wallet-core\src\index.ts`

```ts
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

```

### `packages\wallet-core\src\mnemonic.ts`

```ts
/**
 * BIP39 mnemonic generation / validation / seed derivation.
 * Uses the audited @scure/bip39 implementation with the English wordlist.
 */
import {
  generateMnemonic,
  mnemonicToSeedSync,
  validateMnemonic,
} from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

/** 128 bits → 12 words; 256 bits → 24 words. We default to 24 for higher entropy. */
export type MnemonicStrength = 128 | 160 | 192 | 224 | 256;

/** Generate a fresh BIP39 mnemonic using the platform CSPRNG (via @scure). */
export function createMnemonic(strength: MnemonicStrength = 256): string {
  return generateMnemonic(wordlist, strength);
}

/** Validate a user-supplied recovery phrase (checksum + wordlist membership). */
export function isValidMnemonic(mnemonic: string): boolean {
  return validateMnemonic(normalizeMnemonic(mnemonic), wordlist);
}

/** Trim/normalize whitespace and case for import flows. */
export function normalizeMnemonic(mnemonic: string): string {
  return mnemonic.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Derive the 64-byte BIP39 seed. Optional `passphrase` is the BIP39 "25th word".
 * Caller should zeroize the returned seed after deriving keys from it.
 */
export function mnemonicToSeed(mnemonic: string, passphrase = ""): Uint8Array {
  const normalized = normalizeMnemonic(mnemonic);
  if (!validateMnemonic(normalized, wordlist)) {
    throw new Error("Invalid recovery phrase.");
  }
  return mnemonicToSeedSync(normalized, passphrase);
}

```

### `packages\wallet-core\src\random.ts`

```ts
/**
 * Cryptographically secure randomness. Uses the platform CSPRNG
 * (WebCrypto getRandomValues) which is available in modern browsers and Node 20+.
 */

function getCrypto(): Crypto {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c || typeof c.getRandomValues !== "function") {
    throw new Error("Secure RNG unavailable: WebCrypto getRandomValues is required.");
  }
  return c;
}

/** Return `length` cryptographically random bytes. */
export function randomBytes(length: number): Uint8Array {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("randomBytes: length must be a positive integer.");
  }
  const out = new Uint8Array(length);
  getCrypto().getRandomValues(out);
  return out;
}

```

### `packages\wallet-core\src\vault.ts`

```ts
/**
 * Encrypted vault.
 *
 * Seals arbitrary plaintext (a serialized wallet: mnemonic/keys/metadata) under a
 * key derived from the user's PIN/passphrase. At rest it is an authenticated
 * ciphertext; tampering or a wrong PIN fails closed (decryption throws).
 *
 *   PIN ──KDF(Argon2id|scrypt)──► 32-byte key ──AES-256-GCM──► sealed envelope
 *
 * This module performs NO network or storage I/O. The caller decides where the
 * (already-encrypted) envelope is persisted, and must `zeroize` plaintext after use.
 */
import { argon2id } from "@noble/hashes/argon2";
import { scrypt } from "@noble/hashes/scrypt";
import { gcm } from "@noble/ciphers/aes";
import { randomBytes } from "./random.js";
import { base64ToBytes, bytesToBase64, utf8ToBytes, zeroize } from "./bytes.js";

const SALT_LEN = 16;
const NONCE_LEN = 12; // GCM standard
const KEY_LEN = 32; // AES-256
const ENVELOPE_VERSION = 1;

export type Argon2idParams = {
  kind: "argon2id";
  /** iterations (time cost) */
  t: number;
  /** memory cost in KiB */
  m: number;
  /** parallelism */
  p: number;
};

export type ScryptParams = {
  kind: "scrypt";
  N: number;
  r: number;
  p: number;
};

export type KdfParams = Argon2idParams | ScryptParams;

/** Conservative interactive defaults: ~64 MiB Argon2id. Tune per device class. */
export const DEFAULT_KDF: Argon2idParams = { kind: "argon2id", t: 3, m: 64 * 1024, p: 1 };

/** Versioned, self-describing envelope. Safe to persist; contains no plaintext. */
export interface VaultEnvelope {
  v: number;
  kdf: KdfParams;
  salt: string; // base64
  nonce: string; // base64
  ct: string; // base64 ciphertext (includes GCM auth tag)
}

function deriveKey(pin: string, salt: Uint8Array, kdf: KdfParams): Uint8Array {
  const pwd = utf8ToBytes(pin);
  try {
    if (kdf.kind === "argon2id") {
      return argon2id(pwd, salt, { t: kdf.t, m: kdf.m, p: kdf.p, dkLen: KEY_LEN });
    }
    return scrypt(pwd, salt, { N: kdf.N, r: kdf.r, p: kdf.p, dkLen: KEY_LEN });
  } finally {
    zeroize(pwd);
  }
}

/**
 * Encrypt `plaintext` (UTF-8 string) under `pin`. Returns a persistable envelope.
 * Each call uses a fresh random salt + nonce.
 */
export function sealVault(
  plaintext: string,
  pin: string,
  kdf: KdfParams = DEFAULT_KDF,
): VaultEnvelope {
  if (!pin || pin.length < 4) {
    throw new Error("sealVault: PIN/passphrase too short.");
  }
  const salt = randomBytes(SALT_LEN);
  const nonce = randomBytes(NONCE_LEN);
  const key = deriveKey(pin, salt, kdf);
  const data = utf8ToBytes(plaintext);
  try {
    const ct = gcm(key, nonce).encrypt(data);
    return {
      v: ENVELOPE_VERSION,
      kdf,
      salt: bytesToBase64(salt),
      nonce: bytesToBase64(nonce),
      ct: bytesToBase64(ct),
    };
  } finally {
    zeroize(key, data);
  }
}

/**
 * Decrypt an envelope with `pin`. Throws on wrong PIN or tampered ciphertext
 * (GCM authentication failure) — callers should treat any throw as "unlock failed".
 * Returns the plaintext UTF-8 string.
 */
export function openVault(envelope: VaultEnvelope, pin: string): string {
  if (envelope.v !== ENVELOPE_VERSION) {
    throw new Error(`openVault: unsupported envelope version ${envelope.v}.`);
  }
  const salt = base64ToBytes(envelope.salt);
  const nonce = base64ToBytes(envelope.nonce);
  const ct = base64ToBytes(envelope.ct);
  const key = deriveKey(pin, salt, envelope.kdf);
  try {
    const pt = gcm(key, nonce).decrypt(ct); // throws if auth tag invalid
    const text = new TextDecoder().decode(pt);
    zeroize(pt);
    return text;
  } catch {
    // Normalize to avoid leaking which step failed.
    throw new Error("Unlock failed: incorrect PIN or corrupted vault.");
  } finally {
    zeroize(key);
  }
}

/** Re-encrypt a vault under a new PIN/KDF (used for "change PIN"). */
export function rekeyVault(
  envelope: VaultEnvelope,
  oldPin: string,
  newPin: string,
  kdf: KdfParams = DEFAULT_KDF,
): VaultEnvelope {
  const plaintext = openVault(envelope, oldPin);
  try {
    return sealVault(plaintext, newPin, kdf);
  } finally {
    // plaintext is an immutable JS string; cannot wipe, but minimize its lifetime.
  }
}

```

### `packages\wallet-core\test\accounts.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createMnemonic,
  isValidMnemonic,
  mnemonicToSeed,
} from "../src/mnemonic.js";
import { deriveEvmAccount, evmPath } from "../src/accounts.js";

// Well-known test mnemonic (Hardhat/Anvil default). NOT a real wallet — for vectors only.
const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

test("generated mnemonic is valid and 24 words by default", () => {
  const m = createMnemonic();
  assert.equal(m.split(" ").length, 24);
  assert.ok(isValidMnemonic(m));
});

test("rejects an invalid mnemonic checksum", () => {
  assert.equal(isValidMnemonic("abandon abandon abandon"), false);
});

test("derives the canonical first EVM address from the test mnemonic", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveEvmAccount(seed, 0);
  // Known vector for m/44'/60'/0'/0/0 of the Hardhat test mnemonic.
  assert.equal(acct.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  assert.equal(acct.path, evmPath(0));
  assert.equal(acct.privateKey.length, 32);
});

test("consecutive account indices yield distinct addresses", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const a0 = deriveEvmAccount(seed, 0).address;
  const a1 = deriveEvmAccount(seed, 1).address;
  assert.notEqual(a0, a1);
});

```

### `packages\wallet-core\test\vault.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { sealVault, openVault, rekeyVault } from "../src/vault.js";

// Fast KDF params keep the test suite quick; production uses DEFAULT_KDF.
const FAST_KDF = { kind: "scrypt", N: 2 ** 12, r: 8, p: 1 } as const;

test("seal then open round-trips the plaintext", () => {
  const secret = JSON.stringify({ mnemonic: "alpha bravo charlie", v: 1 });
  const env = sealVault(secret, "123456", FAST_KDF);
  assert.equal(openVault(env, "123456"), secret);
});

test("each seal uses a fresh salt and nonce", () => {
  const a = sealVault("same", "123456", FAST_KDF);
  const b = sealVault("same", "123456", FAST_KDF);
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.nonce, b.nonce);
  assert.notEqual(a.ct, b.ct);
});

test("wrong PIN fails closed", () => {
  const env = sealVault("top secret", "correct-horse", FAST_KDF);
  assert.throws(() => openVault(env, "wrong-pin"), /Unlock failed/);
});

test("tampered ciphertext is rejected by GCM auth tag", () => {
  const env = sealVault("top secret", "123456", FAST_KDF);
  // Flip a character in the base64 ciphertext.
  const bad = { ...env, ct: env.ct.slice(0, -2) + (env.ct.endsWith("A") ? "B" : "A") + "=" };
  assert.throws(() => openVault(bad, "123456"));
});

test("rekey changes the PIN while preserving plaintext", () => {
  const secret = "rotate me";
  const env = sealVault(secret, "oldpin", FAST_KDF);
  const rekeyed = rekeyVault(env, "oldpin", "newpin", FAST_KDF);
  assert.equal(openVault(rekeyed, "newpin"), secret);
  assert.throws(() => openVault(rekeyed, "oldpin"), /Unlock failed/);
});

test("rejects too-short PIN on seal", () => {
  assert.throws(() => sealVault("x", "12", FAST_KDF), /too short/);
});

```

### `packages\wallet-core\tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}

```

### `README.md`

```md
# NovaWallet

A **non-custodial** crypto wallet delivered as a **Telegram Mini App**. TON-first, EVM-ready,
mobile-native UX. The server never sees seed phrases, private keys, or raw signing material —
all key material is generated, encrypted, and used client-side.

> `NovaWallet` is a placeholder brand name. The product is original and intentionally shares no
> branding, naming, iconography, color system, or copy with any existing wallet.

## Why this repo is structured the way it is

A self-custodial wallet's hardest, most dangerous code is the **key lifecycle**: generation,
encryption-at-rest, derivation, and signing. We build that first, in an isolated, audited-dependency
package (`@nova/wallet-core`) with tests, *before* any UI. The Telegram trust boundary
(`initData` verification in `@nova/telegram-auth`) is the second pillar. Everything else —
chains, swaps, bridges, NFTs, dApp connectivity — composes on top of those two foundations.

## Monorepo layout

```
wwwwallet/
├─ apps/
│  ├─ miniapp/          # Vite + React Telegram Mini App (client). Holds the only keys.
│  └─ api/              # Fastify backend. Profile + metadata only. NEVER key material.
├─ packages/
│  ├─ wallet-core/      # Crypto: vault (Argon2id + AES-256-GCM), BIP39/32, accounts. Isomorphic.
│  ├─ telegram-auth/    # Server-side Telegram initData HMAC validation.
│  ├─ chains/           # Chain abstraction: TON + EVM providers, signing, gas. (Phase 1+)
│  └─ ui/               # Shared design system primitives. (Phase 1+)
├─ docs/                # PRD, architecture, security model, data model, API spec, roadmap.
└─ package.json         # npm workspaces root
```

## Security non-negotiables (enforced by architecture, not convention)

- Seed phrases / private keys exist **only** in the client, **only** decrypted in memory while in use.
- At rest, the vault is encrypted with a key derived from the user PIN/passphrase via **Argon2id**,
  sealed with **AES-256-GCM** (authenticated). See [`docs/02-SECURITY.md`](docs/02-SECURITY.md).
- The backend stores **metadata only** (see [`docs/03-DATA-MODEL.md`](docs/03-DATA-MODEL.md)).
- Telegram `initData` is **verified server-side** on every authenticated request; client-provided
  user data is never trusted.
- No secret material is ever placed in Telegram Cloud Storage or `localStorage` in plaintext.

## Getting started

```bash
npm install
npm test            # runs wallet-core + telegram-auth test suites
```

## Build status / phase

This repo is being built in phases. See [`docs/05-ROADMAP.md`](docs/05-ROADMAP.md).
**Current: Phase 1 foundation** — security core + Telegram auth + planning deliverables landed.

```

### `sakhtar.py`

```py
# project_snapshot.py
from pathlib import Path
from datetime import datetime
import os

ROOT = Path.cwd()

OUTPUT_FILE = ROOT / "project_snapshot.md"

IGNORE_DIRS = {
    ".git", ".idea", ".vscode",
    "node_modules", "vendor",
    "venv", ".venv", "__pycache__",
    "dist", "build", "coverage",
    ".next", ".nuxt", ".cache",
    "target", "bin", "obj",
}

IGNORE_FILES = {
    ".env", ".env.local", ".env.production", ".env.development",
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    "composer.lock", "Pipfile.lock", "poetry.lock",
}

IMPORTANT_FILES = {
    "package.json",
    "tsconfig.json",
    "vite.config.js",
    "vite.config.ts",
    "next.config.js",
    "next.config.ts",
    "nuxt.config.js",
    "nuxt.config.ts",
    "requirements.txt",
    "pyproject.toml",
    "Pipfile",
    "composer.json",
    "docker-compose.yml",
    "Dockerfile",
    "README.md",
    "README.txt",
    "manage.py",
    "app.py",
    "main.py",
    "settings.py",
    "urls.py",
    "routes.py",
    "server.js",
    "index.js",
    "index.ts",
    "main.js",
    "main.ts",
}

CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".tsx", ".jsx",
    ".php", ".java", ".cs", ".go", ".rs",
    ".html", ".css", ".scss",
    ".vue", ".svelte",
    ".json", ".yml", ".yaml", ".toml",
}

MAX_FILE_CHARS = 12000


def should_ignore(path: Path) -> bool:
    parts = set(path.parts)
    if parts & IGNORE_DIRS:
        return True
    if path.name in IGNORE_FILES:
        return True
    if path.name.startswith(".env"):
        return True
    return False


def safe_read(path: Path) -> str:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        return f"[Cannot read file: {e}]"

    if len(text) > MAX_FILE_CHARS:
        return text[:MAX_FILE_CHARS] + "\n\n...[truncated]..."
    return text


def make_tree(root: Path) -> str:
    lines = []

    def walk(directory: Path, prefix: str = ""):
        items = sorted(
            [p for p in directory.iterdir() if not should_ignore(p)],
            key=lambda p: (p.is_file(), p.name.lower())
        )

        for index, path in enumerate(items):
            connector = "└── " if index == len(items) - 1 else "├── "
            lines.append(prefix + connector + path.name)

            if path.is_dir():
                extension = "    " if index == len(items) - 1 else "│   "
                walk(path, prefix + extension)

    lines.append(root.name + "/")
    walk(root)
    return "\n".join(lines)


def collect_stats(root: Path):
    files = []
    ext_count = {}

    for path in root.rglob("*"):
        if path.is_file() and not should_ignore(path):
            files.append(path)
            ext = path.suffix.lower() or "[no extension]"
            ext_count[ext] = ext_count.get(ext, 0) + 1

    return files, ext_count


def main():
    files, ext_count = collect_stats(ROOT)

    with OUTPUT_FILE.open("w", encoding="utf-8") as out:
        out.write("# Project Snapshot\n\n")
        out.write(f"- Generated at: {datetime.now().isoformat(timespec='seconds')}\n")
        out.write(f"- Root folder: `{ROOT.name}`\n")
        out.write(f"- Total scanned files: {len(files)}\n\n")

        out.write("## File Types\n\n")
        for ext, count in sorted(ext_count.items(), key=lambda x: x[1], reverse=True):
            out.write(f"- `{ext}`: {count}\n")

        out.write("\n## Project Structure\n\n")
        out.write("```text\n")
        out.write(make_tree(ROOT))
        out.write("\n```\n\n")

        out.write("## Important Files\n\n")
        important_paths = [
            p for p in files
            if p.name in IMPORTANT_FILES or p.suffix.lower() in CODE_EXTENSIONS
        ]

        for path in sorted(important_paths):
            rel = path.relative_to(ROOT)
            out.write(f"\n### `{rel}`\n\n")
            out.write(f"```{path.suffix.lstrip('.') or 'text'}\n")
            out.write(safe_read(path))
            out.write("\n```\n")

    print(f"Done. Created: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
```

### `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM"],
    "declaration": true,
    "sourceMap": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": false
  }
}

```
