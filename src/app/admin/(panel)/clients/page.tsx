import { getClients } from "@/lib/data";
import { AddClientsForm, ClientRow } from "./ClientsForm";

export default async function ClientsPage() {
  const clients = await getClients({ activeOnly: false });
  const years = [...new Set(clients.map((c) => c.year))];
  const thisYear = new Date().getFullYear();

  return (
    <>
      <h1 className="font-serif text-3xl font-semibold text-ink">Mijozlar</h1>
      <p className="mt-2 max-w-[70ch] text-muted">
        Saytdagi &quot;Mijozlar&quot; bo&apos;limida yillar bo&apos;yicha ko&apos;rsatiladi. Bo&apos;lim kamida bitta mijoz qo&apos;shilgandan
        keyin saytda paydo bo&apos;ladi. Yashirilgan mijoz saytda ko&apos;rinmaydi, lekin ro&apos;yxatda qoladi.
      </p>

      <h2 className="mt-8 font-serif text-2xl font-semibold text-ink">Yangi mijozlar qo&apos;shish</h2>
      <div className="mt-4">
        <AddClientsForm defaultYear={years[0] ?? thisYear} />
      </div>

      {years.length === 0 ? (
        <p className="mt-10 text-muted">Hozircha mijozlar yo&apos;q.</p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {years.map((y) => {
            const list = clients.filter((c) => c.year === y);
            return (
              <section key={y} className="rounded-lg border border-ledger bg-sheet">
                <h2 className="flex items-baseline justify-between border-b border-ledger px-4 py-3">
                  <span className="font-serif text-xl font-semibold text-ink">{y}-yil</span>
                  <span className="text-sm text-muted">{list.length} ta</span>
                </h2>
                <ul className="divide-y divide-ledger">
                  {list.map((c) => (
                    <ClientRow key={c.id} client={c} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
