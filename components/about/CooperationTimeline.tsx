import { PartnerTimelineEntry } from "@/lib/data/about";

export function CooperationTimeline({ entries }: { entries: PartnerTimelineEntry[] }) {
  return (
    <ol className="mt-4 flex flex-col gap-4 border-l-2 border-brand-blue/30 pl-5">
      {entries.map((entry) => (
        <li key={entry.year} className="relative">
          <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-brand-blue" />
          <p className="font-display text-sm font-semibold text-brand-blue">{entry.year}</p>
          <p className="text-sm text-charcoal-600">{entry.label}</p>
        </li>
      ))}
    </ol>
  );
}
