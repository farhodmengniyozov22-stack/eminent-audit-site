"use client";

import { useActionState, useTransition } from "react";
import type { Client } from "@/lib/data";
import { addClients, deleteClient, setClientActive, type ClientsState } from "../../actions";

const input = "mt-1 block w-full rounded-md border border-ledger bg-sheet px-3 py-2 text-sm focus:border-ink focus:outline-none";

/** Bir yo'la ko'p mijoz qo'shish formasi */
export function AddClientsForm({ defaultYear }: { defaultYear: number }) {
  const [state, action, pending] = useActionState<ClientsState, FormData>(addClients, {});
  return (
    <form action={action} className="rounded-lg border border-ledger bg-sheet p-5">
      <div className="grid gap-4 md:grid-cols-[8rem_1fr]">
        <label className="text-sm font-medium">
          Yil
          <input name="year" type="number" min={2000} max={2100} defaultValue={defaultYear} required className={`${input} tnum`} />
        </label>
        <label className="text-sm font-medium">
          Mijozlar — har qatorga bittadan
          <textarea
            name="names"
            rows={6}
            required
            placeholder={'"Namuna" MChJ\tAxborot texnologiyalari sohasidagi faoliyat\n"Misol Savdo" MChJ\tTa\'lim faoliyati\n...'}
            className={input}
          />
          <span className="mt-1 block text-xs font-normal text-muted">
            Excel&apos;dan &quot;Korxona nomi&quot; va &quot;Faoliyat turi&quot; ustunlarini birga belgilab, nusxalab shu yerga
            qo&apos;ying — faoliyat turi har bir korxona yonida chiqadi (rus va ingliz tiliga avtomatik tarjima qilinadi). Faqat nomlarni ham qo&apos;yish mumkin. Shu yilda
            allaqachon bor nomlar qayta qo&apos;shilmaydi.
          </span>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-4">
        {state.error && <span role="alert" className="text-sm text-bad">{state.error}</span>}
        {state.ok && !pending && (
          <span role="status" className="text-sm text-ok">
            {state.added} ta qo&apos;shildi{state.skipped ? `, ${state.skipped} ta takror nom o'tkazib yuborildi` : ""}
          </span>
        )}
        <button
          disabled={pending}
          className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Qo'shilmoqda…" : "Mijozlarni qo'shish"}
        </button>
      </div>
    </form>
  );
}

/** Bitta mijoz qatori: saytda ko'rsatish / yashirish va o'chirish */
export function ClientRow({ client }: { client: Client }) {
  const [pending, start] = useTransition();
  return (
    <li className={`flex items-center gap-3 px-4 py-2.5 text-sm ${client.active ? "" : "text-muted line-through"}`}>
      <span className="min-w-0 flex-1 truncate">{client.name}</span>
      {client.activity && (
        <span className="hidden max-w-[45%] shrink-0 truncate text-xs text-muted md:inline" title={client.activity}>
          {client.activity}
        </span>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => setClientActive(client.id, !client.active))}
        className="shrink-0 rounded px-2 py-1 text-xs text-muted hover:bg-paper hover:text-ink disabled:opacity-50"
      >
        {client.active ? "Yashirish" : "Ko'rsatish"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm(`"${client.name}" mijozini o'chirasizmi?`)) start(() => deleteClient(client.id));
        }}
        className="shrink-0 rounded px-2 py-1 text-xs text-muted hover:bg-paper hover:text-bad disabled:opacity-50"
      >
        O&apos;chirish
      </button>
    </li>
  );
}
