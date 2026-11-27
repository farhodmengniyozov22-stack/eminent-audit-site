"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/auth";
import { clientKey, parseClientLine } from "@/lib/clients";
import { CONTENT_FIELDS } from "@/lib/content-fields";
import { query } from "@/lib/db";
import { STATUSES, type Status } from "@/lib/data";

function refreshAll() {
  revalidatePath("/", "layout");
  revalidatePath("/ru", "layout");
  revalidatePath("/en", "layout");
  revalidatePath("/admin", "layout");
}

// ---------- Kirish / chiqish ----------

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return { error: "Serverda ADMIN_PASSWORD yoki SESSION_SECRET sozlanmagan." };
  }
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    await new Promise((r) => setTimeout(r, 800)); // parol tanlashni sekinlashtirish
    return { error: "Parol noto'g'ri." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Arizalar ----------

export async function setApplicationStatus(id: number, status: string) {
  await requireAdmin();
  if (!STATUSES.includes(status as Status)) throw new Error("Noma'lum holat");
  await query("UPDATE applications SET status = $1, updated_at = now() WHERE id = $2", [status, id]);
  revalidatePath("/admin", "layout");
}

export async function saveApplicationNote(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const note = String(formData.get("note") ?? "").slice(0, 2000);
  await query("UPDATE applications SET note = $1, updated_at = now() WHERE id = $2", [note, id]);
  revalidatePath("/admin", "layout");
}

export async function deleteApplication(id: number) {
  await requireAdmin();
  await query("DELETE FROM applications WHERE id = $1", [id]);
  revalidatePath("/admin", "layout");
}

// ---------- Xizmatlar ----------
// Narx ustunlari (price, unit_*) bazada qoladi, lekin saytda ko'rsatilmaydi va admin'da tahrirlanmaydi.

function serviceFromForm(formData: FormData) {
  const str = (k: string, max = 500) => String(formData.get(k) ?? "").trim().slice(0, max);
  return {
    name_uz: str("name_uz", 200),
    name_ru: str("name_ru", 200),
    name_en: str("name_en", 200),
    desc_uz: str("desc_uz", 1000),
    desc_ru: str("desc_ru", 1000),
    desc_en: str("desc_en", 1000),
    sort: Number(str("sort", 10)) || 0,
    active: formData.get("active") === "on",
  };
}

export type ServiceState = { ok?: boolean; error?: string };

export async function saveService(_prev: ServiceState, formData: FormData): Promise<ServiceState> {
  await requireAdmin();
  const s = serviceFromForm(formData);
  if (!s.name_uz || !s.name_ru) return { error: "Xizmat nomini kamida o'zbek va rus tillarida kiriting." };

  const id = String(formData.get("id") ?? "");
  const params = [s.name_uz, s.name_ru, s.name_en, s.desc_uz, s.desc_ru, s.desc_en, s.sort, s.active];
  if (/^\d+$/.test(id)) {
    await query(
      `UPDATE services SET name_uz=$1, name_ru=$2, name_en=$3, desc_uz=$4, desc_ru=$5, desc_en=$6,
       sort=$7, active=$8 WHERE id=$9`,
      [...params, Number(id)],
    );
  } else {
    await query(
      `INSERT INTO services (name_uz, name_ru, name_en, desc_uz, desc_ru, desc_en, sort, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      params,
    );
  }
  refreshAll();
  return { ok: true };
}

export async function deleteService(id: number) {
  await requireAdmin();
  await query("DELETE FROM services WHERE id = $1", [id]);
  refreshAll();
}

// ---------- Mijozlar ----------

export type ClientsState = { ok?: boolean; added?: number; skipped?: number; error?: string };

/**
 * Bir yo'la ko'p mijoz qo'shish. Excel'dan "Nomi" va "Faoliyat turi" ustunlarini (№ ustuni bilan ham bo'ladi)
 * nusxalab qo'yish mumkin: soha faoliyat turidan avtomatik aniqlanadi, nomlar bir xil ko'rinishga keltiriladi.
 */
export async function addClients(_prev: ClientsState, formData: FormData): Promise<ClientsState> {
  await requireAdmin();
  const year = Number(String(formData.get("year") ?? "").trim());
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return { error: "Yilni to'g'ri kiriting, masalan 2026." };

  const parsed = String(formData.get("names") ?? "")
    .split(/\r?\n/)
    .map(parseClientLine)
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (parsed.length === 0) return { error: "Kamida bitta mijoz nomini kiriting." };

  const existing = await query<{ name: string }>("SELECT name FROM clients WHERE year = $1", [year]);
  const seen = new Set(existing.map((r) => clientKey(r.name)));
  const sortStart = (await query<{ m: number }>("SELECT COALESCE(MAX(sort), 0)::int AS m FROM clients WHERE year = $1", [year]))[0].m;

  const names: string[] = [];
  const cats: string[] = [];
  let skipped = 0;
  for (const p of parsed) {
    const key = clientKey(p.name);
    if (seen.has(key)) {
      skipped++;
      continue;
    }
    seen.add(key);
    names.push(p.name);
    cats.push(p.category);
  }
  if (names.length) {
    const sorts = names.map((_, i) => sortStart + (i + 1) * 10);
    await query(
      `INSERT INTO clients (name, year, sort, category)
       SELECT n, $2, s, c FROM unnest($1::text[], $3::int[], $4::text[]) AS t(n, s, c)`,
      [names, year, sorts, cats],
    );
  }
  refreshAll();
  return { ok: true, added: names.length, skipped };
}

export async function setClientActive(id: number, active: boolean) {
  await requireAdmin();
  await query("UPDATE clients SET active = $1 WHERE id = $2", [active, id]);
  refreshAll();
}

export async function deleteClient(id: number) {
  await requireAdmin();
  await query("DELETE FROM clients WHERE id = $1", [id]);
  refreshAll();
}

// ---------- Sayt matnlari ----------

export type ContentState = { ok?: boolean; error?: string };

export async function saveContent(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireAdmin();
  for (const f of CONTENT_FIELDS) {
    const uz = String(formData.get(`${f.key}__uz`) ?? "").trim().slice(0, 4000);
    const ru = f.shared ? uz : String(formData.get(`${f.key}__ru`) ?? "").trim().slice(0, 4000);
    const en = f.shared ? uz : String(formData.get(`${f.key}__en`) ?? "").trim().slice(0, 4000);
    await query(
      `INSERT INTO content (key, uz, ru, en) VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) DO UPDATE SET uz = EXCLUDED.uz, ru = EXCLUDED.ru, en = EXCLUDED.en`,
      [f.key, uz, ru, en],
    );
  }
  refreshAll();
  return { ok: true };
}
