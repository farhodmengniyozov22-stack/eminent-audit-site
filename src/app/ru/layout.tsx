import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Eminent Audit — аудит, бухгалтерия и налоговые консультации",
  description:
    "Обязательный и инициативный аудит, ведение и восстановление учёта, налоговые консультации и отчётность по МСФО. Ташкент.",
  alternates: { languages: { uz: "/", ru: "/ru", en: "/en" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
