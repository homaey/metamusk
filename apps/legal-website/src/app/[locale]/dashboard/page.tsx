import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { FileText, Calendar, Clock, CheckCircle2, AlertCircle, TrendingUp, Mail } from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === "fa";
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;
  const lawyerId = (session?.user as any)?.lawyerId;

  // بررسی تأیید ایمیل
  const dbUser = userId
    ? await db.user.findUnique({ where: { id: userId }, select: { emailVerified: true } })
    : null;
  const emailVerified = !!dbUser?.emailVerified;

  // آمار داینامیک بر اساس نقش
  let stats: { label: string; value: number | string; icon: any; color: string }[] = [];
  let recentActivity: any[] = [];

  if (role === "CLIENT") {
    const [consultCount, docCount, pendingDoc] = await Promise.all([
      db.consultation.count({ where: { clientId: userId } }),
      db.documentRequest.count({ where: { clientId: userId } }),
      db.documentRequest.count({ where: { clientId: userId, status: { in: ["SUBMITTED", "REVIEWING", "IN_PROGRESS"] } } }),
    ]);

    stats = [
      { label: isRTL ? "مشاوره‌ها" : "Consultations", value: consultCount, icon: Calendar, color: "bg-blue-50 text-blue-600" },
      { label: isRTL ? "اوراق قضایی" : "Documents", value: docCount, icon: FileText, color: "bg-purple-50 text-purple-600" },
      { label: isRTL ? "در دست بررسی" : "Pending", value: pendingDoc, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
    ];

    recentActivity = await db.documentRequest.findMany({
      where: { clientId: userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, type: true, subject: true, status: true, createdAt: true },
    });
  }

  if (role === "LAWYER" && lawyerId) {
    const [consultCount, docCount, pendingConsult] = await Promise.all([
      db.consultation.count({ where: { lawyerId } }),
      db.documentRequest.count({ where: { lawyerId } }),
      db.consultation.count({ where: { lawyerId, status: "PENDING" } }),
    ]);

    stats = [
      { label: isRTL ? "مشاوره‌ها" : "Consultations", value: consultCount, icon: Calendar, color: "bg-blue-50 text-blue-600" },
      { label: isRTL ? "اوراق" : "Documents", value: docCount, icon: FileText, color: "bg-purple-50 text-purple-600" },
      { label: isRTL ? "منتظر تأیید" : "Awaiting Approval", value: pendingConsult, icon: AlertCircle, color: "bg-yellow-50 text-yellow-600" },
    ];

    recentActivity = await db.consultation.findMany({
      where: { lawyerId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true } } },
    });
  }

  if (role === "ADMIN") {
    const [users, lawyers, pendingLawyers, consultations] = await Promise.all([
      db.user.count(),
      db.lawyer.count({ where: { status: "APPROVED" } }),
      db.lawyer.count({ where: { status: "PENDING" } }),
      db.consultation.count(),
    ]);

    stats = [
      { label: isRTL ? "کاربران" : "Users", value: users, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
      { label: isRTL ? "وکلا" : "Lawyers", value: lawyers, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
      { label: isRTL ? "وکلا در انتظار" : "Pending Lawyers", value: pendingLawyers, icon: AlertCircle, color: "bg-yellow-50 text-yellow-600" },
      { label: isRTL ? "مشاوره‌ها" : "Consultations", value: consultations, icon: Calendar, color: "bg-purple-50 text-purple-600" },
    ];
  }

  const docTypeLabel: Record<string, string> = {
    NOTICE: isRTL ? "اظهارنامه" : "Notice",
    PETITION: isRTL ? "دادخواست" : "Petition",
    COMPLAINT: isRTL ? "شکواییه" : "Complaint",
    BRIEF: isRTL ? "لایحه" : "Brief",
  };

  const statusLabel: Record<string, string> = {
    SUBMITTED: isRTL ? "ثبت شده" : "Submitted",
    REVIEWING: isRTL ? "در بررسی" : "Reviewing",
    IN_PROGRESS: isRTL ? "در حال انجام" : "In Progress",
    READY: isRTL ? "آماده" : "Ready",
    DELIVERED: isRTL ? "تحویل شده" : "Delivered",
    PENDING: isRTL ? "در انتظار" : "Pending",
    CONFIRMED: isRTL ? "تأیید شده" : "Confirmed",
    COMPLETED: isRTL ? "تکمیل شده" : "Completed",
    CANCELLED: isRTL ? "لغو شده" : "Cancelled",
  };

  const statusColor: Record<string, string> = {
    SUBMITTED: "bg-blue-100 text-blue-700",
    REVIEWING: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-orange-100 text-orange-700",
    READY: "bg-green-100 text-green-700",
    DELIVERED: "bg-gray-100 text-gray-600",
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? `خوش آمدید، ${session?.user?.name}` : `Welcome, ${session?.user?.name}`}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString(isRTL ? "fa-IR" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* بنر تأیید ایمیل */}
      {!emailVerified && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-semibold text-blue-800 text-sm">
                {isRTL ? "ایمیل خود را تأیید کنید" : "Verify your email"}
              </p>
              <p className="text-blue-600 text-xs mt-0.5">
                {isRTL ? "برای امنیت بیشتر، ایمیل خود را تأیید کنید" : "Verify your email for better security"}
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/auth/verify-email`}
            className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            {isRTL ? "تأیید ایمیل" : "Verify Now"}
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">
              {isRTL ? "فعالیت‌های اخیر" : "Recent Activity"}
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((item: any) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.subject ?? item.client?.name ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.type ? docTypeLabel[item.type] : isRTL ? "مشاوره" : "Consultation"}
                    {" · "}
                    {new Date(item.createdAt).toLocaleDateString(isRTL ? "fa-IR" : "en-US")}
                  </p>
                </div>
                {item.status && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusColor[item.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {statusLabel[item.status] ?? item.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lawyer pending notice */}
      {role === "LAWYER" && (session?.user as any)?.lawyerStatus === "PENDING" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">
              {isRTL ? "حساب شما در انتظار تأیید است" : "Your account is pending approval"}
            </h3>
            <p className="text-yellow-700 text-sm mt-1">
              {isRTL
                ? "مدارک شما توسط ادمین بررسی می‌شود. معمولاً ۲۴ تا ۴۸ ساعت طول می‌کشد."
                : "Your documents are being reviewed by admin. Usually takes 24-48 hours."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
