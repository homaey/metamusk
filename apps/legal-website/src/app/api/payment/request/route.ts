import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { zarinpalRequest } from "@/lib/zarinpal";

const schema = z.object({
  type: z.enum(["consultation", "document"]),
  id: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    const body = await req.json();
    const { type, id } = schema.parse(body);

    let amount = 0;
    let description = "";
    let existingPayment = null;

    if (type === "consultation") {
      const c = await db.consultation.findUnique({
        where: { id, clientId: userId },
        include: { payment: true },
      });
      if (!c) return NextResponse.json({ error: "مشاوره یافت نشد" }, { status: 404 });
      if (c.payment?.status === "PAID") return NextResponse.json({ error: "قبلاً پرداخت شده" }, { status: 400 });
      amount = c.fee;
      description = `پرداخت هزینه مشاوره — ${new Date(c.scheduledAt).toLocaleDateString("fa-IR")}`;
      existingPayment = c.payment;
    } else {
      const d = await db.documentRequest.findUnique({
        where: { id, clientId: userId },
        include: { payment: true },
      });
      if (!d) return NextResponse.json({ error: "درخواست یافت نشد" }, { status: 404 });
      if (d.payment?.status === "PAID") return NextResponse.json({ error: "قبلاً پرداخت شده" }, { status: 400 });
      amount = d.fee;
      description = `پرداخت هزینه ${d.type} — ${d.subject}`;
      existingPayment = d.payment;
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "مبلغ نامعتبر است" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3001";
    const callbackUrl = `${baseUrl}/api/payment/verify?type=${type}&id=${id}`;

    const { authority, paymentUrl } = await zarinpalRequest(
      amount,
      description,
      callbackUrl,
      session.user.email ?? undefined
    );

    // ذخیره یا update payment
    if (existingPayment) {
      await db.payment.update({
        where: { id: existingPayment.id },
        data: { authority, status: "PENDING" },
      });
    } else {
      await db.payment.create({
        data: {
          amount,
          authority,
          gateway: "zarinpal",
          ...(type === "consultation" ? { consultationId: id } : { docRequestId: id }),
        },
      });
    }

    return NextResponse.json({ paymentUrl, authority });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error("Payment request error:", err);
    return NextResponse.json({ error: "خطا در اتصال به درگاه پرداخت" }, { status: 500 });
  }
}
