import { Reveal } from "@/components/ui/Reveal";
import { AboutBrandPhilosophyItem } from "@/lib/data/about";

interface BrandPhilosophyProps {
  title: string | null;
  items: AboutBrandPhilosophyItem[];
}

export function BrandPhilosophy({ title, items }: BrandPhilosophyProps) {
  if (!title && items.length === 0) return null;

  return (
    <section className="about-brand-philosophy py-16 md:py-24">
      <div className="container-max">
        {title && (
          <Reveal className="text-center">
            <h2 className="font-display text-2xl font-semibold md:text-4xl">{title}</h2>
          </Reveal>
        )}

        {items.length > 0 && (
          <div className="mt-10 flex flex-col gap-6 md:flex-row">
            {items.map((item, i) => (
              <Reveal key={`${item.title ?? ""}-${i}`} delayMs={120 + i * 100} className="md:flex-1">
                <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 transition-colors duration-300 md:bg-black/25 md:group-hover:bg-black/50" />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-white">
                    {item.title && (
                      <p className="font-display text-lg font-semibold md:text-xl">{item.title}</p>
                    )}
                    {item.content && (
                      // Hover-reveal only applies on desktop (md: and up,
                      // this project's 1200px swap point) where hover
                      // actually exists as an input -- on touch devices
                      // there's no hover surface, so itemContent is shown by
                      // default instead of being hidden behind an
                      // interaction that can't happen. Flagging per the
                      // task: revisit if a different mobile treatment
                      // (tap-to-expand, always-collapsed, etc.) is wanted.
                      <p className="max-w-[26ch] text-sm text-white/90 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
