import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckCircle2, XCircle, Clock, User, Award, Phone } from "lucide-react";
import LawyerApprovalActions from "@/components/dashboard/LawyerApprovalActions";

export default async function AdminLawyersPage({
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

  const lawyers = await db.lawyer.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      user: { select: { name: true, email: true, phone: true, createdAt: true } },
    },
  });

  const statusInfo = {
    PENDING: { label: isRTL ? "در انتظار" : "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
    APPROVED: { label: isRTL ? "تأیید شده" : "Approved", icon: CheckCircle2, color: "bg-green-100 text-green-700" },
    REJECTED: { label: isRTL ? "رد شده" : "Rejected", icon: XCircle, color: "bg-red-100 text-red-700" },
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? "مدیریت وکلا" : "Lawyer Management"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isRTL ? `${lawyers.filter((l: any) => l.status === "PENDING").length} درخواست در انتظار تأیید` : `${lawyers.filter((l: any) => l.status === "PENDING").length} requests pending approval`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {lawyers.map((lawyer: any) => {
          const { label, icon: Icon, color } = statusInfo[lawyer.status as keyof typeof statusInfo];
          return (
            <div key={lawyer.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-bold shrink-0">
                    {lawyer.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{lawyer.user.name}</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${color}`}>
                        <Icon className="w-3 h-3" />
                        {label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{lawyer.user.email}</span>
                      {lawyer.user.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{lawyer.user.phone}</span>}
                      <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" />{isRTL ? "پروانه:" : "Bar #:"} {lawyer.barNumber}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(JSON.parse(lawyer.specialtiesFA || "[]") as string[]).map((s: string, i: number) => (
                        <span key={s} className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded-md">
                          {isRTL ? s : (JSON.parse(lawyer.specialtiesEN || "[]") as string[])[i] ?? s}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {isRTL ? "تجربه:" : "Experience:"} {lawyer.experience} {isRTL ? "سال" : "years"}
                      {" | "}
                      {isRTL ? "ثبت‌نام:" : "Registered:"} {new Date(lawyer.createdAt).toLocaleDateString(isRTL ? "fa-IR" : "en-US")}
                    </p>
                  </div>
                </div>

                {lawyer.status === "PENDING" && (
                  <LawyerApprovalActions lawyerId={lawyer.id} locale={locale} />
                )}
              </div>

              {lawyer.bioFA && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs text-gray-500 line-clamp-2">{isRTL ? lawyer.bioFA : lawyer.bioEN}</p>
                </div>
              )}
            </div>
          );
        })}

        {lawyers.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{isRTL ? "هیچ وکیلی یافت نشد" : "No lawyers found"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
