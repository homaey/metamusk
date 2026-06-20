import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { FileText, Clock, Plus, ChevronRight, ChevronLeft, Eye } from "lucide-react";

type Params = { params: Promise<{ locale: string }> };

export default async function DocumentsPage({ params }: Params) {
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

  const docs = await db.documentRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, phone: true } },
      lawyer: { include: { user: { select: { name: true } } } },
    },
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    SUBMITTED:   { label: isRTL ? "ثبت شده"        : "Submitted",   color: "bg-gray-100 text-gray-600"    },
    REVIEWING:   { label: isRTL ? "در حال بررسی"   : "Reviewing",   color: "bg-yellow-100 text-yellow-700" },
    IN_PROGRESS: { label: isRTL ? "در حال تهیه"    : "In Progress", color: "bg-blue-100 text-blue-700"    },
    READY:       { label: isRTL ? "آماده تحویل"    : "Ready",       color: "bg-green-100 text-green-700"  },
    DELIVERED:   { label: isRTL ? "تحویل داده شد"  : "Delivered",   color: "bg-primary-100 text-primary-700" },
  };

  const typeMap: Record<string, string> = {
    NOTICE:    isRTL ? "اظهارنامه"  : "Legal Notice",
    PETITION:  isRTL ? "دادخواست"   : "Petition",
    COMPLAINT: isRTL ? "شکواییه"    : "Complaint",
    BRIEF:     isRTL ? "لایحه"      : "Legal Brief",
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? "اوراق قضایی" : "Legal Documents"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {docs.length} {isRTL ? "درخواست" : "requests"}
          </p>
        </div>
        {role === "CLIENT" && (
          <Link
            href={`/${locale}/dashboard/documents/new`}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isRTL ? "درخواست جدید" : "New Request"}
          </Link>
        )}
      </div>

      {docs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">{isRTL ? "هیچ درخواستی وجود ندارد" : "No document requests yet"}</p>
          {role === "CLIENT" && (
            <Link
              href={`/${locale}/dashboard/documents/new`}
              className="mt-4 inline-flex items-center gap-1.5 text-primary-600 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              {isRTL ? "ثبت اولین درخواست" : "Submit your first request"}
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-start">{isRTL ? "موضوع" : "Subject"}</th>
                <th className="px-6 py-3 text-start">{isRTL ? "نوع" : "Type"}</th>
                {role !== "CLIENT" && <th className="px-6 py-3 text-start">{isRTL ? "موکل" : "Client"}</th>}
                {role === "CLIENT" && <th className="px-6 py-3 text-start">{isRTL ? "وکیل" : "Lawyer"}</th>}
                <th className="px-6 py-3 text-start">{isRTL ? "وضعیت" : "Status"}</th>
                <th className="px-6 py-3 text-start">{isRTL ? "تاریخ" : "Date"}</th>
                <th className="px-6 py-3 text-start">{isRTL ? "هزینه" : "Fee"}</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {docs.map((doc) => {
                const st = statusMap[doc.status] ?? { label: doc.status, color: "bg-gray-100 text-gray-600" };
                return (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{doc.subject}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{typeMap[doc.type] ?? doc.type}</td>
                    {role !== "CLIENT" && (
                      <td className="px-6 py-4 text-gray-600">{doc.client.name}</td>
                    )}
                    {role === "CLIENT" && (
                      <td className="px-6 py-4 text-gray-600">
                        {doc.lawyer ? doc.lawyer.user.name : <span className="text-gray-400">—</span>}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(doc.createdAt).toLocaleDateString(isRTL ? "fa-IR" : "en-US")}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {doc.fee > 0 ? doc.fee.toLocaleString(isRTL ? "fa-IR" : "en-US") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {doc.outputFile && (
                        <a
                          href={doc.outputFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-primary-600 hover:text-primary-800 transition-colors inline-flex"
                          title={isRTL ? "دانلود سند" : "Download Document"}
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
