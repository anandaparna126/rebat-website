import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReBAT Admin",
  description: "Manage the ReBAT website: enquiries, newsroom, jobs and admin users.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
