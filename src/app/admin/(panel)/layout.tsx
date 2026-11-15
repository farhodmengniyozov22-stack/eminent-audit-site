import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { AdminNav } from "./AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen">
      <header className="border-b border-ledger bg-sheet">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3 md:px-8">
          <Link href="/admin" className="font-serif text-lg font-bold text-ink">
            Eminent Audit <span className="font-sans text-sm font-normal text-muted">admin</span>
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-5 text-sm">
            <a href="/" target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
              Saytni ochish
            </a>
            <form action={logout}>
              <button className="text-muted hover:text-bad">Chiqish</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">{children}</main>
    </div>
  );
}
