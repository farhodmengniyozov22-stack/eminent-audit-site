import "server-only";
import type { PoolClient } from "pg";
import { CLIENTS_2026 } from "./client-seed-2026";
import { clientKey, parseClientLine } from "./clients";
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

/** Eski boshlang'ich qiymatda turgan matnni CONTENT_FIELDS dagi yangi qiymatga almashtiradi */
async function replaceIfUnchanged(client: PoolClient, old: Record<string, Triple>) {
  for (const [key, prev] of Object.entries(old)) {
    const f = CONTENT_FIELDS.find((x) => x.key === key);
    if (!f) continue;
    for (const lang of ["uz", "ru", "en"] as const) {
      await client.query(`UPDATE content SET ${lang} = $2 WHERE key = $1 AND ${lang} = $3`, [key, f[lang], prev[lang]]);
    }
  }
}

// 2026-noyabr: "Qanday hujjatlar kerak bo'ladi?" javobi ro'yxat ko'rinishida
const faqDocs2026_11 = (client: PoolClient) =>
  replaceIfUnchanged(client, {
    faq_3_a: {
      uz: "Moliyaviy hisobotlar, bosh kitob, asosiy shartnomalar va birlamchi hujjatlar. Aniq ro'yxatni birinchi suhbatdan keyin yuboramiz.",
      ru: "Финансовая отчётность, главная книга, основные договоры и первичные документы. Точный список пришлём после первой беседы.",
      en: "Financial statements, the general ledger, key contracts and source documents. We will send you the exact list after our first conversation.",
    },
  });

// 2026-noyabr: 2026-yil mijozlari (Excel'dan). Shu yilda mijoz allaqachon bo'lsa, takrorlar o'tkazib yuboriladi.
async function clients2026(client: PoolClient) {
  const existing = await client.query<{ name: string }>("SELECT name FROM clients WHERE year = 2026");
  const seen = new Set(existing.rows.map((r) => clientKey(r.name)));
  const names: string[] = [];
  const cats: string[] = [];
  const acts: string[] = [];
  for (const line of CLIENTS_2026) {
    const p = parseClientLine(line);
    if (!p || seen.has(clientKey(p.name))) continue;
    seen.add(clientKey(p.name));
    names.push(p.name);
    cats.push(p.category);
    acts.push(p.activity);
  }
  if (!names.length) return;
  await client.query(
    `INSERT INTO clients (name, year, sort, category, activity)
     SELECT n, 2026, s, c, a FROM unnest($1::text[], $2::int[], $3::text[], $4::text[]) AS t(n, s, c, a)`,
    [names, names.map((_, i) => (i + 1) * 10), cats, acts],
  );
}

// 2026-noyabr: Telegram sahifasi (bo'sh turgan bo'lsa). Instagram yangi maydon — boshlang'ich qiymati bilan qo'shiladi.
async function telegram2026_11(client: PoolClient) {
  await client.query(
    "UPDATE content SET uz = $1, ru = $1, en = $1 WHERE key = 'contact_telegram' AND uz = ''",
    ["@FMA_3377"],
  );
}

// 2026-noyabr: rahbar sertifikatlari tartibi (Auditor, Soliq maslahatchisi, CAP) va CAP raqami
const capCert2026_11 = (client: PoolClient) =>
  replaceIfUnchanged(client, {
    team_1_creds: {
      uz: "Auditor malaka sertifikati № 05671, CAP, Soliq maslahatchisi sertifikati № 00368",
      ru: "Сертификат аудитора № 05671, CAP, Сертификат налогового консультанта № 00368",
      en: "Auditor certificate No. 05671, CAP, Tax consultant certificate No. 00368",
    },
  });

// 2026-noyabr: Ten Din Xin — CAP va CIPA raqamlari, ruscha ism sertifikatdagidek ("Тен Дин Хын")
const tenCerts2026_11 = (client: PoolClient) =>
  replaceIfUnchanged(client, {
    team_2_creds: {
      uz: "Auditor malaka sertifikati № 06492, CAP, CIPA",
      ru: "Сертификат аудитора № 06492, CAP, CIPA",
      en: "Auditor certificate No. 06492, CAP, CIPA",
    },
    team_2_name: { uz: "Ten Din Xin", ru: "Тен Дин Хин", en: "Ten Din Xin" },
  });

const MIGRATIONS: { id: string; run: (c: PoolClient) => Promise<void> }[] = [
  { id: "2026-11-redesign-texts", run: texts2026_11 },
  { id: "2026-11-faq-documents", run: faqDocs2026_11 },
  { id: "2026-11-clients-2026", run: clients2026 },
  { id: "2026-11-telegram", run: telegram2026_11 },
  { id: "2026-11-cap-cert", run: capCert2026_11 },
  { id: "2026-11-ten-certs", run: tenCerts2026_11 },
];

export async function runMigrations(client: PoolClient) {
  for (const m of MIGRATIONS) {
    const done = await client.query("SELECT 1 FROM migrations WHERE id = $1", [m.id]);
    if (done.rowCount) continue;
    await m.run(client);
    await client.query("INSERT INTO migrations (id) VALUES ($1)", [m.id]);
  }
}
