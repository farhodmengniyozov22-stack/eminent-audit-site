import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const languages = { uz: `${SITE_URL}/`, ru: `${SITE_URL}/ru`, en: `${SITE_URL}/en` };

export default function sitemap(): MetadataRoute.Sitemap {
  return (["uz", "ru", "en"] as const).map((lang) => ({
    url: languages[lang],
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: lang === "uz" ? 1 : 0.9,
    alternates: { languages },
  }));
}
