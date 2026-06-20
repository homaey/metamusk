export function getLegalServiceSchema(locale: string) {
  const isFA = locale === "fa";
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: isFA ? "موسسه حقوقی" : "Legal Firm",
    description: isFA
      ? "ارائه خدمات حقوقی تخصصی با بیش از ۲۰ سال تجربه"
      : "Specialized legal services with over 20 years of experience",
    url: `https://legalfirm.ir/${locale}`,
    telephone: "+982188888888",
    email: "info@legalfirm.ir",
    address: {
      "@type": "PostalAddress",
      streetAddress: isFA ? "خیابان ولیعصر، پلاک ۱۲۳" : "Valiasr Street, No. 123",
      addressLocality: isFA ? "تهران" : "Tehran",
      addressCountry: "IR",
    },
    openingHours: ["Sa-We 08:00-17:00", "Th 08:00-13:00"],
    priceRange: "$$",
    hasMap: "https://maps.google.com",
    sameAs: [
      "https://instagram.com/legalfirm",
      "https://linkedin.com/company/legalfirm",
    ],
    areaServed: {
      "@type": "Country",
      name: "Iran",
    },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  publishedAt?: string;
  datePublished?: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.publishedAt ?? article.datePublished,
    image: article.image,
    url: article.url,
    publisher: {
      "@type": "Organization",
      name: "Legal Firm",
      logo: {
        "@type": "ImageObject",
        url: "https://legalfirm.ir/logo.png",
      },
    },
  };
}

export function getFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
