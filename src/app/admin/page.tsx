import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";

// Internal tool, not a marketing page — keep it out of search results.
export const metadata: Metadata = {
  title: "Admin — ReBAT",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
