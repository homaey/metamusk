import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Star, Award, Briefcase, Phone, CheckCircle2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { getBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const lawyer = await db.lawyer.findUnique({ where: { id }, include: { user: { select: { name: true } } } });
  if (!lawyer) return { title: "Not Found" };
  return {
    title: lawyer.user.name,
    description: locale === "fa" ? lawyer.bioFA?.slice(0, 160) : lawyer.bioEN?.slice(0, 160),
  };
}

export default async function LawyerProfilePage({ params }: Props) {
  const { locale, id } = await params;
  const isRTL = locale === "fa";
  const Arrow = isRTL ? ChevronRight : ChevronLeft;

  const lawyer = await db.lawyer.findUnique({
    where: { id, status: "APPROVED" },
    include: {
      user: { select: { name: true, avatar: true, phone: true } },
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { id: true, titleFA: true, titleEN: true, slugFA: true, slugEN: true, readTimeMin: true, publishedAt: true },
      },
    },
  });

  if (!lawyer) notFound();

  const specsFA: string[] = JSON.parse(lawyer.specialtiesFA || "[]");
  const specsEN: string[] = JSON.parse(lawyer.specialtiesEN || "[]");
  const specs = isRTL ? specsFA : specsEN;

  const breadcrumb = getBreadcrumbSchema([
    { name: isRTL ? "خانه" : "Home", url: `https://legalfirm.ir/${locale}` },
    { name: isRTL ? "وکلا" : "Lawyers", url: `https://legalfirm.ir/${locale}/lawyers` },
    { name: lawyer.user.name, url: `https://legalfirm.ir/${locale}/lawyers/${id}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 to-primary-800 pt-32 pb-20 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={`/${locale}/lawyers`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
              <Arrow className="w-4 h-4" />
              {isRTL ? "بازگشت به لیست وکلا" : "Back to Lawyers"}
            </Link>

            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl bg-primary-700/60 flex items-center justify-center text-5xl font-bold text-white shrink-0">
                {lawyer.user.name.charAt(0)}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{lawyer.user.name}</h1>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {specs.map((s) => (
                    <span key={s} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-medium">{s}</span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-gold-400" />
                    {lawyer.experience}+ {isRTL ? "سال تجربه" : "years exp"}
                  </div>
                  {lawyer.totalCases > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-gold-400" />
                      {lawyer.totalCases}+ {isRTL ? "پرونده" : "cases"}
                    </div>
                  )}
                  {lawyer.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-gold-400 fill-current" />
                      {lawyer.rating.toFixed(1)} ({lawyer.reviewCount} {isRTL ? "نظر" : "reviews"})
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="sm:text-end">
                {lawyer.consultFee > 0 && (
                  <p className="text-gray-400 text-sm mb-1">
                    {isRTL ? "تعرفه مشاوره" : "Consultation fee"}
                  </p>
                )}
                {lawyer.consultFee > 0 && (
                  <p className="text-2xl font-bold text-gold-400 mb-4">
                    {lawyer.consultFee.toLocaleString(isRTL ? "fa-IR" : "en-US")} {isRTL ? "تومان" : "IRR"}
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/${locale}/dashboard/consultations/new?lawyerId=${id}`}
                    className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isRTL ? "رزرو آنلاین وقت" : "Book Online"}
                  </Link>
                  {lawyer.user.phone && (
                    <a
                      href={`tel:${lawyer.user.phone}`}
                      className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {lawyer.user.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">
            {/* Bio + Articles */}
            <div className="lg:col-span-2 space-y-10">
              {/* Bio */}
              {(isRTL ? lawyer.bioFA : lawyer.bioEN) && (
                <div>
                  <h2 className="text-xl font-bold text-primary-900 mb-4">{isRTL ? "درباره من" : "About"}</h2>
                  <p className="text-gray-600 leading-relaxed text-[15px]">
                    {isRTL ? lawyer.bioFA : lawyer.bioEN}
                  </p>
                </div>
              )}

              {/* Articles */}
              {lawyer.articles.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    {isRTL ? "مقالات اخیر" : "Recent Articles"}
                  </h2>
                  <div className="space-y-4">
                    {lawyer.articles.map((a) => (
                      <Link
                        key={a.id}
                        href={`/${locale}/articles/${isRTL ? a.slugFA : a.slugEN}`}
                        className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-colors group"
                      >
                        <BookOpen className="w-5 h-5 text-primary-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-primary-700 line-clamp-1">
                            {isRTL ? a.titleFA : a.titleEN}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.readTimeMin} {isRTL ? "دقیقه مطالعه" : "min read"}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Details card */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-gray-900">{isRTL ? "اطلاعات تکمیلی" : "Details"}</h3>
                {[
                  { label: isRTL ? "شماره پروانه" : "Bar Number", value: lawyer.barNumber },
                  { label: isRTL ? "سابقه" : "Experience", value: `${lawyer.experience}+ ${isRTL ? "سال" : "years"}` },
                  ...(lawyer.education ? [{ label: isRTL ? "تحصیلات" : "Education", value: lawyer.education }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-gray-800 font-medium text-end">{value}</span>
                  </div>
                ))}
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {isRTL ? "وکیل تأیید شده" : "Verified Lawyer"}
              </div>

              {/* CTA */}
              {lawyer.user.phone ? (
                <a
                  href={`tel:${lawyer.user.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {isRTL ? "تماس تلفنی" : "Call Now"}
                  <span className="text-green-200 text-sm font-normal">{lawyer.user.phone}</span>
                </a>
              ) : (
                <Link
                  href={`/${locale}/contact`}
                  className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {isRTL ? "تماس برای مشاوره" : "Contact for Consultation"}
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
