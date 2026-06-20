"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale } from "next-intl";
import { Scale, Loader2, CheckCircle2, ChevronRight, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const SPECIALTIES_FA = [
  "حقوق مدنی", "حقوق کیفری", "حقوق تجاری", "حقوق خانواده",
  "امور ملکی", "حقوق بین‌الملل", "حقوق کار", "حقوق اداری",
  "حقوق شرکت‌ها", "داوری تجاری",
];
const SPECIALTIES_EN = [
  "Civil Law", "Criminal Law", "Commercial Law", "Family Law",
  "Property Law", "International Law", "Labor Law", "Administrative Law",
  "Corporate Law", "Commercial Arbitration",
];

export default function RegisterLawyerPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "fa";
  const Arrow = isRTL ? ChevronLeft : ChevronRight;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [account, setAccount] = useState({ name: "", email: "", phone: "", password: "" });
  const [profile, setProfile] = useState({
    barNumber: "",
    experience: "",
    education: "",
    consultFee: "",
    specialties: [] as number[],
    bioFA: "",
    bioEN: "",
  });

  const totalSteps = 3;

  function toggleSpecialty(idx: number) {
    setProfile(p => ({
      ...p,
      specialties: p.specialties.includes(idx)
        ? p.specialties.filter(i => i !== idx)
        : [...p.specialties, idx],
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    // Step 1: ثبت‌نام حساب کاربری
    const regRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...account, role: "LAWYER" }),
    });
    if (!regRes.ok) {
      const d = await regRes.json();
      setError(d.error);
      setLoading(false);
      return;
    }

    // Step 2: ورود خودکار
    await signIn("credentials", { email: account.email, password: account.password, redirect: false });

    // Step 3: ثبت پروفایل وکیل
    const lawyerRes = await fetch("/api/lawyers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barNumber: profile.barNumber,
        experience: parseInt(profile.experience),
        education: profile.education,
        consultFee: parseInt(profile.consultFee),
        specialtiesFA: profile.specialties.map(i => SPECIALTIES_FA[i]),
        specialtiesEN: profile.specialties.map(i => SPECIALTIES_EN[i]),
        bioFA: profile.bioFA,
        bioEN: profile.bioEN,
      }),
    });

    setLoading(false);

    if (!lawyerRes.ok) {
      const d = await lawyerRes.json();
      setError(d.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push(`/${locale}/dashboard`), 2000);
  }

  const steps = [
    isRTL ? "اطلاعات حساب" : "Account Info",
    isRTL ? "پروفایل حقوقی" : "Legal Profile",
    isRTL ? "تأیید اطلاعات" : "Confirmation",
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isRTL ? "ثبت‌نام وکیل" : "Lawyer Registration"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isRTL ? "پس از تأیید ادمین، پروفایل شما فعال می‌شود" : "Your profile will be activated after admin approval"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                step > i + 1 ? "bg-green-500 text-white" :
                step === i + 1 ? "bg-gold-500 text-white" :
                "bg-white/20 text-white/50"
              )}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={cn("text-xs hidden sm:block", step === i + 1 ? "text-white" : "text-white/50")}>
                {s}
              </span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-white/20 mx-1" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {isRTL ? "درخواست ثبت شد!" : "Request Submitted!"}
              </h2>
              <p className="text-gray-500 text-sm">
                {isRTL
                  ? "مدارک شما بررسی می‌شود. پس از تأیید ادمین اطلاع‌رسانی می‌شوید."
                  : "Your documents are being reviewed. You will be notified after admin approval."}
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              {/* Step 1: اطلاعات حساب */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-bold text-gray-900 mb-4">{steps[0]}</h2>
                  {[
                    { key: "name" as const, label: isRTL ? "نام کامل" : "Full Name", type: "text" },
                    { key: "email" as const, label: "Email", type: "email" },
                    { key: "phone" as const, label: isRTL ? "موبایل" : "Mobile", type: "tel" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <input
                        type={type}
                        required
                        value={account[key]}
                        onChange={e => setAccount(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {isRTL ? "رمز عبور" : "Password"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        minLength={8}
                        value={account.password}
                        onChange={e => setAccount(p => ({ ...p, password: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 pe-12 text-sm focus:outline-none focus:border-primary-500"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-400">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: پروفایل حقوقی */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-bold text-gray-900 mb-4">{steps[1]}</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {isRTL ? "شماره پروانه" : "Bar Number"}
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.barNumber}
                        onChange={e => setProfile(p => ({ ...p, barNumber: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {isRTL ? "سال تجربه" : "Years of Experience"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        required
                        value={profile.experience}
                        onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {isRTL ? "تحصیلات" : "Education"}
                    </label>
                    <input
                      type="text"
                      value={profile.education}
                      onChange={e => setProfile(p => ({ ...p, education: e.target.value }))}
                      placeholder={isRTL ? "دکترا حقوق — دانشگاه تهران" : "PhD Law — University of Tehran"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? "تخصص‌ها (حداقل یک مورد)" : "Specialties (at least one)"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTIES_FA.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleSpecialty(i)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                            profile.specialties.includes(i)
                              ? "bg-primary-700 border-primary-700 text-white"
                              : "border-gray-200 text-gray-600 hover:border-primary-400"
                          )}
                        >
                          {isRTL ? s : SPECIALTIES_EN[i]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {isRTL ? "بیوگرافی (فارسی)" : "Biography (Persian)"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      minLength={50}
                      value={profile.bioFA}
                      onChange={e => setProfile(p => ({ ...p, bioFA: e.target.value }))}
                      placeholder={isRTL ? "معرفی مختصر تخصص و تجربه خود..." : "Brief introduction in Persian..."}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {isRTL ? "تعرفه مشاوره (تومان)" : "Consultation Fee (IRR)"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={profile.consultFee}
                      onChange={e => setProfile(p => ({ ...p, consultFee: e.target.value }))}
                      placeholder="500000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: تأیید */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-bold text-gray-900 mb-4">{steps[2]}</h2>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    {[
                      [isRTL ? "نام" : "Name", account.name],
                      [isRTL ? "ایمیل" : "Email", account.email],
                      [isRTL ? "موبایل" : "Mobile", account.phone],
                      [isRTL ? "شماره پروانه" : "Bar #", profile.barNumber],
                      [isRTL ? "تجربه" : "Experience", `${profile.experience} ${isRTL ? "سال" : "years"}`],
                      [isRTL ? "تخصص‌ها" : "Specialties", profile.specialties.map(i => isRTL ? SPECIALTIES_FA[i] : SPECIALTIES_EN[i]).join("، ")],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-gray-500 shrink-0">{k}:</span>
                        <span className="text-gray-800 text-end">{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-xs text-gold-700">
                    {isRTL
                      ? "پس از ارسال، مدارک شما توسط ادمین بررسی می‌شود. معمولاً ۲۴-۴۸ ساعت طول می‌کشد."
                      : "After submission, your documents will be reviewed by admin. Usually takes 24-48 hours."}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:border-gray-300 transition-colors"
                  >
                    {isRTL ? "قبلی" : "Previous"}
                  </button>
                ) : (
                  <Link
                    href={`/${locale}/auth/login`}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-center hover:border-gray-300 transition-colors"
                  >
                    {isRTL ? "انصراف" : "Cancel"}
                  </Link>
                )}

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    className="flex-1 bg-primary-700 hover:bg-primary-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    {isRTL ? "بعدی" : "Next"}
                    <Arrow className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isRTL ? "ارسال درخواست" : "Submit Request"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
