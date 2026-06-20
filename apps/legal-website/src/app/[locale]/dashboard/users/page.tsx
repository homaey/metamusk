import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { User, Mail, Phone, ShieldCheck, Clock } from "lucide-react";

export default async function AdminUsersPage({
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

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, phone: true,
      role: true, createdAt: true,
      lawyer: { select: { status: true, barNumber: true } },
    },
    take: 100,
  });

  const roleBadge = (role: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      ADMIN:  { label: isRTL ? "ادمین"  : "Admin",  cls: "bg-red-100 text-red-700"    },
      LAWYER: { label: isRTL ? "وکیل"   : "Lawyer", cls: "bg-gold-100 text-gold-700"  },
      CLIENT: { label: isRTL ? "موکل"   : "Client", cls: "bg-blue-100 text-blue-700"  },
    };
    return map[role] ?? { label: role, cls: "bg-gray-100 text-gray-600" };
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? "مدیریت کاربران" : "User Management"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isRTL ? `مجموع ${users.length} کاربر` : `Total ${users.length} users`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: isRTL ? "کل کاربران" : "Total", count: users.length, cls: "bg-primary-50 text-primary-700" },
          { label: isRTL ? "وکلا" : "Lawyers", count: users.filter(u => u.role === "LAWYER").length, cls: "bg-gold-50 text-gold-700" },
          { label: isRTL ? "موکلین" : "Clients", count: users.filter(u => u.role === "CLIENT").length, cls: "bg-blue-50 text-blue-700" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.cls}`}>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-xs font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-start px-5 py-3 font-semibold text-gray-600">
                {isRTL ? "کاربر" : "User"}
              </th>
              <th className="text-start px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">
                {isRTL ? "تماس" : "Contact"}
              </th>
              <th className="text-start px-5 py-3 font-semibold text-gray-600">
                {isRTL ? "نقش" : "Role"}
              </th>
              <th className="text-start px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">
                {isRTL ? "تاریخ ثبت" : "Registered"}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const { label, cls } = roleBadge(u.role);
              return (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />{u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    {u.phone ? (
                      <a href={`tel:${u.phone}`} className="flex items-center gap-1 text-gray-500 hover:text-primary-600 text-xs">
                        <Phone className="w-3 h-3" />{u.phone}
                      </a>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${cls}`}>{label}</span>
                      {u.lawyer && (
                        <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                          u.lawyer.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          u.lawyer.status === "PENDING"  ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {u.lawyer.status === "APPROVED" ? (isRTL ? "تأیید شده" : "Approved") :
                           u.lawyer.status === "PENDING"  ? (isRTL ? "در انتظار" : "Pending") :
                           (isRTL ? "رد شده" : "Rejected")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(u.createdAt).toLocaleDateString(isRTL ? "fa-IR" : "en-US")}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <User className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>{isRTL ? "کاربری یافت نشد" : "No users found"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
