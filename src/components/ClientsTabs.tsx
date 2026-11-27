"use client";

import { useEffect, useState } from "react";
import { activityLabel, splitClientName, type Lang3 } from "@/lib/clients";
import { uzText } from "@/lib/uz-alphabet";

type Item = { name: string; activity: string };
type Group = { year: number; items: Item[] };
type Labels = {
  years: string;
  search: string;
  more: string;
  less: string;
  none: string;
  total: string; // "{y}" o'rniga yil, "{n}" o'rniga son qo'yiladi
  year: string; // "{y}-yil"
};

const PAGE = 24;

/** "«Namuna» MChJ" → "N" */
function firstLetter(name: string) {
  const m = name.match(/[\p{L}\p{N}]/u);
  return m ? m[0].toUpperCase() : "•";
}

/**
 * Mijozlar ro'yxati: yillar, umumiy son, qidiruv va "Yana ko'rsatish".
 * Har bir korxona yonida faoliyat turi (Excel'dagidek) — tilga moslashgan holda.
 * Korxona nomi o'zgarmaydi, tashkiliy shakli (MChJ → ООО → LLC) tilga moslashadi.
 */
export function ClientsTabs({ groups, lang, labels }: { groups: Group[]; lang: Lang3; labels: Labels }) {
  const [year, setYear] = useState(groups[0]?.year);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  // Menyudagi "2026-yil" (#mijozlar-2026) havolasi bosilganda o'sha yil ochiladi
  useEffect(() => {
    const apply = () => {
      const m = window.location.hash.match(/^#mijozlar-(\d{4})$/);
      const y = m ? Number(m[1]) : NaN;
      if (groups.some((g) => g.year === y)) {
        setYear(y);
        setOpen(false);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [groups]);

  const current = groups.find((g) => g.year === year) ?? groups[0];
  if (!current) return null;

  const query = q.trim().toLowerCase();
  const filtered = current.items.filter((it) => !query || it.name.toLowerCase().includes(query));
  const showAll = open || !!query;
  const visible = showAll ? filtered : filtered.slice(0, PAGE);
  const hidden = filtered.length - visible.length;

  return (
    <div className="mt-12">
      {/* Yillar — bitta yil bo'lsa ham ko'rinadi, mijozlar qaysi yilda xizmat olgani bilinib tursin */}
      <div role="tablist" aria-label={labels.years} className="mb-6 flex flex-wrap gap-2">
        {groups.map((g) => {
          const active = g.year === current.year;
          return (
            <button
              key={g.year}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setYear(g.year);
                setOpen(false);
              }}
              className={`tnum rounded-full px-6 py-2.5 text-base font-bold transition-colors ${
                active ? "bg-ink text-paper" : "border-[1.5px] border-ledger bg-sheet text-ink hover:border-ink/40"
              }`}
            >
              {uzText(labels.year.replace("{y}", String(g.year)), lang)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="tnum font-serif text-xl font-semibold text-ink">
          {labels.total.replace("{y}", String(current.year)).replace("{n}", String(current.items.length))}
        </p>
        <label className="relative block sm:w-80">
          <span className="sr-only">{labels.search}</span>
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.search}
            className="w-full rounded-full border-[1.5px] border-ledger bg-sheet py-2.5 pl-11 pr-4 text-sm text-text placeholder:text-muted/80 focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-muted">{labels.none}</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((it, i) => {
            const { brand, form } = splitClientName(it.name, lang);
            const act = it.activity ? uzText(activityLabel(it.activity, lang), lang) : "";
            return (
              <li key={`${it.name}-${i}`} className="flex items-start gap-3 rounded-2xl border border-ledger bg-sheet px-4 py-3.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-ink font-serif text-base font-semibold italic text-accent"
                >
                  {firstLetter(brand)}
                </span>
                <span className="min-w-0">
                  <span className="block break-words font-semibold leading-snug text-ink" title={it.name}>
                    {brand}
                    {form && <span className="ml-1.5 text-xs font-medium text-muted">{form}</span>}
                  </span>
                  {act && <span className="mt-1 block text-[0.8rem] leading-snug text-muted">{act}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {!query && filtered.length > PAGE && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            {open ? labels.less : `${labels.more} (${hidden})`}
          </button>
        </div>
      )}
    </div>
  );
}
