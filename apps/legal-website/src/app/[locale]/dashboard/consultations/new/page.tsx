"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  Phone, Video, MapPin, Calendar, Clock,
  ChevronRight, ChevronLeft, CheckCircle, ArrowRight, ArrowLeft,
} from "lucide-react";

const TYPES = [
  { id: "PHONE",    iconFa: "تلفنی",  iconEn: "Phone Call", Icon: Phone,   desc_fa: "مشاوره از طریق تماس تلفنی", desc_en: "Consultation via phone call" },
  { id: "ONLINE",   iconFa: "آنلاین",  iconEn: "Video Call", Icon: Video,   desc_fa: "جلسه ویدیویی آنلاین",        desc_en: "Online video session" },
  { id: "INPERSON", iconFa: "حضوری",  iconEn: "In-Person",  Icon: MapPin,  desc_fa: "حضور در دفتر وکیل",          desc_en: "Visit lawyer's office" },
];

const TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

function getDaysAhead(n: number) {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 5) days.push(d); // جمعه تعطیل
  }
  return days;
}

export default function NewConsultationPage() {
  const locale = useLocale();
  const isRTL = locale === "fa";
  const router = useRouter();
  const searchParams = useSearchParams();
  const Arrow = isRTL ? ChevronLeft : ChevronRight;
  const NavArrow = isRTL ? ArrowLeft : ArrowRight;

  const lawyerIdParam = searchParams.get("lawyerId") ?? "";
  const [lawyerName, setLawyerName] = useState("");
  const [consultFee, setConsultFee] = useState(0);

  const [step, setStep] = useState(1); // 1: نوع | 2: تاریخ/وقت | 3: تأیید
  const [type, setType] = useState("");
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const days = getDaysAhead(14);

  useEffect(() => {
    if (!lawyerIdParam) return;
    fetch(`/api/lawyers/${lawyerIdParam}`)
      .then(r => r.json())
      .then(d => {
        if (d.lawyer) {
          setLawyerName(d.lawyer.user?.name ?? "");
          setConsultFee(d.lawyer.consultFee ?? 0);
        }
      })
      .catch(() => {});
  }, [lawyerIdParam]);

  async function submit() {
    if (!day || !time || !type || !lawyerIdParam) return;
    setLoading(true);
    setError("");
    const [h, m] = time.split(":").map(Number);
    const scheduledAt = new Date(day);
    scheduledAt.setHours(h, m, 0, 0);

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawyerId: lawyerIdParam, type, scheduledAt: scheduledAt.toISOString(), notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      setTimeout(() => router.push(`/${locale}/dashboard/consultations`), 2500);
    } catch (e: any) {
      setError(e.message ?? (isRTL ? "خطای سرور" : "Server error"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{isRTL ? "درخواست ثبت شد!" : "Consultation Requested!"}</h2>
        <p className="text-gray-500 text-sm">{isRTL ? "در حال انتقال به لیست مشاوره‌ها..." : "Redirecting to consultations..."}</p>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/${locale}/dashboard/consultations`} className="text-gray-400 hover:text-gray-600">
          <NavArrow className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isRTL ? "رزرو مشاوره" : "Book Consultation"}</h1>
          {lawyerName && (
            <p className="text-sm text-gray-500 mt-0.5">
              {isRTL ? `با وکیل ${lawyerName}` : `With ${lawyerName}`}
            </p>
          )}
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= s ? "bg-primary-700 text-white" : "bg-gray-200 text-gray-500"
            }`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-12 transition-colors ${step > s ? "bg-primary-700" : "bg-gray-200"}`} />}
          </div>
        ))}
        <div className="ms-3 text-sm text-gray-500">
          {step === 1 ? (isRTL ? "نوع مشاوره" : "Type") :
           step === 2 ? (isRTL ? "زمان‌بندی"  : "Schedule") :
                        (isRTL ? "تأیید نهایی" : "Confirm")}
        </div>
      </div>

      {/* Step 1 — نوع مشاوره */}
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-800">{isRTL ? "نوع مشاوره را انتخاب کنید" : "Choose consultation type"}</h2>
          {TYPES.map(({ id, iconFa, iconEn, Icon, desc_fa, desc_en }) => (
            <button
              key={id}
              onClick={() => { setType(id); setStep(2); }}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-start ${
                type === id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-100 bg-white hover:border-primary-200"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                type === id ? "bg-primary-700 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{isRTL ? iconFa : iconEn}</div>
                <div className="text-sm text-gray-500 mt-0.5">{isRTL ? desc_fa : desc_en}</div>
              </div>
              <Arrow className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* Step 2 — تاریخ و ساعت */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-semibold text-gray-800">{isRTL ? "تاریخ و ساعت را انتخاب کنید" : "Select date and time"}</h2>

          {/* Days */}
          <div>
            <p className="text-sm text-gray-500 mb-2">{isRTL ? "تاریخ جلسه" : "Session date"}</p>
            <div className="grid grid-cols-4 gap-2">
              {days.slice(0, 12).map((d, i) => {
                const isSelected = day?.toDateString() === d.toDateString();
                return (
                  <button
                    key={i}
                    onClick={() => setDay(d)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "border-primary-500 bg-primary-50 text-primary-800"
                        : "border-gray-100 bg-white hover:border-primary-200"
                    }`}
                  >
                    <div className="text-xs text-gray-500">
                      {d.toLocaleDateString(isRTL ? "fa-IR" : "en-US", { weekday: "short" })}
                    </div>
                    <div className="font-bold text-sm mt-0.5">
                      {d.toLocaleDateString(isRTL ? "fa-IR" : "en-US", { day: "numeric" })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {d.toLocaleDateString(isRTL ? "fa-IR" : "en-US", { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Times */}
          {day && (
            <div>
              <p className="text-sm text-gray-500 mb-2">{isRTL ? "ساعت جلسه" : "Session time"}</p>
              <div className="grid grid-cols-4 gap-2">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      time === t
                        ? "border-primary-500 bg-primary-700 text-white"
                        : "border-gray-100 bg-white hover:border-primary-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isRTL ? "توضیحات (اختیاری)" : "Notes (optional)"}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
              placeholder={isRTL ? "موضوع مشاوره را به اختصار بنویسید..." : "Briefly describe your consultation topic..."}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              {isRTL ? "قبلی" : "Back"}
            </button>
            <button
              onClick={() => day && time && setStep(3)}
              disabled={!day || !time}
              className="flex-2 flex-1 py-2.5 bg-primary-700 hover:bg-primary-800 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isRTL ? "بعدی" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — تأیید */}
      {step === 3 && day && time && (
        <div className="space-y-5">
          <h2 className="font-semibold text-gray-800">{isRTL ? "تأیید نهایی درخواست" : "Confirm your booking"}</h2>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            {[
              {
                label: isRTL ? "وکیل" : "Lawyer",
                value: lawyerName || "—",
              },
              {
                label: isRTL ? "نوع مشاوره" : "Type",
                value: isRTL
                  ? TYPES.find(t => t.id === type)?.iconFa
                  : TYPES.find(t => t.id === type)?.iconEn,
              },
              {
                label: isRTL ? "تاریخ" : "Date",
                value: day.toLocaleDateString(isRTL ? "fa-IR" : "en-US", { dateStyle: "long" }),
              },
              {
                label: isRTL ? "ساعت" : "Time",
                value: time,
              },
              {
                label: isRTL ? "مدت" : "Duration",
                value: isRTL ? "۶۰ دقیقه" : "60 minutes",
              },
              ...(consultFee > 0 ? [{
                label: isRTL ? "هزینه" : "Fee",
                value: `${consultFee.toLocaleString(isRTL ? "fa-IR" : "en-US")} ${isRTL ? "تومان" : "IRR"}`,
              }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}

            {notes && (
              <div className="pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400 mb-1">{isRTL ? "توضیحات:" : "Notes:"}</p>
                <p className="text-sm text-gray-600">{notes}</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              {isRTL ? "قبلی" : "Back"}
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
            >
              {loading
                ? (isRTL ? "در حال ثبت..." : "Booking...")
                : (isRTL ? "ثبت مشاوره" : "Confirm Booking")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
