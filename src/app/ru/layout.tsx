import type { Metadata } from "next";
import { langAlternates, SITE_URL } from "@/lib/site";
import "../globals.css";

const title = "Eminent Audit — аудит и бухгалтерские услуги в Ташкенте";
const description =
  "Аудиторская компания в Ташкенте: обязательный и инициативный аудит, ведение и восстановление бухучёта, налоговые консультации. Сертифицированные аудиторы.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: langAlternates("ru"),
  openGraph: { type: "website", siteName: "Eminent Audit", locale: "ru_RU", url: "/ru", title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
