import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  barNumber: z.string().min(5, "شماره پروانه معتبر وارد کنید"),
  specialtiesFA: z.array(z.string()).min(1, "حداقل یک تخصص انتخاب کنید"),
  specialtiesEN: z.array(z.string()).min(1),
  bioFA: z.string().min(50, "بیوگرافی باید حداقل ۵۰ کاراکتر باشد"),
  bioEN: z.string().optional(),
  experience: z.number().min(0).max(60),
  education: z.string().optional(),
  consultFee: z.number().min(0),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await db.lawyer.findFirst({
      where: { OR: [{ userId }, { barNumber: data.barNumber }] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "این حساب یا شماره پروانه قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const lawyer = await db.lawyer.create({
      data: {
        userId,
        barNumber: data.barNumber,
        specialtiesFA: JSON.stringify(data.specialtiesFA),
        specialtiesEN: JSON.stringify(data.specialtiesEN),
        bioFA: data.bioFA,
        bioEN: data.bioEN,
        experience: data.experience,
        education: data.education,
        consultFee: data.consultFee,
        status: "PENDING",
      },
    });

    // Update user role to LAWYER
    await db.user.update({
      where: { id: userId },
      data: { role: "LAWYER" },
    });

    return NextResponse.json({ lawyer }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error("Lawyer register error:", err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
