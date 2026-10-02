import { Mark } from "@/components/mark/Mark";
import { GlowAura } from "@/components/ui/GlowAura";

// The primary "Get in touch" button — matches cylib's exact anatomy
// (inspected via computed styles on their live Contact button): an outer
// pill with ~3px padding, a white circle badge holding the mark, and the
// label in its own padded slot — not a plain pill with an inline icon.
export function ContactButton({
  href = "/contact",
  label = "Get in touch",
  onClick,
  className,
}: {
  href?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative flex items-center rounded-lg bg-brand p-[3px] text-sm font-medium text-white transition-colors hover:bg-brand-hover ${className ?? ""}`}
    >
      <GlowAura />
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white">
        <Mark size={18} color="var(--brand)" />
      </span>
      <span className="px-3">{label}</span>
    </a>
  );
}
