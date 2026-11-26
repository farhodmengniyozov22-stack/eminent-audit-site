"use client";

import { useActionState, useTransition } from "react";
import type { Service } from "@/lib/data";
import { deleteService, saveService, type ServiceState } from "../../actions";

const input = "mt-1 block w-full rounded-md border border-ledger bg-sheet px-3 py-2 text-sm focus:border-ink focus:outline-none";

export function ServiceForm({ service }: { service?: Service }) {
  const [state, action, pending] = useActionState<ServiceState, FormData>(saveService, {});
  const [deleting, startDelete] = useTransition();
  const isNew = !service;

  return (
    <form
      action={action}
      className={`rounded-lg border bg-sheet p-5 ${service && !service.active ? "border-dashed border-ledger opacity-75" : "border-ledger"}`}
    >
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium">
          Nomi (o&apos;zbekcha)
          <input name="name_uz" required defaultValue={service?.name_uz} className={input} />
        </label>
        <label className="text-sm font-medium">
          Nomi (ruscha)
          <input name="name_ru" required defaultValue={service?.name_ru} className={input} />
        </label>
        <label className="text-sm font-medium">
          Nomi (inglizcha)
          <input name="name_en" defaultValue={service?.name_en} className={input} />
        </label>
        <label className="text-sm font-medium">
          Tavsif (o&apos;zbekcha)
          <textarea name="desc_uz" rows={2} defaultValue={service?.desc_uz} className={input} />
        </label>
        <label className="text-sm font-medium">
          Tavsif (ruscha)
          <textarea name="desc_ru" rows={2} defaultValue={service?.desc_ru} className={input} />
        </label>
        <label className="text-sm font-medium">
          Tavsif (inglizcha)
          <textarea name="desc_en" rows={2} defaultValue={service?.desc_en} className={input} />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
        <label className="w-28 text-sm font-medium">
          Tartib
          <input name="sort" type="number" defaultValue={service?.sort ?? 100} className={`${input} tnum`} />
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={service?.active ?? true} className="size-4 accent-ink" />
          Saytda ko&apos;rsatish
        </label>

        <div className="ml-auto flex items-center gap-3">
          {state.error && <span role="alert" className="text-sm text-bad">{state.error}</span>}
          {state.ok && !pending && <span role="status" className="text-sm text-ok">Saqlandi</span>}
          {service && (
            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                if (window.confirm(`"${service.name_uz}" xizmatini o'chirasizmi? Eski arizalarda nomi saqlanib qoladi.`)) {
                  startDelete(() => deleteService(service.id));
                }
              }}
              className="rounded-md px-3 py-2 text-sm text-muted hover:text-bad"
            >
              O&apos;chirish
            </button>
          )}
          <button
            disabled={pending}
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft disabled:opacity-60"
          >
            {pending ? "Saqlanmoqda…" : isNew ? "Xizmatni qo'shish" : "Saqlash"}
          </button>
        </div>
      </div>
    </form>
  );
}
