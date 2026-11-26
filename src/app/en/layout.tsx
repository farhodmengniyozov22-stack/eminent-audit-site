import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Eminent Audit — audit, accounting and tax consulting",
  description:
    "Statutory and voluntary audits, bookkeeping, restoration of accounting records and tax consulting. Tashkent, Uzbekistan.",
  alternates: { languages: { uz: "/", ru: "/ru", en: "/en" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
