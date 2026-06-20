import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Calendar, Clock, Phone, Video, MapPin, ChevronRight, ChevronLeft, Plus } from "lucide-react";

type Params = { params: Promise<{ locale: string }> };

const TYPE_ICON = { PHONE: Phone, ONLINE: Video, INPERSON: MapPin };

export default async function ConsultationsPage({ params }: Params) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const isRTL = locale === "fa";
  const role = (session.user as any).role as string;
  const userId = (session.user as any).id as string;
  const lawyerId = (session.user as any).lawyerId as string | null;
  const Arrow = isRTL ? ChevronLeft : ChevronRight;

  const where =
    role === "CLIENT"
      ? { clientId: userId }
      : role === "LAWYER" && lawyerId
      ? { lawyerId }
      : {};

  const consultations = await db.consultation.findMany({
    where,
    orderBy: { scheduledAt: "desc" },
    include: {
      client: { select: { name: true, phone: true } },
      lawyer: { include: { user: { select: { name: true } } } },
    },
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING:   { label: isRTL ? "در انتظار"   : "Pending",   color: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: isRTL ? "تأیید شده"   : "Confirmed", color: "bg-blue-100 text-blue-700"    },
    COMPLETED: { label: isRTL ? "انجام شده"   : "Completed", color: "bg-green-100 text-green-700"  },
    CANCELLED: { label: isRTL ? "لغو شده"     : "Cancelled", color: "bg-red-100 text-red-700"      },
  };

  const typeMap: Record<string, string> = {
    PHONE:    isRTL ? "تلفنی"    : "Phone",
    ONLINE:   isRTL ? "آنلاین"   : "Online",
    INPERSON: isRTL ? "حضوری"    : "In-Person",
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? "مشاوره‌های من" : "My Consultations"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {consultations.length} {isRTL ? "مشاوره" : "consultations"}
          </p>
        </div>
        {role === "CLIENT" && (
          <Link
            href={`/${locale}/lawyers`}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isRTL ? "درخواست مشاوره" : "New Consultation"}
          </Link>
        )}
      </div>

      {consultations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">{isRTL ? "هیچ مشاوره‌ای وجود ندارد" : "No consultations yet"}</p>
          {role === "CLIENT" && (
            <Link href={`/${locale}/lawyers`} className="mt-4 inline-flex items-center gap-1.5 text-primary-600 text-sm font-medium">
              <Plus className="w-4 h-4" />
              {isRTL ? "رزرو اولین مشاوره" : "Book your first consultation"}
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => {
            const st = statusMap[c.status] ?? { label: c.status, color: "bg-gray-100 text-gray-600" };
            const TypeIcon = TYPE_ICON[c.type as keyof typeof TYPE_ICON] ?? Calendar;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {role === "CLIENT"
                            ? (isRTL ? "وکیل: " : "Lawyer: ") + c.lawyer.user.name
                            : (isRTL ? "موکل: " : "Client: ") + c.client.name}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(c.scheduledAt).toLocaleDateString(isRTL ? "fa-IR" : "en-US", { dateStyle: "medium" })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(c.scheduledAt).toLocaleTimeString(isRTL ? "fa-IR" : "en-US", { timeStyle: "short" })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <TypeIcon className="w-3.5 h-3.5" />
                          {typeMap[c.type]}
                        </span>
                      </div>
                      {c.notes && (
                        <p className="mt-2 text-sm text-gray-400 line-clamp-1">{c.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-lg font-bold text-primary-800">
                      {c.fee.toLocaleString(isRTL ? "fa-IR" : "en-US")}
                      <span className="text-xs text-gray-400 font-normal me-1">{isRTL ? " ت" : " IRR"}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {c.duration} {isRTL ? "دقیقه" : "min"}
                    </p>
                  </div>
                </div>
                {c.meetLink && c.status === "CONFIRMED" && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <a
                      href={c.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      {isRTL ? "ورود به جلسه آنلاین" : "Join Online Meeting"}
                      <Arrow className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
