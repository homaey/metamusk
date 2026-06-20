"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { Save, User, Phone, Mail, Lock, Eye, EyeOff, CheckCircle, Camera, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const locale = useLocale();
  const isRTL = locale === "fa";

  const [form, setForm] = useState({ name: "", phone: "" });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name ?? "",
        phone: (session.user as any).phone ?? "",
      });
      setAvatar((session.user as any).avatar ?? null);
    }
  }, [session]);

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAvatar(data.avatarUrl);
      await update({ image: data.avatarUrl });
    } catch (err: any) {
      setMsg({ type: "err", text: err.message });
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await update({ name: form.name });
      setMsg({ type: "ok", text: isRTL ? "اطلاعات با موفقیت ذخیره شد" : "Profile updated successfully" });
    } catch (err: any) {
      setMsg({ type: "err", text: err.message ?? (isRTL ? "خطای سرور" : "Server error") });
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "err", text: isRTL ? "رمزهای جدید مطابقت ندارند" : "Passwords don't match" });
      return;
    }
    setSavingPw(true);
    setPwMsg(null);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: pwForm.current, next: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwMsg({ type: "ok", text: isRTL ? "رمز عبور تغییر یافت" : "Password changed successfully" });
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      setPwMsg({ type: "err", text: err.message ?? (isRTL ? "خطای سرور" : "Server error") });
    } finally {
      setSavingPw(false);
    }
  }

  const role = (session?.user as any)?.role;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? "پروفایل من" : "My Profile"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isRTL ? "اطلاعات شخصی خود را ویرایش کنید" : "Edit your personal information"}
        </p>
      </div>

      {/* آواتار با آپلود */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="avatar" className="w-16 h-16 rounded-2xl object-cover" />
          ) : (
            <div className="w-16 h-16 bg-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {session?.user?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -end-1 w-6 h-6 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center shadow-md transition-colors"
          >
            {uploadingAvatar
              ? <Loader2 className="w-3 h-3 text-white animate-spin" />
              : <Camera className="w-3 h-3 text-white" />}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={uploadAvatar}
          />
        </div>
        <div>
          <div className="font-bold text-gray-900">{session?.user?.name}</div>
          <div className="text-sm text-gray-500">{session?.user?.email}</div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
            role === "ADMIN" ? "bg-red-100 text-red-700" :
            role === "LAWYER" ? "bg-gold-100 text-gold-700" :
            "bg-blue-100 text-blue-700"
          }`}>
            {role === "ADMIN" ? (isRTL ? "ادمین" : "Admin") :
             role === "LAWYER" ? (isRTL ? "وکیل" : "Lawyer") :
             (isRTL ? "موکل" : "Client")}
          </span>
        </div>
      </div>

      {/* اطلاعات اصلی */}
      <form onSubmit={saveProfile} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <User className="w-4 h-4 text-primary-600" />
          {isRTL ? "اطلاعات شخصی" : "Personal Information"}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {isRTL ? "نام و نام خانوادگی" : "Full Name"} *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            minLength={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder={isRTL ? "نام کامل" : "Full name"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <Mail className="inline w-3.5 h-3.5 me-1" />
            {isRTL ? "ایمیل" : "Email"}
          </label>
          <input
            type="email"
            value={session?.user?.email ?? ""}
            disabled
            className="w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">{isRTL ? "ایمیل قابل تغییر نیست" : "Email cannot be changed"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <Phone className="inline w-3.5 h-3.5 me-1" />
            {isRTL ? "شماره موبایل" : "Phone Number"}
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            pattern="^09\d{9}$"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="09xxxxxxxxx"
            dir="ltr"
          />
        </div>

        {msg && (
          <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${
            msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {msg.type === "ok" && <CheckCircle className="w-4 h-4 shrink-0" />}
            {msg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? (isRTL ? "در حال ذخیره..." : "Saving...") : (isRTL ? "ذخیره تغییرات" : "Save Changes")}
        </button>
      </form>

      {/* تغییر رمز */}
      <form onSubmit={savePassword} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary-600" />
          {isRTL ? "تغییر رمز عبور" : "Change Password"}
        </h2>

        {(["current", "next", "confirm"] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field === "current"
                ? (isRTL ? "رمز فعلی" : "Current Password")
                : field === "next"
                ? (isRTL ? "رمز جدید" : "New Password")
                : (isRTL ? "تکرار رمز جدید" : "Confirm New Password")}
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pwForm[field]}
                onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
                required
                minLength={field === "current" ? 1 : 8}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                dir="ltr"
              />
              {field === "next" && (
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute inset-y-0 end-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {pwMsg && (
          <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${
            pwMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {pwMsg.type === "ok" && <CheckCircle className="w-4 h-4 shrink-0" />}
            {pwMsg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={savingPw}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Lock className="w-4 h-4" />
          {savingPw ? (isRTL ? "در حال تغییر..." : "Changing...") : (isRTL ? "تغییر رمز" : "Change Password")}
        </button>
      </form>
    </div>
  );
}
