import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const locale = searchParams.get("locale") ?? "fa";

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/auth/verify-email?error=invalid`, req.url));
  }

  const otp = await db.otpCode.findFirst({
    where: { code: token, used: false, expiresAt: { gt: new Date() } },
    include: { user: true },
  });

  if (!otp) {
    return NextResponse.redirect(new URL(`/${locale}/auth/verify-email?error=expired`, req.url));
  }

  await Promise.all([
    db.user.update({
      where: { id: otp.userId },
      data: { emailVerified: new Date() },
    }),
    db.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    }),
  ]);

  return NextResponse.redirect(new URL(`/${locale}/auth/verify-email?success=1`, req.url));
}
