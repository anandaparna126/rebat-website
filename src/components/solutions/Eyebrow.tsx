export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`mb-5 text-xs font-medium tracking-[0.14em] uppercase ${
        light ? "text-white/60" : "text-grey-600"
      }`}
    >
      {children}
    </div>
  );
}
