import "server-only";
import type { PoolClient } from "pg";
import { CONTENT_FIELDS } from "./content-fields";

// Bir martalik ma'lumot yangilanishlari. Har biri bazada "migrations" jadvaliga yoziladi
// va qayta ishga tushmaydi. Matnlar faqat eski boshlang'ich qiymatda turgan bo'lsa almashtiriladi —
// admin paneldan qo'lda o'zgartirilgan matnlarga tegilmaydi.

type Triple = { uz: string; ru: string; en: string };

// 2026-noyabr: narxlar olib tashlandi, matnlar yangilandi, QQS va XBXS xizmatlari yashirildi
const OLD_TEXTS_2026_11: Record<string, Triple> = {
  hero_text: {
    uz: "Majburiy va tashabbusli audit, buxgalteriya hisobini yuritish va tiklash, soliq maslahati va XBXS bo'yicha hisobot. O'zbekiston qonunchiligi va xalqaro standartlar asosida.",
    ru: "Обязательный и инициативный аудит, ведение и восстановление учёта, налоговые консультации и отчётность по МСФО. По законодательству Узбекистана и международным стандартам.",
    en: "Statutory and voluntary audits, bookkeeping and restoration of accounting records, tax consulting and IFRS reporting. In line with Uzbek legislation and international standards.",
  },
  stat_1_label: { uz: "yil bosh buxgalter sifatida", ru: "лет главным бухгалтером", en: "years as chief accountant" },
  stat_3_value: { uz: "7", ru: "7", en: "7" },
  fact_1: { uz: "11+ yil bosh buxgalter sifatida", ru: "11+ лет главным бухгалтером", en: "11+ years as chief accountant" },
  about_text: {
    uz: "Eminent Audit rahbari — sertifikatlangan auditor va soliq maslahatchisi. Bosh buxgalter sifatida 11 yildan ortiq ishlagan, shuning uchun hisobotni nafaqat tekshiramiz, balki xatolar qayerdan kelib chiqishini ham tushuntirib, tuzatishga yordam beramiz.",
    ru: "Руководитель Eminent Audit — сертифицированный аудитор и налоговый консультант с опытом главного бухгалтера более 11 лет. Поэтому мы не только проверяем отчётность, но и объясняем, откуда берутся ошибки, и помогаем их исправить.",
    en: "The director of Eminent Audit is a certified auditor and tax consultant with more than 11 years of experience as a chief accountant. That is why we don't just check your statements — we explain where errors come from and help you fix them.",
  },
  services_title: { uz: "Xizmatlar va narxlar", ru: "Услуги и цены", en: "Services and prices" },
  services_subtitle: {
    uz: "Narxlar ochiq — yakuniy summa shartnomada qat'iy belgilanadi.",
    ru: "Цены открыты — итоговая сумма фиксируется в договоре.",
    en: "Transparent pricing — the final amount is fixed in the contract.",
  },
  services_note: {
    uz: "Yakuniy narx korxona hajmi, operatsiyalar soni va hujjatlar holatiga qarab shartnomada belgilanadi.",
    ru: "Итоговая стоимость фиксируется в договоре и зависит от масштаба компании, объёма операций и состояния документов.",
    en: "The final price is set in the contract and depends on the size of the company, the volume of transactions and the state of the records.",
  },
  contact_address: { uz: "Toshkent shahri", ru: "г. Ташкент", en: "Tashkent" },
  contact_hours: {
    uz: "Dushanba–juma, 9:00–18:00",
    ru: "Понедельник–пятница, 9:00–18:00",
    en: "Monday–Friday, 9:00–18:00",
  },
};

async function texts2026_11(client: PoolClient) {
  for (const [key, old] of Object.entries(OLD_TEXTS_2026_11)) {
    const f = CONTENT_FIELDS.find((x) => x.key === key);
    if (!f) continue;
    for (const lang of ["uz", "ru", "en"] as const) {
      await client.query(`UPDATE content SET ${lang} = $2 WHERE key = $1 AND ${lang} = $3`, [key, f[lang], old[lang]]);
    }
  }
  await client.query(
    "UPDATE services SET active = false WHERE name_uz IN ('QQS qaytarishda ko''mak', 'XBXS bo''yicha hisobot')",
  );
}

const MIGRATIONS: { id: string; run: (c: PoolClient) => Promise<void> }[] = [
  { id: "2026-11-redesign-texts", run: texts2026_11 },
];

export async function runMigrations(client: PoolClient) {
  for (const m of MIGRATIONS) {
    const done = await client.query("SELECT 1 FROM migrations WHERE id = $1", [m.id]);
    if (done.rowCount) continue;
    await m.run(client);
    await client.query("INSERT INTO migrations (id) VALUES ($1)", [m.id]);
  }
}
