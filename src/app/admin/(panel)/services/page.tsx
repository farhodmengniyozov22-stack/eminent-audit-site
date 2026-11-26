import { getServices } from "@/lib/data";
import { ServiceForm } from "./ServiceForm";

export default async function ServicesPage() {
  const services = await getServices({ activeOnly: false });
  return (
    <>
      <h1 className="font-serif text-3xl font-semibold text-ink">Xizmatlar</h1>
      <p className="mt-2 max-w-[70ch] text-muted">
        Narxlar saytda ko&apos;rsatilmaydi — mijoz &quot;Narxini bilish&quot; tugmasi orqali ariza qoldiradi. Tartib raqami
        kichik bo&apos;lgan xizmat yuqorida turadi. Xizmatni o&apos;chirmasdan yashirish uchun &quot;Saytda ko&apos;rsatish&quot; belgisini
        olib tashlang.
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
