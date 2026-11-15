"use client";

import { useTransition } from "react";
import type { Status } from "@/lib/data";
import { deleteApplication, setApplicationStatus } from "../actions";
import { STATUS_LABELS, STATUS_STYLES } from "./status";

export function StatusSelect({ id, status }: { id: number; status: Status }) {
  const [pending, start] = useTransition();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Holat</span>
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          start(() => setApplicationStatus(id, v));
        }}
        className={`rounded-full border px-3 py-1.5 font-medium disabled:opacity-60 ${STATUS_STYLES[status]}`}
      >
        {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DeleteApplicationButton({ id, name }: { id: number; name: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`${name} arizasini o'chirasizmi? Buni qaytarib bo'lmaydi.`)) {
          start(() => deleteApplication(id));
        }
      }}
      className="rounded-md px-2 py-1.5 text-sm text-muted hover:text-bad disabled:opacity-60"
    >
      O&apos;chirish
    </button>
  );
}
