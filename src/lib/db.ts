import "server-only";
import { Pool, type QueryResultRow } from "pg";
import { CONTENT_FIELDS } from "./content-fields";

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
`;

const SEED_SERVICES = [
  ["Majburiy audit", "Обязательный аудит", "Yillik moliyaviy hisobot auditi va auditorlik xulosasi (XAS asosida).", "Аудит годовой финансовой отчётности и аудиторское заключение (по МСА).", 15000000, true, "yiliga", "в год"],
  ["Tashabbusli audit", "Инициативный аудит", "Rahbariyat yoki ta'sischilar buyurtmasi bo'yicha alohida yo'nalish yoki davr tekshiruvi.", "Проверка отдельного участка или периода по заказу руководства или учредителей.", 8000000, true, "", ""],
  ["Buxgalteriya hisobini yuritish", "Ведение бухгалтерского учёта", "Birlamchi hujjatlardan tortib soliq hisobotlarigacha — to'liq autsorsing.", "Полный аутсорсинг: от первичных документов до налоговой отчётности.", 3000000, true, "oyiga", "в месяц"],
  ["Hisobni tiklash", "Восстановление учёта", "O'tgan davrlar hisobini tiklash, qoldiqlarni solishtirish va tuzatish.", "Восстановление учёта за прошлые периоды, сверка и корректировка остатков.", 5000000, true, "", ""],
  ["QQS qaytarishda ko'mak", "Сопровождение возврата НДС", "Hujjatlar paketini tayyorlash va soliq organi bilan muloqotda hamrohlik.", "Подготовка пакета документов и сопровождение при взаимодействии с налоговым органом.", 6000000, true, "", ""],
  ["Soliq maslahati", "Налоговая консультация", "Soliq xatarlarini baholash, operatsiyalarni qonuniy rejalashtirish.", "Оценка налоговых рисков, законное планирование операций.", 500000, false, "bir soat", "за час"],
  ["XBXS bo'yicha hisobot", "Отчётность по МСФО", "Milliy hisobotni XBXS formatiga transformatsiya qilish.", "Трансформация национальной отчётности в формат МСФО.", 20000000, true, "", ""],
] as const;

async function initSchema() {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(424242)");
    await client.query(SCHEMA);

    for (const f of CONTENT_FIELDS) {
      await client.query(
        "INSERT INTO content (key, uz, ru) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING",
        [f.key, f.uz, f.ru],
      );
    }

    const { rows } = await client.query<{ n: string }>("SELECT count(*)::text AS n FROM services");
    if (rows[0].n === "0") {
      let sort = 10;
      for (const s of SEED_SERVICES) {
        await client.query(
          `INSERT INTO services (name_uz, name_ru, desc_uz, desc_ru, price, price_from, unit_uz, unit_ru, sort)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [...s, sort],
        );
        sort += 10;
      }
    }
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
