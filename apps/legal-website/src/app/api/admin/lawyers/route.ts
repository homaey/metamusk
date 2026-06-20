import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { sendLawyerStatusEmail } from "@/lib/email";

// GET /api/admin/lawyers — لیست درخواست‌های ثبت وکیل
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const lawyers = await db.lawyer.findMany({
    where: status ? { status: status as any } : {},
    include: {
      user: { select: { name: true, email: true, phone: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ lawyers });
}

// PATCH /api/admin/lawyers — تأیید یا رد وکیل
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { lawyerId, status } = await req.json();
  if (!lawyerId || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "پارامترهای نامعتبر" }, { status: 400 });
  }

  const lawyer = await db.lawyer.update({
    where: { id: lawyerId },
    data: { status },
    include: { user: { select: { name: true, email: true } } },
  });

  // ارسال ایمیل اطلاع‌رسانی (fire and forget)
  sendLawyerStatusEmail(
    lawyer.user.email,
    lawyer.user.name,
    status as "APPROVED" | "REJECTED"
  ).catch(() => {});

  return NextResponse.json({ lawyer });
}
