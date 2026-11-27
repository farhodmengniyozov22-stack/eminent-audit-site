"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABELS, CLIENT_CATEGORIES, splitClientName, type ClientCategory, type Lang3 } from "@/lib/clients";
import { uzText } from "@/lib/uz-alphabet";

type Item = { name: string; category: string };
type Group = { year: number; items: Item[] };
type Labels = {
  years: string;
  all: string;
  search: string;
  more: string;
  less: string;
  none: string;
  total: string; // "{n}" o'rniga son qo'yiladi
};

const PAGE = 24;

/** "«Namuna» MChJ" → "N" */
function firstLetter(name: string) {
  const m = name.match(/[\p{L}\p{N}]/u);
  return m ? m[0].toUpperCase() : "•";
}

/**
 * Mijozlar ro'yxati: yillar, soha bo'yicha saralash, qidiruv va "Yana ko'rsatish".
 * Korxona nomi o'zgarmaydi, tashkiliy shakli (MChJ → ООО → LLC) va soha nomi tilga moslashadi.
 */
export function ClientsTabs({ groups, lang, labels }: { groups: Group[]; lang: Lang3; labels: Labels }) {
  const [year, setYear] = useState(groups[0]?.year);
  const [cat, setCat] = useState<ClientCategory | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const current = groups.find((g) => g.year === year) ?? groups[0];

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const it of current?.items ?? []) c[it.category] = (c[it.category] ?? 0) + 1;
    return c;
  }, [current]);

  const cats = CLIENT_CATEGORIES.filter((k) => counts[k]);
  const query = q.trim().toLowerCase();
  const filtered = (current?.items ?? []).filter(
    (it) => (cat === "all" || it.category === cat) && (!query || it.name.toLowerCase().includes(query)),
  );
  // Qidiruv yoki soha tanlanganda hammasi ko'rinadi; aks holda dastlab PAGE ta
  const showAll = open || !!query || cat !== "all";
  const visible = showAll ? filtered : filtered.slice(0, PAGE);
  const hidden = filtered.length - visible.length;

  if (!current) return null;

  const chip = (active: boolean) =>
    `tnum inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      active ? "bg-ink text-paper" : "border-[1.5px] border-ledger bg-sheet text-ink hover:border-ink/40"
    }`;

  return (
    <div className="mt-12">
      {groups.length > 1 && (
        <div role="tablist" aria-label={labels.years} className="mb-5 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g.year}
              type="button"
              role="tab"
              aria-selected={g.year === current.year}
              onClick={() => {
                setYear(g.year);
                setCat("all");
                setOpen(false);
              }}
              className={chip(g.year === current.year)}
            >
              {g.year}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>
            {labels.all}
            <span className={cat === "all" ? "text-accent" : "text-muted"}>{current.items.length}</span>
          </button>
          {cats.map((k) => (
            <button key={k} type="button" aria-pressed={cat === k} onClick={() => setCat(k)} className={chip(cat === k)}>
              {uzText(CATEGORY_LABELS[k][lang], lang)}
              <span className={cat === k ? "text-accent" : "text-muted"}>{counts[k]}</span>
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
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
            const catRaw = CATEGORY_LABELS[it.category as ClientCategory]?.[lang];
            const catLabel = catRaw ? uzText(catRaw, lang) : "";
            return (
              <li key={`${it.name}-${i}`} className="flex items-center gap-3 rounded-2xl border border-ledger bg-sheet px-4 py-3">
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink font-serif text-base font-semibold italic text-accent"
                >
                  {firstLetter(brand)}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 block break-words font-semibold leading-snug text-ink" title={it.name}>
                    {brand}
                  </span>
                  <span className="block truncate text-xs text-muted">{[form, catLabel].filter(Boolean).join(" · ")}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {!query && cat === "all" && filtered.length > PAGE && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            {open ? labels.less : `${labels.more} (${hidden})`}
          </button>
          <span className="text-xs text-muted">{labels.total.replace("{n}", String(filtered.length))}</span>
        </div>
      )}
    </div>
  );
}
