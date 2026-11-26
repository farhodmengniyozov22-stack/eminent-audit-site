import "server-only";
import { Pool, type QueryResultRow } from "pg";
import { CONTENT_FIELDS } from "./content-fields";
import { runMigrations } from "./migrations";

declare global {
  var __eaPool: Pool | undefined;
  var __eaSchema: Promise<void> | undefined;
}

function connectionString() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL topilmadi. Vercel'da Neon bazasini ulang yoki .env.local faylida DATABASE_URL ni kiriting.",
    );
  }
  return url;
}

function getPool() {
  if (!globalThis.__eaPool) {
    const url = connectionString();
    const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url) || url.includes("host=/");
    globalThis.__eaPool = new Pool({
      connectionString: url,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 10_000,
    });
  }
  return globalThis.__eaPool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name_uz TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  desc_uz TEXT NOT NULL DEFAULT '',
  desc_ru TEXT NOT NULL DEFAULT '',
  price BIGINT NOT NULL DEFAULT 0,
  price_from BOOLEAN NOT NULL DEFAULT TRUE,
  unit_uz TEXT NOT NULL DEFAULT '',
  unit_ru TEXT NOT NULL DEFAULT '',
  sort INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  service_id INT REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'uz',
  status TEXT NOT NULL DEFAULT 'new',
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status, created_at DESC);
CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  uz TEXT NOT NULL,
  ru TEXT NOT NULL
);
-- Ingliz tili (keyin qo'shilgan; mavjud bazalarda ham ustun paydo bo'ladi)
ALTER TABLE content ADD COLUMN IF NOT EXISTS en TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS name_en TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS desc_en TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS unit_en TEXT NOT NULL DEFAULT '';
-- Mijozlar (yillar bo'yicha)
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  year INT NOT NULL,
  sort INT NOT NULL DEFAULT 100,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS clients_year_idx ON clients (year DESC, sort, id);
-- Bir martalik ma'lumot yangilanishlari (migrations.ts)
CREATE TABLE IF NOT EXISTS migrations (
  id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

// [name_uz, name_ru, desc_uz, desc_ru, price, price_from, unit_uz, unit_ru, name_en, desc_en, unit_en]
const SEED_SERVICES = [
  ["Majburiy audit", "Обязательный аудит", "Yillik moliyaviy hisobot auditi va auditorlik xulosasi (XAS asosida).", "Аудит годовой финансовой отчётности и аудиторское заключение (по МСА).", 15000000, true, "yiliga", "в год", "Statutory audit", "Audit of annual financial statements and an auditor's report (under ISA).", "per year"],
  ["Tashabbusli audit", "Инициативный аудит", "Rahbariyat yoki ta'sischilar buyurtmasi bo'yicha alohida yo'nalish yoki davr tekshiruvi.", "Проверка отдельного участка или периода по заказу руководства или учредителей.", 8000000, true, "", "", "Voluntary audit", "Review of a specific area or period commissioned by management or shareholders.", ""],
  ["Buxgalteriya hisobini yuritish", "Ведение бухгалтерского учёта", "Birlamchi hujjatlardan tortib soliq hisobotlarigacha — to'liq autsorsing.", "Полный аутсорсинг: от первичных документов до налоговой отчётности.", 3000000, true, "oyiga", "в месяц", "Bookkeeping", "Full outsourcing: from source documents to tax returns.", "per month"],
  ["Buxgalteriya hisobini qayta tiklash", "Восстановление бухгалтерского учёта", "O'tgan davrlar hisobini tiklash, qoldiqlarni solishtirish va tuzatish.", "Восстановление учёта за прошлые периоды, сверка и корректировка остатков.", 5000000, true, "", "", "Restoration of accounting records", "Restoring records for past periods, reconciling and correcting balances.", ""],
  ["Soliq maslahati", "Налоговая консультация", "Soliq xatarlarini baholash, operatsiyalarni qonuniy rejalashtirish.", "Оценка налоговых рисков, законное планирование операций.", 500000, false, "bir soat", "за час", "Tax consulting", "Assessing tax risks and planning transactions lawfully.", "per hour"],
] as const;

// Avvalgi nomlar: admin nomini o'zgartirgan bo'lsa ham inglizchasini topish uchun
const SEED_ALIASES: Record<string, string[]> = {
  "Buxgalteriya hisobini qayta tiklash": ["Hisobni tiklash"],
};

async function initSchema() {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(424242)");
    await client.query(SCHEMA);

    for (const f of CONTENT_FIELDS) {
      await client.query(
        "INSERT INTO content (key, uz, ru, en) VALUES ($1, $2, $3, $4) ON CONFLICT (key) DO NOTHING",
        [f.key, f.uz, f.ru, f.en],
      );
      // Ingliz tili keyin qo'shildi: bo'sh qolgan inglizcha matnni to'ldiramiz.
      // Ikkala tilda bir xil maydonlar (telefon, email) uchun o'zbekcha qiymat ko'chiriladi.
      if (f.shared) {
        await client.query("UPDATE content SET en = uz WHERE key = $1 AND en = ''", [f.key]);
      } else if (f.en) {
        await client.query("UPDATE content SET en = $2 WHERE key = $1 AND en = ''", [f.key, f.en]);
      }
    }

    const { rows } = await client.query<{ n: string }>("SELECT count(*)::text AS n FROM services");
    if (rows[0].n === "0") {
      let sort = 10;
      for (const s of SEED_SERVICES) {
        await client.query(
          `INSERT INTO services (name_uz, name_ru, desc_uz, desc_ru, price, price_from, unit_uz, unit_ru, name_en, desc_en, unit_en, sort)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [...s, sort],
        );
        sort += 10;
      }
    } else {
      // Mavjud xizmatlarga inglizcha nom/tavsif/birlikni qo'shamiz (faqat bo'sh bo'lsa)
      for (const s of SEED_SERVICES) {
        const names = [s[0], ...(SEED_ALIASES[s[0]] ?? [])];
        await client.query(
          `UPDATE services SET name_en = $2, desc_en = $3, unit_en = $4
           WHERE name_en = '' AND name_uz = ANY($1::text[])`,
          [names, s[8], s[9], s[10]],
        );
      }
    }
    await runMigrations(client);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

function ensureSchema() {
  if (!globalThis.__eaSchema) {
    globalThis.__eaSchema = initSchema().catch((e) => {
      globalThis.__eaSchema = undefined;
      throw e;
    });
  }
  return globalThis.__eaSchema;
}

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  await ensureSchema();
  const res = await getPool().query<T>(text, params);
  return res.rows;
}
