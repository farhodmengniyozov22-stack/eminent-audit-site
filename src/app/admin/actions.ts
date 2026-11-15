"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/auth";
import { CONTENT_FIELDS } from "@/lib/content-fields";
import { query } from "@/lib/db";
import { STATUSES, type Status } from "@/lib/data";

function refreshAll() {
  revalidatePath("/", "layout");
  revalidatePath("/ru", "layout");
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

// ---------- Xizmatlar va narxlar ----------

function serviceFromForm(formData: FormData) {
  const str = (k: string, max = 500) => String(formData.get(k) ?? "").trim().slice(0, max);
  const priceDigits = str("price", 30).replace(/\D/g, "");
  return {
    name_uz: str("name_uz", 200),
    name_ru: str("name_ru", 200),
    desc_uz: str("desc_uz", 1000),
    desc_ru: str("desc_ru", 1000),
    price: priceDigits === "" ? 0 : Number(priceDigits),
    price_from: formData.get("price_from") === "on",
    unit_uz: str("unit_uz", 60),
    unit_ru: str("unit_ru", 60),
    sort: Number(str("sort", 10)) || 0,
    active: formData.get("active") === "on",
  };
}

export type ServiceState = { ok?: boolean; error?: string };

export async function saveService(_prev: ServiceState, formData: FormData): Promise<ServiceState> {
  await requireAdmin();
  const s = serviceFromForm(formData);
  if (!s.name_uz || !s.name_ru) return { error: "Xizmat nomini ikkala tilda kiriting." };
  if (!Number.isSafeInteger(s.price)) return { error: "Narx juda katta." };

  const id = String(formData.get("id") ?? "");
  const params = [s.name_uz, s.name_ru, s.desc_uz, s.desc_ru, s.price, s.price_from, s.unit_uz, s.unit_ru, s.sort, s.active];
  if (/^\d+$/.test(id)) {
    await query(
      `UPDATE services SET name_uz=$1, name_ru=$2, desc_uz=$3, desc_ru=$4, price=$5, price_from=$6,
       unit_uz=$7, unit_ru=$8, sort=$9, active=$10 WHERE id=$11`,
      [...params, Number(id)],
    );
  } else {
    await query(
      `INSERT INTO services (name_uz, name_ru, desc_uz, desc_ru, price, price_from, unit_uz, unit_ru, sort, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
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

// ---------- Sayt matnlari ----------

export type ContentState = { ok?: boolean; error?: string };

export async function saveContent(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireAdmin();
  for (const f of CONTENT_FIELDS) {
    const uz = String(formData.get(`${f.key}__uz`) ?? "").trim().slice(0, 4000);
    const ru = f.shared ? uz : String(formData.get(`${f.key}__ru`) ?? "").trim().slice(0, 4000);
    await query(
      `INSERT INTO content (key, uz, ru) VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET uz = EXCLUDED.uz, ru = EXCLUDED.ru`,
      [f.key, uz, ru],
    );
  }
  refreshAll();
  return { ok: true };
}
