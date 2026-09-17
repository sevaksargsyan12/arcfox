import { Reveal } from "@/components/ui/Reveal";
import { AboutMetric } from "@/lib/data/about";

interface GlobalPlanProps {
  title: string | null;
  subtitle: string | null;
  content: string | null;
  imageUrl: string | null;
  metrics: AboutMetric[];
}

export function GlobalPlan({ title, subtitle, content, imageUrl, metrics }: GlobalPlanProps) {
  if (!title && !subtitle && !content && !imageUrl && metrics.length === 0) return null;

  return (
    <section className="about-global-plan py-16 md:py-24">
      <div className="container-max">
        <div className="max-w-2xl">
          {title && (
            <Reveal>
              <h2 className="font-display text-2xl font-semibold md:text-4xl">{title}</h2>
            </Reveal>
          )}
          {subtitle && (
            <Reveal delayMs={120}>
              <p className="mt-2 font-display text-5xl font-bold text-accent-gold-dark md:text-7xl">
                {subtitle}
              </p>
            </Reveal>
          )}
          {content && (
            <Reveal delayMs={240}>
              <p className="mt-4 whitespace-pre-line text-charcoal-600">{content}</p>
            </Reveal>
          )}
        </div>

        {(imageUrl || metrics.length > 0) && (
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            {imageUrl && (
              <Reveal>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full rounded-2xl object-cover" />
              </Reveal>
            )}
            {metrics.length > 0 && (
              <ul className="divide-y divide-charcoal-500/15 border-y border-charcoal-500/15">
                {metrics.map((m, i) => (
                  <Reveal as="li" key={`${m.title ?? ""}-${i}`} delayMs={i * 80} className="py-5">
                    {m.title && (
                      <p className="font-display text-xl font-semibold md:text-2xl">{m.title}</p>
                    )}
                    {m.content && <p className="mt-1 text-sm text-charcoal-600">{m.content}</p>}
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
