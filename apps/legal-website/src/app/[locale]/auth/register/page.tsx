"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale } from "next-intl";
import { Scale, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "fa";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(isRTL ? "رمز عبور و تکرار آن مطابقت ندارند" : "Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: "CLIENT" }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    // Auto sign-in
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setSuccess(true);
    setTimeout(() => router.push(`/${locale}/dashboard`), 1500);
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isRTL ? "ثبت‌نام موکل" : "Client Registration"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{isRTL ? "موسسه حقوقی" : "Legal Firm"}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {isRTL ? "ثبت‌نام موفق!" : "Registration Successful!"}
              </h2>
              <p className="text-gray-500 text-sm">
                {isRTL ? "در حال انتقال به داشبورد..." : "Redirecting to dashboard..."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {[
                { key: "name" as const, label: isRTL ? "نام و نام خانوادگی" : "Full Name", type: "text", placeholder: isRTL ? "علی احمدی" : "John Smith" },
                { key: "email" as const, label: isRTL ? "ایمیل" : "Email", type: "email", placeholder: "example@email.com" },
                { key: "phone" as const, label: isRTL ? "شماره موبایل" : "Mobile", type: "tel", placeholder: isRTL ? "۰۹۱۲۳۴۵۶۷۸۹" : "+98912..." },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    value={form[key]}
                    onChange={f(key)}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              ))}

              {(["password", "confirmPassword"] as const).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {key === "password"
                      ? isRTL ? "رمز عبور" : "Password"
                      : isRTL ? "تکرار رمز عبور" : "Confirm Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      minLength={8}
                      value={form[key]}
                      onChange={f(key)}
                      placeholder="حداقل ۸ کاراکتر"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pe-12 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    {key === "password" && (
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-400">
                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 rounded" />
                <span>
                  {isRTL ? "با " : "I agree to the "}
                  <Link href="#" className="text-primary-600 underline">{isRTL ? "شرایط استفاده" : "Terms of Service"}</Link>
                  {isRTL ? " موافقم" : ""}
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isRTL ? "ثبت‌نام" : "Register"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            {isRTL ? "قبلاً ثبت‌نام کرده‌اید؟ " : "Already have an account? "}
            <Link href={`/${locale}/auth/login`} className="text-primary-600 font-medium">
              {isRTL ? "وارد شوید" : "Sign In"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
