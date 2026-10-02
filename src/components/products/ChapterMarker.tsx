import { Reveal } from "@/components/ui/Reveal";

// A chapter divider, not a tab — no click state, no active/inactive
// styling to switch between. Both chapters render in one continuous flow;
// this just marks where one ends and the next begins.
export function ChapterMarker({ index, title, note }: { index?: string; title: string; note?: string }) {
  return (
    <Reveal className="mx-auto flex max-w-[1328px] items-baseline gap-5 px-[5vw] pt-24 pb-10">
      {index && <span className="text-sm font-medium tracking-[0.2em] text-grey-400">{index}</span>}
      <h3 className="text-2xl font-medium text-ink sm:text-3xl">{title}</h3>
      {note && <span className="ml-auto hidden text-sm text-grey-400 sm:block">{note}</span>}
    </Reveal>
  );
}
