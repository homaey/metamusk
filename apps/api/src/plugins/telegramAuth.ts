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
