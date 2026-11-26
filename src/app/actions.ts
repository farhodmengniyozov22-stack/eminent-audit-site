"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { query } from "@/lib/db";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import { notifyNewApplication } from "@/lib/telegram";

export type ApplyState = {
  ok: boolean;
  error?: string;
  fieldErrors?: { name?: string; phone?: string };
  values?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, "").length >= 9),
  company: z.string().trim().max(200).default(""),
  service_id: z.string().trim().default(""),
  message: z.string().trim().max(2000).default(""),
  lang: z.enum(["uz", "ru", "en"]).default("uz"),
});

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const raw = Object.fromEntries(
    ["name", "phone", "company", "service_id", "message", "lang"].map((k) => [k, String(formData.get(k) ?? "")]),
  );
  const lang: Lang = isLang(raw.lang) ? raw.lang : "uz";
  const t = getDict(lang);

  // Bot tuzog'i: odamlar bu yashirin maydonni to'ldirmaydi
  if (String(formData.get("website") ?? "") !== "") return { ok: true };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fields = new Set(parsed.error.issues.map((i) => i.path[0]));
    return {
      ok: false,
      values: raw,
      fieldErrors: {
        name: fields.has("name") ? t.e_name : undefined,
        phone: fields.has("phone") ? t.e_phone : undefined,
      },
    };
  }
  const d = parsed.data;
  let newId = 0;
  let serviceName = "";

  try {
    const recent = await query<{ n: number }>(
      "SELECT count(*)::int AS n FROM applications WHERE phone = $1 AND created_at > now() - interval '2 minutes'",
      [d.phone],
    );
    if (recent[0].n > 0) return { ok: false, values: raw, error: t.e_too_fast };

    let serviceId: number | null = null;
    if (/^\d+$/.test(d.service_id)) {
      const s = await query<{ id: number; name_uz: string }>(
        "SELECT id, name_uz FROM services WHERE id = $1",
        [Number(d.service_id)],
      );
      if (s[0]) {
        serviceId = s[0].id;
        serviceName = s[0].name_uz;
      }
    }

    const inserted = await query<{ id: number }>(
      `INSERT INTO applications (name, phone, company, service_id, service_name, message, lang)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [d.name, d.phone, d.company, serviceId, serviceName, d.message, d.lang],
    );
    newId = inserted[0].id;
  } catch (e) {
    console.error("submitApplication failed", e);
    return { ok: false, values: raw, error: t.e_generic };
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  await notifyNewApplication({
    id: newId,
    name: d.name,
    phone: d.phone,
    company: d.company,
    serviceName,
    message: d.message,
    lang: d.lang,
    adminUrl: host ? `${proto}://${host}/admin` : undefined,
  });

  revalidatePath("/admin", "layout");
  return { ok: true };
}
