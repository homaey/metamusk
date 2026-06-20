import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  type: z.enum(["NOTICE", "PETITION", "COMPLAINT", "BRIEF"]),
  subject: z.string().min(5),
  description: z.string().min(20),
  attachments: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const clientId = (session.user as any).id;

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const feeMap = { NOTICE: 500000, PETITION: 1000000, COMPLAINT: 500000, BRIEF: 1500000 };
    const dueHours = { NOTICE: 24, PETITION: 48, COMPLAINT: 24, BRIEF: 72 };

    const dueAt = new Date();
    dueAt.setHours(dueAt.getHours() + dueHours[data.type]);

    const request = await db.documentRequest.create({
      data: {
        clientId,
        type: data.type,
        subject: data.subject,
        description: data.description,
        attachments: JSON.stringify(data.attachments),
        fee: feeMap[data.type],
        dueAt,
      },
    });

    return NextResponse.json({ request }, { status: 201 });
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
    role === "ADMIN"
      ? {}
      : role === "LAWYER" && lawyerId
      ? { lawyerId }
      : { clientId: userId };

  const requests = await db.documentRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, email: true, phone: true } },
      lawyer: { include: { user: { select: { name: true } } } },
      payment: { select: { status: true } },
    },
  });

  return NextResponse.json({ requests });
}
