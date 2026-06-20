import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Settings, Shield, Database, Globe } from "lucide-react";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") {
    redirect(`/${locale}/dashboard`);
  }

  const isRTL = locale === "fa";

  const items = [
    {
      icon: Shield,
      title: isRTL ? "امنیت" : "Security",
      desc: isRTL ? "تنظیمات احراز هویت و دسترسی" : "Auth and access settings",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Globe,
      title: isRTL ? "سایت" : "Site",
      desc: isRTL ? "نام، لوگو و اطلاعات تماس" : "Name, logo and contact info",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Database,
      title: isRTL ? "دیتابیس" : "Database",
      desc: isRTL ? "پشتیبان‌گیری و بازیابی" : "Backup and restore",
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          {isRTL ? "تنظیمات سایت" : "Site Settings"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isRTL ? "مدیریت تنظیمات کلی سیستم" : "Manage general system settings"}
        </p>
      </div>

      <div className="grid gap-4">
        {items.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
              {isRTL ? "به زودی" : "Coming soon"}
            </span>
          </div>
        ))}
      </div>

      {/* Current env info */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">{isRTL ? "اطلاعات محیط" : "Environment Info"}</h3>
        <dl className="space-y-2 text-xs">
          <div className="flex justify-between">
            <dt className="text-gray-500">Node ENV</dt>
            <dd className="font-mono text-gray-700">{process.env.NODE_ENV}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Database</dt>
            <dd className="font-mono text-gray-700">SQLite (dev)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Next.js</dt>
            <dd className="font-mono text-gray-700">14</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
