"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export type NavItem = { href: string; label: string; children?: { href: string; label: string }[] };

/** Ochiq panelni tashqariga bosilganda yoki Esc bosilganda yopadi */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

const panel =
  "absolute top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-ledger bg-sheet py-2 shadow-[0_18px_40px_-18px_rgba(29,51,40,0.45)]";
const panelLink =
  "block whitespace-nowrap px-5 py-2.5 text-[0.95rem] font-medium text-text transition-colors hover:bg-sand hover:text-ink";

function Chevron({ open }: { open: boolean }) {
  return (
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
  );
}

/** Katta ekrandagi menyu: "Xizmatlar" kabi bandlar ochiladigan ro'yxat bo'ladi */
export function DesktopNav({ items, label }: { items: NavItem[]; label: string }) {
  return (
    <nav aria-label={label} className="mx-auto hidden items-center gap-6 text-[0.95rem] font-medium xl:flex">
      {items.map((it) =>
        it.children?.length ? (
          <Dropdown key={it.href} item={it} />
        ) : (
          <a key={it.href} href={it.href} className="whitespace-nowrap hover:text-accent">
            {it.label}
          </a>
        ),
      )}
    </nav>
  );
}

function Dropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss(open, close);
  const listId = useId();
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={close}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        // Sichqoncha olib kelinganda allaqachon ochiladi, shuning uchun bosish faqat ochadi
        // (yopish: tashqariga bosish, Esc yoki sichqonchani olib ketish)
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 whitespace-nowrap hover:text-accent ${open ? "text-accent" : ""}`}
      >
        {item.label}
        <Chevron open={open} />
      </button>
      {/* Sichqoncha tugmadan panelga o'tganda yopilib qolmasligi uchun ko'rinmas ko'prik */}
      <div hidden={!open} className="absolute inset-x-0 top-full h-3" />
      <div id={listId} hidden={!open} className={`${panel} left-1/2 min-w-[14rem] -translate-x-1/2`}>
        {item.children!.map((ch) => (
          <a key={ch.href + ch.label} href={ch.href} onClick={close} className={panelLink}>
            {ch.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/** Kichik ekranlar uchun menyu: tugma bosilganda barcha bo'limlar ro'yxati pastda ochiladi */
export function NavMenu({ items, label, menuLabel }: { items: NavItem[]; label: string; menuLabel: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss(open, close);
  const listId = useId();

  return (
    <div ref={ref} className="relative xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={menuLabel}
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-full border-[1.5px] border-ledger text-ink transition-colors hover:border-ink/40"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <nav id={listId} aria-label={label} hidden={!open} className={`${panel} right-0 max-h-[75vh] w-64 overflow-y-auto`}>
        {items.map((it) => (
          <div key={it.href}>
            {it.children?.length ? (
              <>
                <p className="px-5 pb-1 pt-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">{it.label}</p>
                {it.children.map((ch) => (
                  <a key={ch.href + ch.label} href={ch.href} onClick={close} className={`${panelLink} pl-8`}>
                    {ch.label}
                  </a>
                ))}
              </>
            ) : (
              <a href={it.href} onClick={close} className={panelLink}>
                {it.label}
              </a>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
