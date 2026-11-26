import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Eminent Audit — audit, buxgalteriya va soliq maslahati",
  description:
    "Majburiy va tashabbusli audit, buxgalteriya hisobini yuritish va tiklash, soliq maslahati va XBXS bo'yicha hisobot. Toshkent.",
  alternates: { languages: { uz: "/", ru: "/ru", en: "/en" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
