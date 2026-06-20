import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import LawyersSection from "@/components/sections/LawyersSection";
import DocumentsSection from "@/components/sections/DocumentsSection";
import ArticlesSection from "@/components/sections/ArticlesSection";
import FAQSection from "@/components/sections/FAQSection";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/schema";
import { faqs } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const faqSchema = getFAQSchema(
    faqs.map((f) => ({
      question: locale === "fa" ? f.questionFA : f.questionEN,
      answer: locale === "fa" ? f.answerFA : f.answerEN,
    }))
  );

  const breadcrumb = getBreadcrumbSchema([
    { name: locale === "fa" ? "خانه" : "Home", url: `https://legalfirm.ir/${locale}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Hero />
      <Services />
      <LawyersSection />
      <DocumentsSection />
      <ArticlesSection />
      <FAQSection />
    </>
  );
}
