"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { LANG_PATH, LANGS, type Lang } from "@/lib/i18n";
import { uzText } from "@/lib/uz-alphabet";

const NAMES: Record<Lang, string> = { uz: uzText("O'zbekcha", "uz"), ru: "Русский", en: "English" };

/** Til tanlagich: joriy til tugmada, bosilganda boshqa tillar pastda ochiladi */
export function LangSwitcher({ lang, label }: { lang: Lang; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Tashqariga bosilganda yoki Esc bosilganda yopiladi
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`${label}: ${NAMES[lang]}`}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[0.8rem] font-bold tracking-wide text-paper shadow-[0_6px_16px_-8px_rgba(29,51,40,0.6)] transition-colors hover:bg-ink-soft"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
        </svg>
        {lang.toUpperCase()}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <ul
        id={listId}
        hidden={!open}
        className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[10.5rem] overflow-hidden rounded-2xl border border-ledger bg-sheet py-1.5 shadow-[0_18px_40px_-18px_rgba(29,51,40,0.45)]"
      >
        {LANGS.filter((l) => l !== lang).map((l) => (
          <li key={l}>
            <Link
              href={LANG_PATH[l]}
              hrefLang={l}
              lang={l}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[0.92rem] font-medium text-text transition-colors hover:bg-sand hover:text-ink"
            >
              <span className="w-6 text-[0.75rem] font-bold tracking-wide text-accent">{l.toUpperCase()}</span>
              {NAMES[l]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
