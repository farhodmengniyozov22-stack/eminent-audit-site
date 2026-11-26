import type { Metadata } from "next";
import { uzText } from "@/lib/uz-alphabet";
import "../globals.css";

export const metadata: Metadata = {
  title: uzText("Eminent Audit — audit, buxgalteriya va soliq maslahati", "uz"),
  description: uzText(
    "Majburiy va tashabbusli audit, buxgalteriya hisobini yuritish va qayta tiklash, soliq maslahati. Toshkent.",
    "uz",
  ),
  alternates: { languages: { uz: "/", ru: "/ru", en: "/en" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
