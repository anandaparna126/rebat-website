// The soft blurred, multicolor glow that fades in behind cylib's buttons on
// hover — recolored to our emerald/gold family. Place inside a `relative
// group` wrapper alongside the visible button content.
export function GlowAura() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-2.5 -z-10 rounded-lg opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
      style={{
        background:
          "linear-gradient(90deg, var(--gold), var(--brand-hover) 45%, var(--brand) 75%, var(--gold))",
      }}
    />
  );
}
