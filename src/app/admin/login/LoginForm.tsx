"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6">
      <label htmlFor="password" className="text-sm font-medium">
        Parol
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="mt-1.5 block w-full rounded-md border border-ledger px-3.5 py-2.5 focus:border-ink focus:outline-none"
      />
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-bad">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="mt-5 w-full rounded-md bg-ink px-4 py-2.5 font-semibold text-white hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Tekshirilmoqda…" : "Kirish"}
      </button>
    </form>
  );
}
