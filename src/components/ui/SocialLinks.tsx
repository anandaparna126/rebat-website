import { SOCIAL_LINKS } from "@/lib/content";

const ICONS: Record<(typeof SOCIAL_LINKS)[number]["label"], string> = {
  Facebook: "M14 8.5h2.5V5.5h-2.5c-2.2 0-4 1.8-4 4v2H8v3h2.5v7h3v-7h2.4l.6-3h-3v-2c0-.55.45-1 1-1z",
  Instagram:
    "M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm4 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5-.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  "X (Twitter)": "M5 4h3.6l4 5.4L17 4h2.4l-5.7 6.9L20 20h-3.6l-4.4-5.9L6.8 20H4.4l6-7.3L5 4z",
  LinkedIn:
    "M6.94 8.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88zM5.5 10h2.9v9.5H5.5V10zm5.3 0h2.78v1.3h.04c.39-.73 1.33-1.5 2.74-1.5 2.93 0 3.47 1.93 3.47 4.44v5.26h-2.9v-4.66c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.74h-2.9V10z",
  Pinterest:
    "M12 4a8 8 0 0 0-2.9 15.44c-.04-.65-.08-1.66.02-2.38.09-.65.6-4.15.6-4.15s-.15-.3-.15-.75c0-.7.4-1.23.91-1.23.43 0 .64.32.64.71 0 .43-.28 1.08-.42 1.68-.12.5.25.92.75.92.9 0 1.59-.95 1.59-2.32 0-1.21-.87-2.06-2.11-2.06-1.44 0-2.28 1.08-2.28 2.19 0 .43.17.9.38 1.15a.15.15 0 0 1 .03.15c-.04.15-.12.5-.14.57-.02.09-.07.11-.17.07-.63-.29-1.02-1.21-1.02-1.94 0-1.58 1.15-3.03 3.31-3.03 1.74 0 3.09 1.24 3.09 2.9 0 1.73-1.09 3.12-2.6 3.12-.51 0-.99-.27-1.15-.58l-.31 1.19c-.11.44-.42 1-.63 1.33A8 8 0 1 0 12 4z",
};

// Real profiles only (rebat.in's own live footer) — no platform is listed
// unless it's an account that actually exists.
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={ICONS[link.label]} />
          </svg>
        </a>
      ))}
    </div>
  );
}
