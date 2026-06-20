"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Shield, Award, Users, Briefcase } from "lucide-react";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === "fa";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const stats = [
    { value: "۱۲۰۰+", valueEN: "1200+", label: t("stats.cases"), icon: Briefcase },
    { value: "۳۵۰۰+", valueEN: "3500+", label: t("stats.clients"), icon: Users },
    { value: "۲۰+", valueEN: "20+", label: t("stats.experience"), icon: Award },
    { value: "۴", valueEN: "4", label: t("stats.lawyers"), icon: Shield },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-800/30 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              {t("badge")}
            </div>

            {/* Title */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 ${isRTL ? "font-fa" : "font-serif"}`}>
              {t("title")}{" "}
              <span className="text-gold-400">{t("titleHighlight")}</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-xl">
              {t("subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/contact`}
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-gold-500/25 hover:shadow-gold-400/30 hover:-translate-y-0.5"
              >
                {t("cta")}
                <Arrow className="w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/services`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all backdrop-blur-sm"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          {/* Right: Stats card */}
          <div className="relative animate-slide-up">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl p-6 text-center group"
                  >
                    <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gold-500/30 transition-colors">
                      <stat.icon className="w-6 h-6 text-gold-400" />
                    </div>
                    <div className={`text-3xl font-bold text-white mb-1 ${isRTL ? "font-fa" : "font-en"}`}>
                      {isRTL ? stat.value : stat.valueEN}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-gold-400 font-bold text-sm">{isRTL ? "وکیل پایه یک" : "Bar Certified"}</div>
                  <div className="text-gray-500 text-xs">{isRTL ? "دادگستری" : "Attorney"}</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-gold-400 font-bold text-sm">{isRTL ? "مشاوره رایگان" : "Free Consult"}</div>
                  <div className="text-gray-500 text-xs">{isRTL ? "جلسه اول" : "First Session"}</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-gold-400 font-bold text-sm">{isRTL ? "ضمانت کیفیت" : "Quality Assured"}</div>
                  <div className="text-gray-500 text-xs">{isRTL ? "تضمین شده" : "Guaranteed"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
