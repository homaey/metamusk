import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Briefcase, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { lawyers } from "@/lib/data";

export default function LawyersSection() {
  const t = useTranslations("lawyers");
  const locale = useLocale();
  const isRTL = locale === "fa";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      className="py-24 bg-gray-50"
      dir={isRTL ? "rtl" : "ltr"}
      id="lawyers"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-600 text-sm font-semibold uppercase tracking-wider">
            {isRTL ? "تیم ما" : "Our Team"}
          </span>
          <h2 className={`mt-3 text-3xl sm:text-4xl font-bold text-primary-900 ${isRTL ? "font-fa" : "font-serif"}`}>
            {t("title")}
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Photo */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={lawyer.image}
                  alt={isRTL ? lawyer.nameFA : lawyer.nameEN}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className={`font-bold text-primary-900 ${isRTL ? "font-fa" : ""}`}>
                      {isRTL ? lawyer.nameFA : lawyer.nameEN}
                    </h3>
                    <p className="text-gold-600 text-xs font-medium mt-0.5">
                      {isRTL ? lawyer.titleFA : lawyer.titleEN}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gold-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-medium">5.0</span>
                  </div>
                </div>

                <p className="text-primary-600 text-xs font-medium mt-2 mb-4">
                  {isRTL ? lawyer.specialtyFA : lawyer.specialtyEN}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-5 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{lawyer.cases}+ {t("cases")}</span>
                  </div>
                  <span>{lawyer.experience}+ {t("experience")}</span>
                </div>

                <Link
                  href={`/${locale}/lawyers`}
                  className="w-full flex items-center justify-center gap-2 bg-primary-50 hover:bg-primary-700 text-primary-700 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {t("viewProfile")}
                  <Arrow className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/lawyers`}
            className="inline-flex items-center gap-2 border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all"
          >
            {isRTL ? "مشاهده همه وکلا" : "View All Lawyers"}
            <Arrow className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
