"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Save, Send, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export default function NewArticlePage() {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "fa";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titleFA: "",
    titleEN: "",
    slugFA: "",
    slugEN: "",
    excerptFA: "",
    excerptEN: "",
    contentFA: "",
    contentEN: "",
    coverImage: "",
    readTimeMin: 5,
    tags: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });

  function toSlug(str: string) {
    return str.trim().replace(/\s+/g, "-").replace(/[^؀-ۿa-zA-Z0-9-]/g, "");
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = k === "readTimeMin" ? parseInt(e.target.value) : e.target.value;
    setForm(p => ({ ...p, [k]: val }));
    if (k === "titleFA") setForm(p => ({ ...p, titleFA: e.target.value, slugFA: toSlug(e.target.value) }));
    if (k === "titleEN") setForm(p => ({ ...p, titleEN: e.target.value, slugEN: toSlug(e.target.value.toLowerCase()) }));
  };

  async function submit(status: "DRAFT" | "PUBLISHED") {
    setLoading(true);
    setError("");

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        status,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error);
      return;
    }

    router.push(`/${locale}/dashboard/articles`);
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <Arrow className="w-5 h-5 rotate-180" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? "مقاله جدید" : "New Article"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">{isRTL ? "محتوای فارسی" : "Persian Content"}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? "عنوان فارسی" : "Persian Title"}</label>
              <input
                type="text"
                required
                value={form.titleFA}
                onChange={f("titleFA")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug FA</label>
              <input
                type="text"
                value={form.slugFA}
                onChange={f("slugFA")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? "خلاصه فارسی" : "Persian Excerpt"}</label>
              <textarea
                rows={2}
                value={form.excerptFA}
                onChange={f("excerptFA")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? "متن مقاله (فارسی)" : "Article Content (Persian)"}</label>
              <textarea
                rows={10}
                required
                value={form.contentFA}
                onChange={f("contentFA")}
                placeholder={isRTL ? "متن مقاله را اینجا بنویسید..." : "Write article content here..."}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                dir="rtl"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">English Content</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">English Title</label>
              <input type="text" value={form.titleEN} onChange={f("titleEN")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug EN</label>
              <input type="text" value={form.slugEN} onChange={f("slugEN")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 font-mono" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Article Content (English)</label>
              <textarea rows={8} value={form.contentEN} onChange={f("contentEN")} placeholder="Write article content here..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">{isRTL ? "تنظیمات" : "Settings"}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? "تصویر کاور (URL)" : "Cover Image (URL)"}</label>
              <input type="url" value={form.coverImage} onChange={f("coverImage")} placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? "زمان مطالعه (دقیقه)" : "Read Time (min)"}</label>
              <input type="number" min={1} max={60} value={form.readTimeMin} onChange={f("readTimeMin")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? "تگ‌ها (با کاما)" : "Tags (comma separated)"}</label>
              <input type="text" value={form.tags} onChange={f("tags")} placeholder={isRTL ? "حقوق مدنی، قرارداد" : "civil law, contract"} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500" />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => submit("DRAFT")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 hover:border-gray-300 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isRTL ? "ذخیره پیش‌نویس" : "Save Draft"}
            </button>
            <button
              onClick={() => submit("PUBLISHED")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isRTL ? "انتشار مقاله" : "Publish Article"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
