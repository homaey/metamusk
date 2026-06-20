import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import DocumentsSection from "@/components/sections/DocumentsSection";
import { getBreadcrumbSchema } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.documents" });
  return { title: t("title"), description: t("description") };
}

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === "fa";

  const breadcrumb = getBreadcrumbSchema([
    { name: isRTL ? "خانه" : "Home", url: `https://legalfirm.ir/${locale}` },
    { name: isRTL ? "اوراق قضایی" : "Legal Documents", url: `https://legalfirm.ir/${locale}/documents` },
  ]);

  const steps = isRTL
    ? ["فرم درخواست را تکمیل کنید", "وکیل متخصص پرونده را بررسی می‌کند", "سند در مدت زمان تعیین‌شده تهیه می‌شود", "سند به صورت رسمی تحویل داده می‌شود"]
    : ["Complete the request form", "Expert lawyer reviews the case", "Document is prepared within stated timeframe", "Document is officially delivered"];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 to-primary-800 py-32 text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">
              {isRTL ? "خدمات اوراق قضایی" : "Legal Document Services"}
            </span>
            <h1 className={`mt-3 text-4xl sm:text-5xl font-bold mb-4 ${isRTL ? "font-fa" : "font-serif"}`}>
              {isRTL ? "تهیه اوراق قضایی" : "Legal Document Preparation"}
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              {isRTL
                ? "با راهنمایی وکلای متخصص، اوراق قضایی حرفه‌ای در سریع‌ترین زمان ممکن"
                : "With expert lawyer guidance, professional legal documents in the shortest time possible"}
            </p>
          </div>
        </section>

        {/* Process steps */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-2xl font-bold text-primary-900 text-center mb-10 ${isRTL ? "font-fa" : "font-serif"}`}>
              {isRTL ? "مراحل دریافت خدمت" : "How It Works"}
            </h2>
            <div className="grid sm:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 z-10 relative">
                    {idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-full h-0.5 bg-primary-200 hidden sm:block" />
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Document types detail */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: isRTL ? "اظهارنامه" : "Legal Notice",
                  desc: isRTL
                    ? "اظهارنامه یک اخطار رسمی قانونی است که از طریق اداره پست قضایی به طرف مقابل ارسال می‌شود. این سند در موارد مطالبه طلب، تخلیه ملک، فسخ قرارداد و موارد مشابه کاربرد دارد."
                    : "A legal notice is a formal legal warning sent to the opposing party through the judicial postal service. Used in debt collection, property eviction, contract termination and similar cases.",
                  points: isRTL
                    ? ["مطالبه وجه و طلب", "درخواست تخلیه ملک", "اعلام فسخ قرارداد", "اخطار انجام تعهد"]
                    : ["Debt collection", "Property eviction request", "Contract termination notice", "Obligation fulfillment warning"],
                },
                {
                  title: isRTL ? "دادخواست" : "Petition / Lawsuit",
                  desc: isRTL
                    ? "دادخواست سندی است که توسط خواهان یا وکیل او تنظیم و به دادگاه تقدیم می‌شود. در این سند درخواست رسمی از دادگاه جهت صدور حکم بیان می‌شود."
                    : "A petition is a document prepared by the plaintiff or their attorney and submitted to the court. It formally requests the court to issue a judgment.",
                  points: isRTL
                    ? ["دعاوی حقوقی و مالی", "دعاوی خانوادگی", "دعاوی ملکی", "خسارت و غرامت"]
                    : ["Civil and financial disputes", "Family law cases", "Property disputes", "Damages and compensation"],
                },
                {
                  title: isRTL ? "شکواییه" : "Criminal Complaint",
                  desc: isRTL
                    ? "شکواییه یا شکایت کیفری سندی است که شاکی آن را تنظیم و به دادسرا تقدیم می‌کند. این سند در جرائم کیفری برای پیگیری حقوق قانونی استفاده می‌شود."
                    : "A criminal complaint is a document prepared by the complainant and submitted to the prosecutor's office, used in criminal offenses to pursue legal rights.",
                  points: isRTL
                    ? ["کلاهبرداری و اختلاس", "خیانت در امانت", "ضرب و جرح", "تهدید و مزاحمت"]
                    : ["Fraud and embezzlement", "Breach of trust", "Assault and battery", "Threats and harassment"],
                },
                {
                  title: isRTL ? "لایحه قضایی" : "Legal Brief",
                  desc: isRTL
                    ? "لایحه سندی است که وکیل یا طرفین دعوا جهت ارائه مستندات، دفاعیه یا استدلال‌های حقوقی به مرجع قضایی تقدیم می‌کنند."
                    : "A legal brief is a document submitted by an attorney or litigants to the judicial authority to present evidence, defenses or legal arguments.",
                  points: isRTL
                    ? ["لایحه دفاعیه", "لایحه تجدیدنظرخواهی", "لایحه پاسخ به ادعا", "لایحه تقاضای رأی"]
                    : ["Defense brief", "Appeal brief", "Response to claims", "Judgment request brief"],
                },
              ].map((doc, idx) => (
                <div key={idx} className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className={`text-xl font-bold text-primary-900 mb-3 ${isRTL ? "font-fa" : ""}`}>
                    {doc.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{doc.desc}</p>
                  <ul className="space-y-2">
                    {doc.points.map((point, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DocumentsSection />
      </div>
    </>
  );
}
