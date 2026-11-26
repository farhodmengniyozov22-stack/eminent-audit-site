"use client";

import { useState } from "react";

type Group = { year: number; names: string[] };

/** "«Namuna» MChJ" → "N" (qo'shtirnoq va belgilarsiz birinchi harf) */
function firstLetter(name: string) {
  const m = name.match(/[\p{L}\p{N}]/u);
  return m ? m[0].toUpperCase() : "•";
}

/** Mijozlar ro'yxati: yuqorida yillar tugmalari, pastda tanlangan yilning mijozlari */
export function ClientsTabs({ groups, yearLabel }: { groups: Group[]; yearLabel: string }) {
  const [year, setYear] = useState(groups[0]?.year);
  const current = groups.find((g) => g.year === year) ?? groups[0];
  if (!current) return null;

  return (
    <div className="mt-12">
      {groups.length > 1 && (
        <div role="tablist" aria-label={yearLabel} className="flex flex-wrap gap-2">
          {groups.map((g) => {
            const active = g.year === current.year;
            return (
              <button
                key={g.year}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setYear(g.year)}
                className={`tnum rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  active ? "bg-ink text-paper" : "border-[1.5px] border-ledger text-ink hover:border-ink/40"
                }`}
              >
                {g.year}
                <span className={`ml-2 text-xs font-medium ${active ? "text-accent" : "text-muted"}`}>{g.names.length}</span>
              </button>
            );
          })}
        </div>
      )}

      <ul role={groups.length > 1 ? "tabpanel" : undefined} className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${groups.length > 1 ? "mt-6" : ""}`}>
        {current.names.map((n, i) => (
          <li key={i} className="flex items-center gap-3.5 rounded-2xl border border-ledger bg-sheet px-4 py-3.5">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink font-serif text-lg font-semibold italic text-accent"
            >
              {firstLetter(n)}
            </span>
            <span className="min-w-0 font-semibold leading-snug text-ink">{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
