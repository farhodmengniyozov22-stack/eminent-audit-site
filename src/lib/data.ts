import "server-only";
import { CONTENT_FIELDS } from "./content-fields";
import { query } from "./db";
import type { Lang } from "./i18n";
import { uzText } from "./uz-alphabet";

export type Service = {
  id: number;
  name_uz: string;
  name_ru: string;
  desc_uz: string;
  desc_ru: string;
  name_en: string;
  desc_en: string;
  price: string; // BIGINT → string
  price_from: boolean;
  unit_uz: string;
  unit_ru: string;
  unit_en: string;
  sort: number;
  active: boolean;
};

export type Application = {
  id: number;
  name: string;
  phone: string;
  company: string;
  service_id: number | null;
  service_name: string;
  message: string;
  lang: string;
  status: Status;
  note: string;
  created_at: Date;
  updated_at: Date;
};

export const STATUSES = ["new", "in_progress", "done", "rejected"] as const;
export type Status = (typeof STATUSES)[number];

// Ikkala tilda bir xil maydonlar (telefon, email, Telegram, rasm manzili, raqamlar) alifbo bo'yicha o'girilmaydi
const SHARED_KEYS = new Set(CONTENT_FIELDS.filter((f) => f.shared).map((f) => f.key));

/** Sayt uchun matnlar; o'zbekchasi yangi alifboda (uz-alphabet.ts dagi sozlamaga qarab) */
export async function getContent(lang: Lang) {
  const rows = await query<{ key: string; uz: string; ru: string; en: string }>("SELECT key, uz, ru, en FROM content");
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = SHARED_KEYS.has(r.key) ? r[lang] : uzText(r[lang], lang);
  return map;
}

export async function getAllContent() {
  return query<{ key: string; uz: string; ru: string; en: string }>("SELECT key, uz, ru, en FROM content");
}

export async function getServices({ activeOnly }: { activeOnly: boolean }) {
  return query<Service>(
    `SELECT * FROM services ${activeOnly ? "WHERE active" : ""} ORDER BY sort, id`,
  );
}

export type Client = { id: number; name: string; year: number; sort: number; active: boolean; category: string; activity: string };

/** Mijozlar: yangi yillar birinchi, yil ichida tartib raqami va qo'shilish tartibida */
export async function getClients({ activeOnly }: { activeOnly: boolean }) {
  return query<Client>(
    `SELECT id, name, year, sort, active, category, activity FROM clients ${activeOnly ? "WHERE active" : ""} ORDER BY year DESC, sort, id`,
  );
}

export async function getApplications(status?: Status) {
  if (status) {
    return query<Application>(
      "SELECT * FROM applications WHERE status = $1 ORDER BY created_at DESC LIMIT 500",
      [status],
    );
  }
  return query<Application>("SELECT * FROM applications ORDER BY created_at DESC LIMIT 500");
}

export async function getStatusCounts() {
  const rows = await query<{ status: Status; n: number }>(
    "SELECT status, count(*)::int AS n FROM applications GROUP BY status",
  );
  const counts: Record<Status | "all", number> = { all: 0, new: 0, in_progress: 0, done: 0, rejected: 0 };
  for (const r of rows) {
    counts[r.status] = r.n;
    counts.all += r.n;
  }
  return counts;
}
