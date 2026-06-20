import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Scale, Shield, Building2, FileText, Home, Heart, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { getBreadcrumbSchema } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFA = locale === "fa";
  return {
    title: isFA ? "خدمات حقوقی - موسسه حقوقی" : "Legal Services - Legal Firm",
    description: isFA
      ? "خدمات جامع حقوقی شامل دعاوی مدنی، کیفری، تجاری، خانوادگی و ملکی"
      : "Comprehensive legal services including civil, criminal, commercial, family and property litigation",
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === "fa";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const breadcrumb = getBreadcrumbSchema([
    { name: isRTL ? "خانه" : "Home", url: `https://legalfirm.ir/${locale}` },
    { name: isRTL ? "خدمات" : "Services", url: `https://legalfirm.ir/${locale}/services` },
  ]);

  const services = [
    {
      icon: Scale,
      titleFA: "دعاوی حقوقی (مدنی)",
      titleEN: "Civil Litigation",
      descFA: "وکالت حرفه‌ای در تمامی پرونده‌های حقوقی و مدنی",
      descEN: "Professional representation in all civil and legal cases",
      pointsFA: ["دعاوی قراردادی", "مطالبه خسارت", "دعاوی ملکی", "دعاوی اسناد تجاری"],
      pointsEN: ["Contractual disputes", "Damage claims", "Property disputes", "Commercial document cases"],
    },
    {
      icon: Shield,
      titleFA: "دعاوی کیفری",
      titleEN: "Criminal Defense",
      descFA: "دفاع از حقوق موکل در پرونده‌های جنایی",
      descEN: "Defending client rights in criminal cases",
      pointsFA: ["کلاهبرداری و اختلاس", "خیانت در امانت", "جرائم رایانه‌ای", "دعاوی نشر اکاذیب"],
      pointsEN: ["Fraud and embezzlement", "Breach of trust", "Cyber crimes", "Defamation cases"],
    },
    {
      icon: Building2,
      titleFA: "حقوق تجاری",
      titleEN: "Commercial Law",
      descFA: "مشاوره و وکالت در امور تجاری و شرکتی",
      descEN: "Consulting and representation in commercial and corporate matters",
      pointsFA: ["ثبت شرکت و برند", "قراردادهای تجاری", "دعاوی شرکتی", "قراردادهای بین‌المللی"],
      pointsEN: ["Company and brand registration", "Commercial contracts", "Corporate litigation", "International contracts"],
    },
    {
      icon: Heart,
      titleFA: "حقوق خانواده",
      titleEN: "Family Law",
      descFA: "خدمات تخصصی در امور خانوادگی",
      descEN: "Specialized services in family matters",
      pointsFA: ["طلاق و جدایی", "حضانت فرزند", "مهریه و نفقه", "ارث و میراث"],
      pointsEN: ["Divorce and separation", "Child custody", "Dowry and alimony", "Inheritance"],
    },
    {
      icon: Home,
      titleFA: "امور ملکی",
      titleEN: "Property Law",
      descFA: "خدمات حقوقی در معاملات ملکی",
      descEN: "Legal services in real estate transactions",
      pointsFA: ["خرید و فروش ملک", "انتقال سند", "دعاوی زمین", "اجاره و تخلیه"],
      pointsEN: ["Buying and selling property", "Title transfer", "Land disputes", "Lease and eviction"],
    },
    {
      icon: FileText,
      titleFA: "تهیه اوراق قضایی",
      titleEN: "Legal Documents",
      descFA: "تنظیم حرفه‌ای انواع اوراق قضایی",
      descEN: "Professional preparation of all types of legal documents",
      pointsFA: ["اظهارنامه", "دادخواست", "شکواییه", "لوایح قضایی"],
      pointsEN: ["Legal notices", "Petitions", "Complaints", "Legal briefs"],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div dir={isRTL ? "rtl" : "ltr"}>
        <section className="bg-gradient-to-br from-primary-950 to-primary-800 py-32 text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">
              {isRTL ? "خدمات ما" : "Our Services"}
            </span>
            <h1 className={`mt-3 text-4xl sm:text-5xl font-bold mb-4 ${isRTL ? "font-fa" : "font-serif"}`}>
              {isRTL ? "خدمات حقوقی تخصصی" : "Specialized Legal Services"}
            </h1>
            <p className="text-gray-300 text-lg">
              {isRTL
                ? "جامع‌ترین خدمات حقوقی با بهترین وکلای متخصص"
                : "Most comprehensive legal services with the best specialist lawyers"}
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.titleEN}
                    className="group border border-gray-100 hover:border-primary-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 bg-primary-50 group-hover:bg-primary-700 rounded-xl flex items-center justify-center mb-6 transition-colors">
                      <Icon className="w-7 h-7 text-primary-700 group-hover:text-white transition-colors" />
                    </div>
                    <h2 className={`text-xl font-bold text-primary-900 mb-2 ${isRTL ? "font-fa" : ""}`}>
                      {isRTL ? service.titleFA : service.titleEN}
                    </h2>
                    <p className="text-gray-500 text-sm mb-5">
                      {isRTL ? service.descFA : service.descEN}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {(isRTL ? service.pointsFA : service.pointsEN).map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/${locale}/contact`}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm font-medium group/link"
                    >
                      {isRTL ? "مشاوره رایگان" : "Free Consultation"}
                      <Arrow className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
