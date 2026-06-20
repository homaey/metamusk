"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { FileText, Loader2, CheckCircle2 } from "lucide-react";

const DOC_TYPES = [
  { value: "NOTICE",    fa: "اظهارنامه",   en: "Legal Notice",   desc_fa: "مطالبه طلب، فسخ قرارداد، اخطار رسمی", desc_en: "Debt collection, contract termination, formal warning" },
  { value: "PETITION",  fa: "دادخواست",    en: "Petition",       desc_fa: "شکایت به دادگاه، مطالبه حق", desc_en: "Court petition, rights claim" },
  { value: "COMPLAINT", fa: "شکواییه",     en: "Complaint",      desc_fa: "شکایت کیفری به دادسرا", desc_en: "Criminal complaint to prosecutor" },
  { value: "BRIEF",     fa: "لایحه",       en: "Legal Brief",    desc_fa: "دفاعیه، تجدیدنظرخواهی، پاسخ به ادعا", desc_en: "Defense, appeal, response to claims" },
];

export default function NewDocumentPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "fa";

  const [type, setType] = useState("");
  const [form, setForm] = useState({ subject: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type) { setError(isRTL ? "نوع سند را انتخاب کنید" : "Please select document type"); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, subject: form.subject, description: form.description }),
    });

    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? (isRTL ? "خطا در ثبت درخواست" : "Error submitting request"));
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push(`/${locale}/dashboard/documents`), 2000);
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isRTL ? "درخواست ثبت شد!" : "Request Submitted!"}
          </h2>
          <p className="text-gray-500">{isRTL ? "در حال انتقال به لیست درخواست‌ها..." : "Redirecting to your requests..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isRTL ? "درخواست اوراق قضایی" : "New Document Request"}</h1>
        <p className="text-gray-500 text-sm mt-1">{isRTL ? "تیم ما در کمترین زمان سند را تهیه می‌کند" : "Our team will prepare the document as soon as possible"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {/* Document type selection */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{isRTL ? "نوع سند را انتخاب کنید" : "Select Document Type"}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {DOC_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`text-start p-4 rounded-xl border-2 transition-colors ${
                  type === t.value
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-100 hover:border-primary-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className={`w-5 h-5 ${type === t.value ? "text-primary-600" : "text-gray-400"}`} />
                  <span className={`font-semibold ${type === t.value ? "text-primary-700" : "text-gray-800"}`}>
                    {isRTL ? t.fa : t.en}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {isRTL ? t.desc_fa : t.desc_en}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">{isRTL ? "جزئیات درخواست" : "Request Details"}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isRTL ? "موضوع پرونده *" : "Case Subject *"}
            </label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              placeholder={isRTL ? "مثال: مطالبه اجاره‌بها از مستأجر" : "e.g. Rent collection from tenant"}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isRTL ? "شرح کامل موضوع *" : "Full Description *"}
            </label>
            <textarea
              required
              rows={5}
              minLength={30}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder={isRTL
                ? "تمام جزئیات پرونده را به دقت شرح دهید. هرچه اطلاعات بیشتری ارائه دهید، سند با کیفیت بهتری تهیه خواهد شد..."
                : "Describe all case details carefully. The more information you provide, the better the document will be..."}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{isRTL ? "حداقل ۳۰ کاراکتر" : "Minimum 30 characters"}</p>
          </div>

          {/* Info box */}
          <div className="bg-gold-50 border border-gold-100 rounded-xl p-4 text-sm text-gold-700">
            <p className="font-semibold mb-1">{isRTL ? "📋 اطلاعات مهم" : "📋 Important Info"}</p>
            <ul className="space-y-1 text-xs text-gold-600 list-disc list-inside">
              <li>{isRTL ? "زمان تهیه سند: ۲۴ تا ۷۲ ساعت کاری" : "Document preparation time: 24-72 business hours"}</li>
              <li>{isRTL ? "هزینه نهایی پس از بررسی اعلام می‌شود" : "Final fee will be announced after review"}</li>
              <li>{isRTL ? "مدارک تکمیلی از طریق داشبورد ارسال می‌شود" : "Additional documents can be uploaded via dashboard"}</li>
            </ul>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isRTL ? "ثبت درخواست" : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
