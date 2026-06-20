import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { sendVerificationEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(3, "نام باید حداقل ۳ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
  role: z.enum(["CLIENT", "LAWYER"]).default("CLIENT"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً ۱۵ دقیقه صبر کنید." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await db.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "این ایمیل یا شماره موبایل قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(data.password, 12);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashed,
        role: data.role,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    // ارسال ایمیل تأیید (fire and forget)
    try {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await db.otpCode.create({ data: { userId: user.id, code: token, expiresAt } });
      const locale = new URL(req.url).searchParams.get("locale") ?? "fa";
      sendVerificationEmail(user.email, user.name, token, locale).catch(() => {});
    } catch {}

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Register error:", err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
