import { PartnerTimelineEntry } from "@/lib/data/about";
import { Reveal } from "@/components/ui/Reveal";

export function CooperationTimeline({ entries }: { entries: PartnerTimelineEntry[] }) {
  return (
    <ol className="mt-4 flex flex-col gap-4 border-l-2 border-brand-blue/30 pl-5">
      {entries.map((entry, i) => (
        <Reveal key={entry.year + i} as="li" delayMs={i * 100} className="relative">
          <span className="absolute -left-6.75 top-1 h-3 w-3 rounded-full bg-brand-blue" />
          <p className="font-display text-sm font-semibold text-brand-blue">{entry.year}</p>
          <p className="text-sm text-charcoal-600">{entry.label}</p>
        </Reveal>
      ))}
    </ol>
  );
}
