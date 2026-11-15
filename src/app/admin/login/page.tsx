import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (process.env.SESSION_SECRET && (await isAdmin())) redirect("/admin");
  return (
    <main className="ledger-bg flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-lg border border-ledger bg-sheet p-8 shadow-[0_1px_0_var(--color-ledger)]">
        <p className="font-serif text-2xl font-bold text-ink">Eminent Audit</p>
        <h1 className="mt-1 text-muted">Admin panelga kirish</h1>
        <LoginForm />
      </div>
    </main>
  );
}
