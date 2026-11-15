"use client";

import { useActionState, useEffect, useState } from "react";
import { submitApplication, type ApplyState } from "@/app/actions";
import type { Dict, Lang } from "@/lib/i18n";

type ServiceOption = { id: number; name: string };

const fieldCls =
  "mt-1.5 block w-full rounded-md border border-ledger bg-sheet px-3.5 py-2.5 text-base text-text placeholder:text-muted/70 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-stamp";

export function ApplicationForm(props: { lang: Lang; t: Dict; services: ServiceOption[] }) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState("");

  // Narxlar jadvalidagi "Tanlash" tugmasi xizmatni shu yerda tanlaydi
  useEffect(() => {
    const onPick = (e: Event) => setSelected(String((e as CustomEvent<number>).detail));
    window.addEventListener("ea:pick-service", onPick);
    return () => window.removeEventListener("ea:pick-service", onPick);
  }, []);

  return (
    <FormInner
      key={round}
      {...props}
      selected={selected}
      setSelected={setSelected}
      onReset={() => {
        setSelected("");
        setRound((r) => r + 1);
      }}
    />
  );
}

function FormInner({
  lang,
  t,
  services,
  selected,
  setSelected,
  onReset,
}: {
  lang: Lang;
  t: Dict;
  services: ServiceOption[];
  selected: string;
  setSelected: (v: string) => void;
  onReset: () => void;
}) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitApplication, { ok: false });

  const v = state.values ?? {};

  if (state.ok) {
    return (
      <div role="status" className="rounded-lg border border-ledger bg-sheet p-8">
        <p className="font-serif text-2xl font-semibold text-ink">{t.f_success_title}</p>
        <p className="mt-2 text-muted">{t.f_success_text}</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 text-sm font-medium text-ink underline underline-offset-4"
        >
          {t.f_again}
        </button>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="rounded-lg border border-ledger bg-sheet p-6 md:p-8">
      <input type="hidden" name="lang" value={lang} />
      {/* bot tuzog'i */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="f-name" className="text-sm font-medium">
            {t.f_name}
          </label>
          <input
            id="f-name"
            name="name"
            autoComplete="name"
            required
            defaultValue={v.name}
            aria-invalid={!!state.fieldErrors?.name}
            aria-describedby={state.fieldErrors?.name ? "e-name" : undefined}
            className={fieldCls}
          />
          {state.fieldErrors?.name && (
            <p id="e-name" className="mt-1.5 text-sm text-bad">
              {state.fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="f-phone" className="text-sm font-medium">
            {t.f_phone}
          </label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+998 __ ___ __ __"
            defaultValue={v.phone}
            aria-invalid={!!state.fieldErrors?.phone}
            aria-describedby={state.fieldErrors?.phone ? "e-phone" : undefined}
            className={`${fieldCls} tnum`}
          />
          {state.fieldErrors?.phone && (
            <p id="e-phone" className="mt-1.5 text-sm text-bad">
              {state.fieldErrors.phone}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="f-company" className="text-sm font-medium">
            {t.f_company} <span className="font-normal text-muted">({t.f_optional})</span>
          </label>
          <input id="f-company" name="company" autoComplete="organization" defaultValue={v.company} className={fieldCls} />
        </div>
        <div>
          <label htmlFor="f-service" className="text-sm font-medium">
            {t.f_service}
          </label>
          <select
            id="f-service"
            name="service_id"
            value={selected || v.service_id || ""}
            onChange={(e) => setSelected(e.target.value)}
            className={fieldCls}
          >
            <option value="">{t.f_service_any}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="f-message" className="text-sm font-medium">
            {t.f_message} <span className="font-normal text-muted">({t.f_optional})</span>
          </label>
          <textarea
            id="f-message"
            name="message"
            rows={4}
            placeholder={t.f_message_ph}
            defaultValue={v.message}
            className={fieldCls}
          />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="mt-5 rounded-md bg-bad/8 px-4 py-3 text-sm text-bad">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-ink px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-ink-soft disabled:opacity-60 sm:w-auto"
      >
        {pending ? t.f_sending : t.f_submit}
      </button>
    </form>
  );
}

export function PickServiceButton({ id, label }: { id: number; label: string }) {
  return (
    <a
      href="#ariza"
      onClick={() => window.dispatchEvent(new CustomEvent("ea:pick-service", { detail: id }))}
      className="text-sm font-medium text-ink underline decoration-ledger decoration-2 underline-offset-4 hover:decoration-ink"
    >
      {label}
    </a>
  );
}
