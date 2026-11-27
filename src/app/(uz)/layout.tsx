import type { Metadata } from "next";
import { langAlternates, SITE_URL } from "@/lib/site";
import { uzText } from "@/lib/uz-alphabet";
import "../globals.css";

const title = uzText("Eminent Audit — audit va buxgalteriya xizmatlari, Toshkent", "uz");
const description = uzText(
  "Toshkentdagi auditorlik firmasi: majburiy va ixtiyoriy audit, buxgalteriya hisobini yuritish va qayta tiklash, soliq maslahati. Sertifikatlangan auditorlar.",
  "uz",
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: langAlternates("uz"),
  openGraph: { type: "website", siteName: "Eminent Audit", locale: "uz_UZ", url: "/", title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
