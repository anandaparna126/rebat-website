import { Mark } from "@/components/mark/Mark";
import { GlowAura } from "@/components/ui/GlowAura";

// Same anatomy as ContactButton (pill, white mark-badge, label) but a real
// <button> that opens an EnquiryModal in place instead of navigating — the
// contextual-CTA half of cylib's real pattern. ContactButton itself stays
// untouched and keeps navigating to /contact; that's deliberately reserved
// for "Get in touch" buttons specifically.
export function EnquiryButton({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center rounded-full bg-brand p-[3px] text-sm font-medium text-white transition-colors hover:bg-brand-hover ${className ?? ""}`}
    >
      <GlowAura />
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        <Mark size={18} color="var(--brand)" />
      </span>
      <span className="px-3">{label}</span>
    </button>
  );
}
