// Mijozlar: nomni tozalash, soha bo'yicha guruhlash, tashkiliy shaklni tilga moslash.
// Bu fayl serverda ham, brauzerda ham ishlatiladi.

export type Lang3 = "uz" | "ru" | "en";

export const CLIENT_CATEGORIES = ["it", "education", "logistics", "services", "other"] as const;
export type ClientCategory = (typeof CLIENT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ClientCategory, Record<Lang3, string>> = {
  it: { uz: "IT", ru: "IT", en: "IT" },
  education: { uz: "Ta'lim", ru: "Образование", en: "Education" },
  logistics: { uz: "Logistika", ru: "Логистика", en: "Logistics" },
  services: { uz: "Biznes xizmatlari", ru: "Бизнес-услуги", en: "Business services" },
  other: { uz: "Boshqa sohalar", ru: "Другие отрасли", en: "Other industries" },
};

/** Excel'dagi "Faoliyat turi" matnidan sohani aniqlaydi */
export function categorize(activity: string): ClientCategory {
  const a = activity.toLowerCase();
  if (/axborot texnolog|ma.lumotlarni joylashtirish|kompyuter o.yin|dasturiy/.test(a)) return "it";
  if (/ta.lim/.test(a)) return "education";
  if (/logistika|tashish|yuk/.test(a)) return "logistics";
  if (
    /buxgalter|soliq|marketing|jamoatchilik|ma.muriy|muhandislik|dizayn|ijaraga|pul-kredit|moliya|maslahat|konsalting|ob.ektlarga/.test(
      a,
    )
  )
    return "services";
  return "other";
}

/**
 * Nomni bir xil ko'rinishga keltiradi:
 * ortiqcha bo'sh joylar, "..." → «...», MCHJ → MChJ, kirill ХК/QK → lotin XK/QK.
 */
export function normalizeClientName(raw: string): string {
  let s = raw.replace(/\s+/g, " ").trim();
  // "NOM" yoki “NOM” → «NOM»
  s = s.replace(/^["“”„]\s*(.+?)\s*["“”]/, "«$1»");
  s = s.replace(/«\s+/g, "«").replace(/\s+»/g, "»");
  // tashkiliy shakllar
  s = s
    .replace(/\bMCHJ\b/gi, "MChJ")
    .replace(/(^|\s)ХК(?=\s|$)/g, "$1XK")
    .replace(/(^|\s)XK(?=\s|$)/gi, "$1XK")
    .replace(/(^|\s)QK(?=\s|$)/gi, "$1QK")
    .replace(/(^|\s)FX(?=\s|$)/gi, "$1FX")
    .replace(/(^|\s)YSHB(?=\s|$)/gi, "$1YSHB");
  return s;
}

/** Takrorlarni aniqlash uchun kalit: faqat harf va raqamlar */
export function clientKey(name: string): string {
  return normalizeClientName(name)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

// Tashkiliy shakllar tarjimasi
const FORMS: Record<string, Record<Lang3, string>> = {
  MChJ: { uz: "MChJ", ru: "ООО", en: "LLC" },
  XK: { uz: "XK", ru: "ЧП", en: "PE" },
  QK: { uz: "QK", ru: "СП", en: "JV" },
  FX: { uz: "FX", ru: "ФХ", en: "Farm" },
  YSHB: { uz: "YSHB", ru: "Ассоциация", en: "Association" },
};

/** «BRAND» MChJ → { brand: "BRAND", form: "ООО" } (tilga qarab) */
export function splitClientName(name: string, lang: Lang3): { brand: string; form: string } {
  const m = name.match(/^«(.+?)»\s*(.*)$/);
  if (!m) return { brand: name, form: "" };
  const brand = m[1];
  let rest = m[2].trim();
  if (lang !== "uz") rest = rest.replace(/\(.*?\)/g, "").trim(); // "(assotsiatsiya)" kabi izohlar
  const form = rest
    .split(/\s+/)
    .filter(Boolean)
    .map((tok) => FORMS[tok]?.[lang] ?? tok)
    .join(" ");
  return { brand, form };
}

/**
 * Admin'ga qo'yilgan qatorni ajratadi. Excel'dan nusxalanganda ustunlar tab bilan bo'linadi:
 *   "№ ⇥ Nomi ⇥ Faoliyat turi" yoki "Nomi ⇥ Faoliyat turi" yoki faqat "Nomi".
 */
export function parseClientLine(line: string): { name: string; category: ClientCategory | "" } | null {
  const cells = line.split("\t").map((c) => c.trim());
  while (cells.length && (cells[0] === "" || /^\d+[.)]?$/.test(cells[0]))) cells.shift();
  const name = normalizeClientName(cells[0] ?? "");
  if (!name) return null;
  const activity = cells[1] ?? "";
  return { name: name.slice(0, 200), category: activity ? categorize(activity) : "" };
}
