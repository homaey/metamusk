import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import SessionProvider from "@/components/SessionProvider";
import { getLegalServiceSchema } from "@/lib/schema";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  const isFA = locale === "fa";

  return {
    metadataBase: new URL("https://legalfirm.ir"),
    title: {
      default: t("title"),
      template: `%s | ${isFA ? "موسسه حقوقی" : "Legal Firm"}`,
    },
    description: t("description"),
    keywords: isFA
      ? ["وکیل", "وکالت", "مشاوره حقوقی", "دادخواست", "شکواییه", "اظهارنامه", "لایحه", "موسسه حقوقی", "وکیل پایه یک"]
      : ["lawyer", "attorney", "legal counsel", "petition", "complaint", "legal notice", "brief", "law firm"],
    openGraph: {
      type: "website",
      locale: isFA ? "fa_IR" : "en_US",
      alternateLocale: isFA ? "en_US" : "fa_IR",
      url: `https://legalfirm.ir/${locale}`,
      siteName: isFA ? "موسسه حقوقی" : "Legal Firm",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `https://legalfirm.ir/${locale}`,
      languages: {
        fa: "https://legalfirm.ir/fa",
        en: "https://legalfirm.ir/en",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fa" | "en")) {
    notFound();
  }

  const messages = await getMessages();
  const schema = getLegalServiceSchema(locale);

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        {/* فونت‌های فارسی */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Estedad — متن بدنه */}
        <link
          href="https://fonts.googleapis.com/css2?family=Estedad:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Kalameh — عناوین */}
        <link
          href="https://rastikerdar.github.io/kalameh-font/dist/font-face.css"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
