"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Arizalar" },
  { href: "/admin/services", label: "Xizmatlar" },
  { href: "/admin/clients", label: "Mijozlar" },
  { href: "/admin/content", label: "Sayt matnlari" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin menyu" className="flex gap-1 text-sm">
      {items.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 font-medium ${active ? "bg-ink text-white" : "text-text hover:bg-paper"}`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
