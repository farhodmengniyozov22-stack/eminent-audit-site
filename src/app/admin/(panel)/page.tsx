import Link from "next/link";
import { getApplications, getStatusCounts, STATUSES, type Status } from "@/lib/data";
import { saveApplicationNote } from "../actions";
import { DeleteApplicationButton, StatusSelect } from "./ApplicationControls";
import { STATUS_LABELS } from "./status";

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Asia/Tashkent",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as Status) ? (sp.status as Status) : undefined;
  const [apps, counts] = await Promise.all([getApplications(status), getStatusCounts()]);

  const tabs: { key: Status | undefined; label: string; n: number }[] = [
    { key: undefined, label: "Hammasi", n: counts.all },
    ...STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s], n: counts[s] })),
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-ink">Arizalar</h1>
      </div>

      <nav aria-label="Holat bo'yicha filtr" className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.key === status;
          return (
            <Link
              key={t.label}
              href={t.key ? `/admin?status=${t.key}` : "/admin"}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                active ? "border-ink bg-ink text-white" : "border-ledger bg-sheet hover:border-ink"
              }`}
            >
              {t.label} <span className="tnum ml-1 opacity-70">{t.n}</span>
            </Link>
          );
        })}
      </nav>

      {apps.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-ledger bg-sheet p-10 text-center">
          <p className="font-medium">Bu bo&apos;limda ariza yo&apos;q.</p>
          <p className="mt-1 text-sm text-muted">
            Saytdagi forma orqali yuborilgan arizalar shu yerda paydo bo&apos;ladi.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {apps.map((a) => (
            <li key={a.id} className="rounded-lg border border-ledger bg-sheet p-5">
              <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                <div className="min-w-[14rem] flex-1">
                  <p className="text-lg font-semibold">
                    {a.name}
                    {a.company && <span className="font-normal text-muted"> · {a.company}</span>}
                  </p>
                  <p className="mt-0.5 text-sm">
                    <a href={`tel:${a.phone.replace(/[^\d+]/g, "")}`} className="tnum font-medium text-ink hover:underline">
                      {a.phone}
                    </a>
                    <span className="text-muted">
                      {" "}
                      · {dateFmt.format(new Date(a.created_at))} · {a.lang.toUpperCase()} · №{a.id}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusSelect id={a.id} status={a.status} />
                  <DeleteApplicationButton id={a.id} name={a.name} />
                </div>
              </div>

              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <dt className="text-muted">Xizmat</dt>
                  <dd className="font-medium">{a.service_name || "Tanlanmagan"}</dd>
                  {a.message && (
                    <>
                      <dt className="mt-3 text-muted">Izoh</dt>
                      <dd className="whitespace-pre-line">{a.message}</dd>
                    </>
                  )}
                </div>
                <form action={saveApplicationNote} className="flex flex-col">
                  <input type="hidden" name="id" value={a.id} />
                  <label htmlFor={`note-${a.id}`} className="text-muted">
                    Ichki qayd (mijoz ko&apos;rmaydi)
                  </label>
                  <textarea
                    id={`note-${a.id}`}
                    name="note"
                    rows={2}
                    defaultValue={a.note}
                    className="mt-1 rounded-md border border-ledger px-3 py-2 focus:border-ink focus:outline-none"
                  />
                  <button className="mt-2 self-start rounded-md border border-ledger px-3 py-1.5 text-sm font-medium hover:border-ink">
                    Qaydni saqlash
                  </button>
                </form>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
