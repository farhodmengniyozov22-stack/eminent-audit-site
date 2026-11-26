import { getAllContent } from "@/lib/data";
import { ContentForm } from "./ContentForm";

export default async function ContentPage() {
  const rows = await getAllContent();
  const values: Record<string, { uz: string; ru: string; en: string }> = {};
  for (const r of rows) values[r.key] = { uz: r.uz, ru: r.ru, en: r.en };
  return (
    <>
      <h1 className="font-serif text-3xl font-semibold text-ink">Sayt matnlari</h1>
      <p className="mt-2 max-w-[70ch] text-muted">
        Har bir matn uch tilda: o&apos;zbekcha, ruscha va inglizcha. Sarlavhada *so&apos;z* deb yozilgan qism oltin qiya bo&apos;ladi. Saqlangandan keyin o&apos;zgarishlar saytda darhol ko&apos;rinadi. Uzun matnda yangi
        xatboshi uchun bo&apos;sh qator qoldiring.
      </p>
      <ContentForm values={values} />
    </>
  );
}
