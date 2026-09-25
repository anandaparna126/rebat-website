import type { Metadata } from "next";
import { Hanken_Grotesk, Fredoka } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Rounded geometric sans, scoped to the footer's giant wordmark only (not a
// site-wide font) — matches cylib's own footer logotype's curved/rounded
// letterform terminals (confirmed against their actual logo).
const rounded = Fredoka({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReBAT — Renew. Recover. Power.",
  description:
    "India's advanced critical mineral refining and battery recycling platform — Mandideep, Madhya Pradesh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hanken.variable} ${rounded.variable}`}>
      <body className="overflow-x-hidden bg-surface text-body font-sans antialiased">{children}</body>
    </html>
  );
}
