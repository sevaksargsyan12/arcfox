import { GlobalRdSection } from "@/lib/data/global-rd";
import { PageHero } from "@/components/ui/PageHero";

export function GlobalRdSectionBody({ section }: { section: GlobalRdSection }) {
  return (
    <>
      <PageHero title={section.hero.title} subtitle={section.hero.subtitle} imageUrl={section.hero.imageUrl} />
      <div className="container-max flex flex-col gap-12 py-16 md:py-24">
        {section.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="font-display text-2xl font-semibold md:text-3xl">{s.heading}</h2>
            <p className="mt-4 max-w-3xl text-charcoal-600">{s.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
