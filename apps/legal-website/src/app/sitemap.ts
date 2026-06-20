import type { MetadataRoute } from "next";
import { articles } from "@/lib/data";

const BASE_URL = "https://legalfirm.ir";
const locales = ["fa", "en"];

const staticPages = ["", "/lawyers", "/services", "/documents", "/articles", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${page}`])
        ),
      },
    }))
  );

  const articleRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    articles.map((article) => ({
      url: `${BASE_URL}/${locale}/articles/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}/articles/${article.slug}`])
        ),
      },
    }))
  );

  return [...staticRoutes, ...articleRoutes];
}
