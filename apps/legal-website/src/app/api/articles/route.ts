import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// GET /api/articles  — لیست مقالات منتشر شده
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "9")));
  const category = searchParams.get("category");
  const locale = searchParams.get("locale") ?? "fa";
  const skip = (page - 1) * limit;

  const where = {
    status: "PUBLISHED" as const,
    ...(category ? { category: { slug: category } } : {}),
  };

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        titleFA: true,
        titleEN: true,
        slugFA: true,
        slugEN: true,
        excerptFA: true,
        excerptEN: true,
        coverImage: true,
        readTimeMin: true,
        publishedAt: true,
        viewCount: true,
        tags: true,
        category: { select: { nameFA: true, nameEN: true, slug: true } },
        author: {
          select: {
            user: { select: { name: true, avatar: true } },
            specialtiesFA: true,
          },
        },
      },
    }),
    db.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

// POST /api/articles  — ایجاد مقاله جدید (وکیل/ادمین)
const createSchema = z.object({
  titleFA: z.string().min(10),
  titleEN: z.string().min(10),
  slugFA: z.string().min(3),
  slugEN: z.string().min(3),
  excerptFA: z.string().optional(),
  excerptEN: z.string().optional(),
  contentFA: z.string().min(100),
  contentEN: z.string().min(100),
  coverImage: z.string().optional(),
  categoryId: z.string().optional(),
  readTimeMin: z.number().default(5),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const lawyerId = (session?.user as any)?.lawyerId;
  const lawyerStatus = (session?.user as any)?.lawyerStatus;

  if (!session?.user || !["LAWYER", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  if (role === "LAWYER" && lawyerStatus !== "APPROVED") {
    return NextResponse.json({ error: "فقط وکلای تأیید شده می‌توانند مقاله منتشر کنند" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    // بررسی تکراری نبودن slug
    const existing = await db.article.findFirst({
      where: { OR: [{ slugFA: data.slugFA }, { slugEN: data.slugEN }] },
    });
    if (existing) {
      return NextResponse.json({ error: "این slug قبلاً استفاده شده است" }, { status: 409 });
    }

    if (!lawyerId) {
      return NextResponse.json({ error: "پروفایل وکیل یافت نشد" }, { status: 400 });
    }

    const article = await db.article.create({
      data: {
        ...data,
        authorId: lawyerId,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
