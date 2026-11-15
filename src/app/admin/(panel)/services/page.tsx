import { getServices } from "@/lib/data";
import { ServiceForm } from "./ServiceForm";

export default async function ServicesPage() {
  const services = await getServices({ activeOnly: false });
  return (
    <>
      <h1 className="font-serif text-3xl font-semibold text-ink">Xizmatlar va narxlar</h1>
      <p className="mt-2 max-w-[70ch] text-muted">
        Narx so&apos;mda, faqat raqam bilan kiritiladi. 0 qo&apos;yilsa, saytda &quot;Kelishilgan holda&quot; deb
        chiqadi. Tartib raqami kichik bo&apos;lgan xizmat yuqorida turadi.
      </p>

      <div className="mt-8 space-y-4">
        {services.map((s) => (
          <ServiceForm key={s.id} service={s} />
        ))}
      </div>

      <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">Yangi xizmat qo&apos;shish</h2>
      <div className="mt-4">
        <ServiceForm key={`new-${services.length}`} />
      </div>
    </>
  );
}
