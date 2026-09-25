"use client";

import { useState } from "react";
import { Mark } from "@/components/mark/Mark";
import { MessagesPanel } from "@/components/admin/MessagesPanel";
import { NewsroomPanel } from "@/components/admin/NewsroomPanel";

type Section = "messages" | "newsroom";

const NAV: { id: Section; label: string }[] = [
  { id: "messages", label: "Messages" },
  { id: "newsroom", label: "Newsroom" },
];

export function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>("messages");

  return (
    <div className="flex min-h-svh bg-grey-50">
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-grey-200 bg-white px-4 py-6">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand">
            <Mark size={16} color="white" />
          </span>
          <span className="text-sm font-bold text-ink">ReBAT admin</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`rounded-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                section === item.id ? "bg-brand text-white" : "text-grey-600 hover:bg-grey-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 rounded-full border border-grey-200 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand"
        >
          Log out
        </button>
      </aside>

      <main className="min-w-0 flex-1 px-8 py-10">
        <div className="mx-auto max-w-[900px]">
          {section === "messages" && <MessagesPanel />}
          {section === "newsroom" && <NewsroomPanel />}
        </div>
      </main>
    </div>
  );
}
