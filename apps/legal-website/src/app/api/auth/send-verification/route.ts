import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`verify-email:${ip}`, 3, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "تعداد درخواست‌ها بیش از حد مجاز است" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
  if (user.emailVerified) {
    return NextResponse.json({ error: "ایمیل قبلاً تأیید شده است" }, { status: 400 });
  }

  // حذف کدهای قبلی
  await db.otpCode.deleteMany({ where: { userId } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعت

  await db.otpCode.create({ data: { userId, code: token, expiresAt } });

  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") ?? "fa";

  try {
    await sendVerificationEmail(user.email, user.name, token, locale);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطا در ارسال ایمیل" }, { status: 500 });
  }
}
