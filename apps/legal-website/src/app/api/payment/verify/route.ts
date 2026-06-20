import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { zarinpalVerify } from "@/lib/zarinpal";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authority = searchParams.get("Authority");
  const status    = searchParams.get("Status");
  const type      = searchParams.get("type") as "consultation" | "document";
  const id        = searchParams.get("id");

  const locale = "fa";
  const baseRedirect = `/${locale}/dashboard/${type === "consultation" ? "consultations" : "documents"}`;

  if (status !== "OK" || !authority || !id) {
    return NextResponse.redirect(new URL(`${baseRedirect}?payment=cancelled`, req.url));
  }

  try {
    const payment = await db.payment.findFirst({ where: { authority } });
    if (!payment) {
      return NextResponse.redirect(new URL(`${baseRedirect}?payment=error`, req.url));
    }

    if (payment.status === "PAID") {
      return NextResponse.redirect(new URL(`${baseRedirect}?payment=already-paid`, req.url));
    }

    const { refId } = await zarinpalVerify(authority, payment.amount);

    await db.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", refId, paidAt: new Date() },
    });

    // آپدیت وضعیت مشاوره یا درخواست
    if (type === "consultation" && payment.consultationId) {
      await db.consultation.update({
        where: { id: payment.consultationId },
        data: { status: "CONFIRMED", paidAt: new Date() },
      });
    } else if (type === "document" && payment.docRequestId) {
      await db.documentRequest.update({
        where: { id: payment.docRequestId },
        data: { status: "REVIEWING" },
      });
    }

    return NextResponse.redirect(new URL(`${baseRedirect}?payment=success&refId=${refId}`, req.url));
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.redirect(new URL(`${baseRedirect}?payment=error`, req.url));
  }
}
