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
