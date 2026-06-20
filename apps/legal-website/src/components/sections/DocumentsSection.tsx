"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Gavel, AlertCircle, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const docIcons = [FileText, Gavel, AlertCircle, BookOpen];

export default function DocumentsSection() {
  const t = useTranslations("documents");
  const tForm = useTranslations("documents.form");
  const locale = useLocale();
  const isRTL = locale === "fa";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const docTypes = ["notice", "petition", "complaint", "brief"] as const;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section
      className="py-24 bg-primary-950 text-white"
      dir={isRTL ? "rtl" : "ltr"}
      id="documents"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">
            {isRTL ? "اوراق قضایی" : "Legal Documents"}
          </span>
          <h2 className={`mt-3 text-3xl sm:text-4xl font-bold text-white ${isRTL ? "font-fa" : "font-serif"}`}>
            {t("title")}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Document type cards */}
          <div className="grid grid-cols-2 gap-4">
            {docTypes.map((type, idx) => {
              const Icon = docIcons[idx];
              const isActive = selected === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelected(type)}
                  className={cn(
                    "text-start p-6 rounded-2xl border transition-all cursor-pointer",
                    isActive
                      ? "bg-gold-500/20 border-gold-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                    isActive ? "bg-gold-500/30" : "bg-white/10"
                  )}>
                    <Icon className={cn("w-6 h-6", isActive ? "text-gold-400" : "text-gray-400")} />
                  </div>
                  <h3 className={`font-bold text-white mb-2 ${isRTL ? "font-fa" : ""}`}>
                    {t(`types.${type}.title`)}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    {t(`types.${type}.desc`)}
                  </p>
                  <div className="flex items-center gap-1.5 text-gold-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {t(`types.${type}.time`)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isRTL ? "درخواست ثبت شد!" : "Request Submitted!"}
                </h3>
                <p className="text-gray-400">{tForm("success")}</p>
                <button
                  onClick={() => { setSubmitted(false); setSelected(null); }}
                  className="mt-6 px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  {isRTL ? "ثبت درخواست جدید" : "New Request"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {tForm("type")}
                  </label>
                  <select
                    required
                    value={selected ?? ""}
                    onChange={(e) => setSelected(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                  >
                    <option value="" disabled className="bg-primary-900">
                      {tForm("selectType")}
                    </option>
                    {docTypes.map((type) => (
                      <option key={type} value={type} className="bg-primary-900">
                        {t(`types.${type}.title`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{tForm("name")}</label>
                    <input
                      type="text"
                      required
                      placeholder={tForm("placeholders.name")}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{tForm("phone")}</label>
                    <input
                      type="tel"
                      required
                      placeholder={tForm("placeholders.phone")}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{tForm("email")}</label>
                  <input
                    type="email"
                    placeholder={tForm("placeholders.email")}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{tForm("subject")}</label>
                  <input
                    type="text"
                    required
                    placeholder={tForm("placeholders.subject")}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{tForm("description")}</label>
                  <textarea
                    rows={4}
                    placeholder={tForm("placeholders.description")}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {tForm("submitting")}
                    </>
                  ) : (
                    tForm("submit")
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
