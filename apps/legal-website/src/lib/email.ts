import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL ?? "noreply@legalfirm.ir";
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3001";

export async function sendVerificationEmail(email: string, name: string, token: string, locale = "fa") {
  const isFA = locale === "fa";
  const link = `${BASE_URL}/${locale}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: isFA ? "تأیید ایمیل — موسسه حقوقی" : "Verify your email — Legal Firm",
    html: isFA
      ? `<div dir="rtl" style="font-family:Tahoma,sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#1e3a5f">سلام ${name}،</h2>
          <p style="color:#555;line-height:1.8">برای تکمیل ثبت‌نام، لطفاً ایمیل خود را تأیید کنید.</p>
          <a href="${link}" style="display:inline-block;margin:24px 0;background:#1e3a5f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:bold">
            تأیید ایمیل
          </a>
          <p style="color:#999;font-size:12px">این لینک تا ۲۴ ساعت معتبر است.</p>
          <p style="color:#ccc;font-size:11px">اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#1e3a5f">Hello ${name},</h2>
          <p style="color:#555;line-height:1.8">Please verify your email to complete registration.</p>
          <a href="${link}" style="display:inline-block;margin:24px 0;background:#1e3a5f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:bold">
            Verify Email
          </a>
          <p style="color:#999;font-size:12px">This link expires in 24 hours.</p>
          <p style="color:#ccc;font-size:11px">If you didn't request this, please ignore this email.</p>
        </div>`,
  });
}

export async function sendLawyerStatusEmail(
  email: string,
  name: string,
  status: "APPROVED" | "REJECTED",
  locale = "fa"
) {
  const isFA = locale === "fa";
  const isApproved = status === "APPROVED";

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: isFA
      ? isApproved ? "✅ درخواست شما تأیید شد" : "❌ درخواست ثبت وکیل"
      : isApproved ? "✅ Your application was approved" : "❌ Your lawyer application",
    html: isFA
      ? `<div dir="rtl" style="font-family:Tahoma,sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:${isApproved ? "#15803d" : "#b91c1c"}">${isApproved ? "✅ تبریک! درخواست شما تأیید شد" : "❌ درخواست شما رد شد"}</h2>
          <p style="color:#555">سلام ${name}،</p>
          <p style="color:#555;line-height:1.8">
            ${isApproved
              ? "پروفایل شما در سایت موسسه حقوقی فعال شد. اکنون می‌توانید پروفایل خود را مشاهده و مقاله منتشر کنید."
              : "متأسفانه درخواست ثبت‌نام شما در این مرحله تأیید نشد. برای اطلاعات بیشتر با ما تماس بگیرید."}
          </p>
          ${isApproved ? `<a href="${BASE_URL}/fa/dashboard" style="display:inline-block;margin:20px 0;background:#1e3a5f;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:bold">رفتن به داشبورد</a>` : ""}
        </div>`
      : `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:${isApproved ? "#15803d" : "#b91c1c"}">${isApproved ? "✅ Congratulations! Application Approved" : "❌ Application Not Approved"}</h2>
          <p style="color:#555">Hello ${name},</p>
          <p style="color:#555;line-height:1.8">
            ${isApproved
              ? "Your lawyer profile is now active on our platform. You can now manage your profile and publish articles."
              : "Unfortunately your application was not approved at this time. Please contact us for more information."}
          </p>
          ${isApproved ? `<a href="${BASE_URL}/en/dashboard" style="display:inline-block;margin:20px 0;background:#1e3a5f;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:bold">Go to Dashboard</a>` : ""}
        </div>`,
  });
}

export async function sendWelcomeEmail(email: string, name: string, locale = "fa") {
  const isFA = locale === "fa";
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: isFA ? "به موسسه حقوقی خوش آمدید" : "Welcome to Legal Firm",
    html: isFA
      ? `<div dir="rtl" style="font-family:Tahoma,sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#1e3a5f">خوش آمدید ${name} عزیز!</h2>
          <p style="color:#555;line-height:1.8">ثبت‌نام شما با موفقیت انجام شد. می‌توانید از داشبورد خود مشاوره رزرو کنید.</p>
          <a href="${BASE_URL}/fa/dashboard" style="display:inline-block;margin:20px 0;background:#d4a017;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:bold">رفتن به داشبورد</a>
        </div>`
      : `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#1e3a5f">Welcome, ${name}!</h2>
          <p style="color:#555;line-height:1.8">Your registration was successful. You can now book consultations from your dashboard.</p>
          <a href="${BASE_URL}/en/dashboard" style="display:inline-block;margin:20px 0;background:#d4a017;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:bold">Go to Dashboard</a>
        </div>`,
  });
}
