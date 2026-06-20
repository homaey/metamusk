import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, Tag, Calendar, ChevronRight, ChevronLeft, Eye, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/schema";
import { sanitizeContent } from "@/lib/sanitize";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isRTL = locale === "fa";
  const article = await db.article.findFirst({
    where: isRTL ? { slugFA: slug, status: "PUBLISHED" } : { slugEN: slug, status: "PUBLISHED" },
    include: { author: { include: { user: { select: { name: true } } } } },
  });
  if (!article) return { title: "Not Found" };
  return {
    title: isRTL ? article.titleFA : article.titleEN,
    description: (isRTL ? article.excerptFA : article.excerptEN) ?? undefined,
    openGraph: {
      title: isRTL ? article.titleFA : article.titleEN,
      description: (isRTL ? article.excerptFA : article.excerptEN) ?? undefined,
      images: article.coverImage ? [article.coverImage] : [],
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const isRTL = locale === "fa";
  const Arrow = isRTL ? ChevronRight : ChevronLeft;

  const article = await db.article.findFirst({
    where: isRTL ? { slugFA: slug, status: "PUBLISHED" } : { slugEN: slug, status: "PUBLISHED" },
    include: {
      author: { include: { user: { select: { name: true } } } },
      category: { select: { nameFA: true, nameEN: true } },
    },
  });

  if (!article) notFound();

  // Increment view count (fire and forget)
  db.article.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  // Related articles
  const related = await db.article.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: article.id },
      ...(article.categoryId ? { categoryId: article.categoryId } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: { id: true, titleFA: true, titleEN: true, slugFA: true, slugEN: true, readTimeMin: true },
  });

  const articleSchema = getArticleSchema({
    title: isRTL ? article.titleFA : article.titleEN,
    description: (isRTL ? article.excerptFA : article.excerptEN) ?? "",
    author: article.author.user.name,
    publishedAt: article.publishedAt?.toISOString() ?? article.createdAt.toISOString(),
    url: `https://legalfirm.ir/${locale}/articles/${slug}`,
    image: article.coverImage ?? undefined,
  });

  const breadcrumb = getBreadcrumbSchema([
    { name: isRTL ? "خانه" : "Home", url: `https://legalfirm.ir/${locale}` },
    { name: isRTL ? "مقالات" : "Articles", url: `https://legalfirm.ir/${locale}/articles` },
    { name: isRTL ? article.titleFA : article.titleEN, url: `https://legalfirm.ir/${locale}/articles/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 to-primary-800 pt-32 pb-16 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/${locale}/articles`}
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
            >
              <Arrow className="w-4 h-4" />
              {isRTL ? "بازگشت به مقالات" : "Back to Articles"}
            </Link>

            {article.category && (
              <span className="inline-block bg-gold-500/20 text-gold-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {isRTL ? article.category.nameFA : article.category.nameEN}
              </span>
            )}

            <h1 className={`text-3xl sm:text-4xl font-bold mb-6 leading-tight ${isRTL ? "font-fa" : "font-serif"}`}>
              {isRTL ? article.titleFA : article.titleEN}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {article.author.user.name.charAt(0)}
                </div>
                <span>{article.author.user.name}</span>
              </div>
              {article.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString(isRTL ? "fa-IR" : "en-US", { dateStyle: "long" })}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTimeMin} {isRTL ? "دقیقه مطالعه" : "min read"}
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {article.viewCount.toLocaleString(isRTL ? "fa-IR" : "en-US")} {isRTL ? "بازدید" : "views"}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12">
            {/* Article body */}
            <div className="lg:col-span-2">
              {article.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.coverImage}
                  alt={isRTL ? article.titleFA : article.titleEN}
                  className="w-full h-72 object-cover rounded-2xl mb-8"
                />
              )}

              {(isRTL ? article.excerptFA : article.excerptEN) && (
                <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-s-4 border-primary-500 ps-4">
                  {isRTL ? article.excerptFA : article.excerptEN}
                </p>
              )}

              <div
                className={`prose prose-gray max-w-none leading-relaxed text-gray-700 ${isRTL ? "text-right" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: sanitizeContent(
                    (isRTL ? article.contentFA : article.contentEN)
                      .split("\n\n")
                      .filter(Boolean)
                      .map(p => `<p class="mb-5 leading-8">${p.replace(/\n/g, "<br/>")}</p>`)
                      .join("")
                  ),
                }}
              />

              {/* Tags */}
              {(() => {
                const tags: string[] = JSON.parse(article.tags || "[]");
                return tags.length > 0 ? (
                  <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                    {tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author card */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">{isRTL ? "نویسنده" : "Author"}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {article.author.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{article.author.user.name}</p>
                    <p className="text-xs text-gray-500">{isRTL ? "وکیل متخصص" : "Expert Lawyer"}</p>
                  </div>
                </div>
                <Link
                  href={`/${locale}/lawyers/${article.authorId}`}
                  className="w-full flex items-center justify-center gap-1.5 border border-primary-200 hover:bg-primary-50 text-primary-700 text-xs px-4 py-2 rounded-xl transition-colors font-medium"
                >
                  {isRTL ? "مشاهده پروفایل" : "View Profile"}
                </Link>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">{isRTL ? "مقالات مرتبط" : "Related Articles"}</h3>
                  <div className="space-y-3">
                    {related.map(r => (
                      <Link
                        key={r.id}
                        href={`/${locale}/articles/${isRTL ? r.slugFA : r.slugEN}`}
                        className="flex gap-2 group"
                      >
                        <BookOpen className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-700 group-hover:text-primary-700 line-clamp-2 transition-colors leading-snug">
                            {isRTL ? r.titleFA : r.titleEN}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{r.readTimeMin} {isRTL ? "دقیقه" : "min"}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-primary-900 rounded-2xl p-5 text-white text-center">
                <p className="font-bold mb-1 text-sm">{isRTL ? "نیاز به مشاوره دارید؟" : "Need legal advice?"}</p>
                <p className="text-xs text-gray-400 mb-4">{isRTL ? "وکلای ما آماده کمک هستند" : "Our lawyers are ready to help"}</p>
                <Link
                  href={`/${locale}/lawyers`}
                  className="inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  {isRTL ? "مشاوره رایگان" : "Free Consultation"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
