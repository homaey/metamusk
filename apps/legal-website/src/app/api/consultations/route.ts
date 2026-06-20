import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  lawyerId: z.string(),
  type: z.enum(["ONLINE", "PHONE", "INPERSON"]),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`consult:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "تعداد درخواست‌ها بیش از حد مجاز است" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const clientId = (session.user as any).id;

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const lawyer = await db.lawyer.findUnique({
      where: { id: data.lawyerId, status: "APPROVED" },
    });
    if (!lawyer) {
      return NextResponse.json({ error: "وکیل یافت نشد" }, { status: 404 });
    }

    // بررسی تداخل زمانی — بازه ۶۰ دقیقه‌ای
    const scheduledAt = new Date(data.scheduledAt);
    const sessionEnd = new Date(scheduledAt.getTime() + 60 * 60 * 1000);
    const conflict = await db.consultation.findFirst({
      where: {
        lawyerId: data.lawyerId,
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledAt: { gte: scheduledAt, lt: sessionEnd },
      },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "این زمان قبلاً رزرو شده است" },
        { status: 409 }
      );
    }

    const consultation = await db.consultation.create({
      data: {
        clientId,
        lawyerId: data.lawyerId,
        type: data.type,
        scheduledAt: new Date(data.scheduledAt),
        fee: lawyer.consultFee,
        notes: data.notes,
      },
      include: {
        lawyer: { include: { user: { select: { name: true, email: true } } } },
      },
    });

    return NextResponse.json({ consultation }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const lawyerId = (session.user as any).lawyerId;

  const where =
    role === "LAWYER" && lawyerId
      ? { lawyerId }
      : role === "ADMIN"
      ? {}
      : { clientId: userId };

  const consultations = await db.consultation.findMany({
    where,
    orderBy: { scheduledAt: "desc" },
    include: {
      client: { select: { name: true, email: true, phone: true } },
      lawyer: { include: { user: { select: { name: true } } } },
      payment: { select: { status: true, amount: true } },
    },
  });

  return NextResponse.json({ consultations });
}
