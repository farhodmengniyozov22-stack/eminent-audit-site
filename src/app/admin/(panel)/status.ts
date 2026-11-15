import type { Status } from "@/lib/data";

export const STATUS_LABELS: Record<Status, string> = {
  new: "Yangi",
  in_progress: "Jarayonda",
  done: "Bajarildi",
  rejected: "Rad etildi",
};

export const STATUS_STYLES: Record<Status, string> = {
  new: "border-stamp/40 bg-stamp/8 text-stamp",
  in_progress: "border-warn/40 bg-warn/8 text-warn",
  done: "border-ok/40 bg-ok/8 text-ok",
  rejected: "border-bad/30 bg-bad/6 text-bad",
};
