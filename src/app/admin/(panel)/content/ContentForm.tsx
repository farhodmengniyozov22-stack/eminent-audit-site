"use client";

import { useActionState } from "react";
import { CONTENT_FIELDS } from "@/lib/content-fields";
import { saveContent, type ContentState } from "../../actions";

const input = "mt-1 block w-full rounded-md border border-ledger bg-sheet px-3 py-2 text-sm focus:border-ink focus:outline-none";

export function ContentForm({ values }: { values: Record<string, { uz: string; ru: string }> }) {
  const [state, action, pending] = useActionState<ContentState, FormData>(saveContent, {});
  const groups = [...new Set(CONTENT_FIELDS.map((f) => f.group))];

  return (
    <form action={action} className="mt-8 space-y-8 pb-24">
      {groups.map((g) => (
        <fieldset key={g} className="rounded-lg border border-ledger bg-sheet p-5">
          <legend className="px-2 font-serif text-xl font-semibold text-ink">{g}</legend>
          <div className="space-y-5">
            {CONTENT_FIELDS.filter((f) => f.group === g).map((f) => {
              const v = values[f.key] ?? { uz: f.uz, ru: f.ru };
              const Field = f.multiline ? "textarea" : "input";
              const extra = f.multiline ? { rows: 3 } : {};
              if (f.shared) {
                return (
                  <label key={f.key} className="block text-sm font-medium md:w-1/2">
                    {f.label}
                    <Field name={`${f.key}__uz`} defaultValue={v.uz} className={input} {...extra} />
                  </label>
                );
              }
              return (
                <div key={f.key}>
                  <p className="text-sm font-medium">{f.label}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-xs text-muted">
                      O&apos;zbekcha
                      <Field name={`${f.key}__uz`} defaultValue={v.uz} className={input} {...extra} />
                    </label>
                    <label className="text-xs text-muted">
                      Ruscha
                      <Field name={`${f.key}__ru`} defaultValue={v.ru} className={input} {...extra} />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="fixed inset-x-0 bottom-0 border-t border-ledger bg-sheet/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-5 py-3 md:px-8">
          {state.ok && !pending && <span role="status" className="text-sm text-ok">Matnlar saqlandi</span>}
          {state.error && <span role="alert" className="text-sm text-bad">{state.error}</span>}
          <button
            disabled={pending}
            className="rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft disabled:opacity-60"
          >
            {pending ? "Saqlanmoqda…" : "Matnlarni saqlash"}
          </button>
        </div>
      </div>
    </form>
  );
}
