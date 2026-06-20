import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { articles } from "@/lib/data";

export default function ArticlesSection() {
  const t = useTranslations("articles");
  const locale = useLocale();
  const isRTL = locale === "fa";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const featured = articles.slice(0, 3);

  return (
    <section
      className="py-24 bg-white"
      dir={isRTL ? "rtl" : "ltr"}
      id="articles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-wider">
              {isRTL ? "دانش حقوقی" : "Legal Knowledge"}
            </span>
            <h2 className={`mt-3 text-3xl sm:text-4xl font-bold text-primary-900 ${isRTL ? "font-fa" : "font-serif"}`}>
              {t("title")}
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl">{t("subtitle")}</p>
          </div>
          <Link
            href={`/${locale}/articles`}
            className="flex items-center gap-2 text-primary-700 hover:text-primary-900 font-medium transition-colors"
          >
            {isRTL ? "مشاهده همه مقالات" : "View All Articles"}
            <Arrow className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((article, idx) => (
            <article
              key={article.id}
              className={`group rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${idx === 0 ? "md:row-span-1" : ""}`}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={article.image}
                  alt={isRTL ? article.titleFA : article.titleEN}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-gold-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {isRTL ? article.categoryFA : article.categoryEN}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime} {t("minRead")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {isRTL ? article.author : article.authorEN}
                  </div>
                </div>

                <h3 className={`font-bold text-primary-900 mb-2 leading-snug group-hover:text-primary-700 transition-colors line-clamp-2 ${isRTL ? "font-fa" : ""}`}>
                  {isRTL ? article.titleFA : article.titleEN}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                  {isRTL ? article.excerptFA : article.excerptEN}
                </p>

                <Link
                  href={`/${locale}/articles/${article.slug}`}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm font-medium group/link"
                >
                  {t("readMore")}
                  <Arrow className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
