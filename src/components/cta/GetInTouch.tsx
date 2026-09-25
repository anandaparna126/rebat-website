import { Grain } from "@/components/ui/Grain";
import { Reveal } from "@/components/ui/Reveal";
import { GET_IN_TOUCH_PILLS, TAGLINE_EYEBROW } from "@/lib/content";

export function GetInTouch() {
  return (
    <section id="get-in-touch" className="relative overflow-hidden bg-brand px-[5vw] py-20 text-center">
      <Grain opacity={0.05} />
      <Reveal className="relative">
        <div className="mb-3 text-xs font-medium tracking-[0.08em] text-white/70 uppercase">
          {TAGLINE_EYEBROW}
        </div>
        <h2 className="mb-8 text-3xl font-medium text-white">
          Let&rsquo;s build what&rsquo;s next.
        </h2>
        <div className="flex flex-wrap justify-center gap-2.5">
          {GET_IN_TOUCH_PILLS.map((pill) => (
            <a
              key={pill.href}
              href={pill.href}
              className="group relative rounded-full border border-white/40 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50"
                style={{ background: "linear-gradient(90deg, var(--gold), #ffffff 50%, var(--gold))" }}
              />
              {pill.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
