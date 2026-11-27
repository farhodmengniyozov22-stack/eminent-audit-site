// Saytning asosiy manzili (eminentaudit.uz avtomatik www ga yo'naltiriladi)
export const SITE_URL = "https://www.eminentaudit.uz";

/** Har bir til sahifasi uchun canonical va hreflang havolalari */
export function langAlternates(lang: "uz" | "ru" | "en") {
  const path = { uz: "/", ru: "/ru", en: "/en" } as const;
  return {
    canonical: path[lang],
    languages: { uz: "/", ru: "/ru", en: "/en", "x-default": "/" },
  };
}
