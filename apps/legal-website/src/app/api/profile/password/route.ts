import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  current: z.string().min(1),
  next: z.string().min(8, "رمز جدید باید حداقل ۸ کاراکتر باشد"),
});

export async function PATCH(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`pw-change:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "تعداد درخواست‌ها بیش از حد مجاز است" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });

    const valid = await bcrypt.compare(data.current, user.password);
    if (!valid) {
      return NextResponse.json({ error: "رمز فعلی اشتباه است" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(data.next, 12);
    await db.user.update({ where: { id: userId }, data: { password: hashed } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
