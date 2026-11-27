import type { Metadata } from "next";
import { langAlternates, SITE_URL } from "@/lib/site";
import "../globals.css";

const title = "Eminent Audit — audit and accounting services in Tashkent";
const description =
  "Audit firm in Tashkent, Uzbekistan: statutory and voluntary audits, bookkeeping, restoration of accounting records and tax consulting. Certified auditors.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: langAlternates("en"),
  openGraph: { type: "website", siteName: "Eminent Audit", locale: "en_US", url: "/en", title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
