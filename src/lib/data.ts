import "server-only";
import { query } from "./db";
import type { Lang } from "./i18n";

export type Service = {
  id: number;
  name_uz: string;
  name_ru: string;
  desc_uz: string;
  desc_ru: string;
  price: string; // BIGINT → string
  price_from: boolean;
  unit_uz: string;
  unit_ru: string;
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

export async function getContent(lang: Lang) {
  const rows = await query<{ key: string; uz: string; ru: string }>("SELECT key, uz, ru FROM content");
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r[lang];
  return map;
}

export async function getAllContent() {
  return query<{ key: string; uz: string; ru: string }>("SELECT key, uz, ru FROM content");
}

export async function getServices({ activeOnly }: { activeOnly: boolean }) {
  return query<Service>(
    `SELECT * FROM services ${activeOnly ? "WHERE active" : ""} ORDER BY sort, id`,
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
