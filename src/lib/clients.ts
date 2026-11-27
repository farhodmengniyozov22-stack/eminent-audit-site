// Mijozlar: nomni tozalash, tashkiliy shakl va faoliyat turini tilga moslash.
// Bu fayl serverda ham, brauzerda ham ishlatiladi.

export type Lang3 = "uz" | "ru" | "en";

// Umumiy soha (bazada saqlanadi; saytda hozircha ko'rsatilmaydi, keyinchalik saralash uchun)
export type ClientCategory = "it" | "education" | "logistics" | "services" | "other";

/** Excel'dagi "Faoliyat turi" matnidan umumiy sohani aniqlaydi */
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
export function parseClientLine(
  line: string,
): { name: string; category: ClientCategory | ""; activity: string } | null {
  const cells = line.split("\t").map((c) => c.trim());
  while (cells.length && (cells[0] === "" || /^\d+[.)]?$/.test(cells[0]))) cells.shift();
  const name = normalizeClientName(cells[0] ?? "");
  if (!name) return null;
  const activity = (cells[1] ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
  return { name: name.slice(0, 200), category: activity ? categorize(activity) : "", activity };
}

// ---------- Faoliyat turi (Excel'dagi OKED matni) tarjimasi ----------

const actKey = (s: string) =>
  s
    .toLowerCase()
    .replace(/['‘’ʻ`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

// O'zbekcha faoliyat turi → ruscha / inglizcha. Yangi tur kelsa, shu yerga qo'shiladi;
// lug'atda bo'lmasa, uchala tilda ham o'zbekcha matn ko'rsatiladi.
const ACTIVITIES: [string, string, string][] = [
  ["Axborot texnologiyalari sohasidagi faoliyat", "Деятельность в сфере информационных технологий", "Information technology activities"],
  ["Ta'lim faoliyati", "Образовательная деятельность", "Educational activities"],
  ["Logistika faoliyati", "Логистическая деятельность", "Logistics activities"],
  ["Marketing faoliyati", "Маркетинговая деятельность", "Marketing activities"],
  ["Mehmonxonalar soxasidagi faoliyat", "Деятельность в сфере гостиничного бизнеса", "Hotel industry activities"],
  ["Mehmonxonalar sohasidagi faoliyat", "Деятельность в сфере гостиничного бизнеса", "Hotel industry activities"],
  ["Dizaynerlik faoliyati", "Дизайнерская деятельность", "Design activities"],
  ["Buxgalterlik hisobi sohasidagi faoliyat", "Деятельность в области бухгалтерского учёта", "Accounting activities"],
  ["Turizm sohasidagi faoliyat", "Деятельность в сфере туризма", "Tourism activities"],
  [
    "Ko'p kvartirali uylar va turar joylarni ijaraga berish faoliyati",
    "Сдача в аренду многоквартирных домов и жилых помещений",
    "Renting of apartment buildings and residential premises",
  ],
  ["Muhandislik izlanishlari sohasidagi faoliyat", "Деятельность в области инженерных изысканий", "Engineering survey activities"],
  [
    "Jamoatchilik bilan o'zaro munosabatlar va aloqalar bo'yicha faoliyat",
    "Деятельность в области связей с общественностью",
    "Public relations activities",
  ],
  ["Pul-kredit vositachiligining boshqa turlari", "Прочие виды денежно-кредитного посредничества", "Other monetary intermediation"],
  [
    "Ma'lumotlarni joylashtirish va ishlov berish bo'yicha xizmatlar",
    "Услуги по размещению и обработке данных",
    "Data hosting and processing services",
  ],
  [
    "Kompleks ma'muriy-boshqaruv xizmati ko'rsatish",
    "Комплексные административно-управленческие услуги",
    "Combined office administrative services",
  ],
  [
    "Soliq solish masalalari bo'yicha maslahatchilar xizmati",
    "Консультационные услуги по вопросам налогообложения",
    "Tax consultancy services",
  ],
  [
    "Restoranlar va oziq-ovqat mahsulotlari etkazish bo'yicha xizmatlar",
    "Услуги ресторанов и доставки продуктов питания",
    "Restaurant and food delivery services",
  ],
  ["Kompyuter o'yinlarini chiqarish", "Издание компьютерных игр", "Publishing of computer games"],
  ["Fermer xo'jaligi", "Фермерское хозяйство", "Farming"],
  ["Ob'ektlarga kompleks xizmat ko'rsatish", "Комплексное обслуживание объектов", "Combined facilities support activities"],
  ["Ulgurji va chakana ichimliklar savdosi", "Оптовая и розничная торговля напитками", "Wholesale and retail trade of beverages"],
  ["To'qimachilik sohasidagi faoliyat", "Деятельность в текстильной отрасли", "Textile industry activities"],
];
const ACTIVITY_MAP = new Map(ACTIVITIES.map(([uz, ru, en]) => [actKey(uz), { ru, en }]));

/** Faoliyat turini tilga moslaydi (o'zbekchasi o'zgarishsiz qaytadi) */
export function activityLabel(activity: string, lang: Lang3): string {
  if (!activity || lang === "uz") return activity;
  return ACTIVITY_MAP.get(actKey(activity))?.[lang] ?? activity;
}
