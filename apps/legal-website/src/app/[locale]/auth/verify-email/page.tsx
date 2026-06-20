"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Scale, Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const locale = useLocale();
  const isRTL = locale === "fa";
  const searchParams = useSearchParams();

  const success = searchParams.get("success") === "1";
  const error = searchParams.get("error");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  async function resend() {
    setSending(true);
    setSendError("");
    try {
      const res = await fetch(`/api/auth/send-verification?locale=${locale}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (e: any) {
      setSendError(e.message ?? (isRTL ? "خطای سرور" : "Server error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          {/* Logo */}
          <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-7 h-7 text-white" />
          </div>

          {success ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {isRTL ? "ایمیل تأیید شد!" : "Email Verified!"}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {isRTL
                  ? "ایمیل شما با موفقیت تأیید شد. اکنون به تمام امکانات دسترسی دارید."
                  : "Your email has been verified. You now have full access."}
              </p>
              <Link
                href={`/${locale}/dashboard`}
                className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                {isRTL ? "رفتن به داشبورد" : "Go to Dashboard"}
              </Link>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {isRTL ? "لینک نامعتبر یا منقضی شده" : "Invalid or Expired Link"}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {isRTL
                  ? "این لینک تأیید منقضی شده یا قبلاً استفاده شده است."
                  : "This verification link has expired or already been used."}
              </p>
              {sent ? (
                <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">
                  {isRTL ? "لینک جدید ارسال شد. ایمیل خود را بررسی کنید." : "New link sent. Please check your email."}
                </div>
              ) : (
                <button
                  onClick={resend}
                  disabled={sending}
                  className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isRTL ? "ارسال مجدد لینک" : "Resend Link"}
                </button>
              )}
              {sendError && <p className="text-red-500 text-sm mt-3">{sendError}</p>}
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {isRTL ? "ایمیل خود را تأیید کنید" : "Verify Your Email"}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {isRTL
                  ? "یک لینک تأیید برای شما ارسال شده است. ایمیل خود را بررسی کنید."
                  : "A verification link has been sent to your email. Please check your inbox."}
              </p>
              {sent ? (
                <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">
                  {isRTL ? "لینک جدید ارسال شد." : "New link sent."}
                </div>
              ) : (
                <button
                  onClick={resend}
                  disabled={sending}
                  className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors text-sm"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isRTL ? "ارسال مجدد" : "Resend"}
                </button>
              )}
              {sendError && <p className="text-red-500 text-sm mt-3">{sendError}</p>}
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link href={`/${locale}/dashboard`} className="text-sm text-gray-400 hover:text-gray-600">
              {isRTL ? "بازگشت به داشبورد" : "Back to Dashboard"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
