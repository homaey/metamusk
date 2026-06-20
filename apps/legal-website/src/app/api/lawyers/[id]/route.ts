import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lawyer = await db.lawyer.findUnique({
    where: { id, status: "APPROVED" },
    select: {
      id: true,
      consultFee: true,
      experience: true,
      specialtiesFA: true,
      specialtiesEN: true,
      user: { select: { name: true, phone: true } },
    },
  });

  if (!lawyer) {
    return NextResponse.json({ error: "وکیل یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ lawyer });
}
