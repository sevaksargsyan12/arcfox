import { Reveal } from "@/components/ui/Reveal";

interface BrandInspiredProps {
  title: string | null;
  subtitle: string | null;
  text: string | null;
  imageUrl: string | null;
}

export function BrandInspired({ title, subtitle, text, imageUrl }: BrandInspiredProps) {
  if (!title && !subtitle && !text && !imageUrl) return null;

  return (
    <section className="about-brand-inspired py-16 md:py-24">
      <div className="container-max">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start md:gap-12">
          <div>
            {title && (
              <Reveal>
                <h2 className="font-display text-2xl font-semibold md:text-4xl">{title}</h2>
              </Reveal>
            )}
            {subtitle && (
              <Reveal delayMs={120}>
                <p className="mt-3 text-lg text-brand-blue">{subtitle}</p>
              </Reveal>
            )}
          </div>

          {imageUrl && (
            <Reveal delayMs={80} className="mx-auto w-full max-w-md md:mx-0">
              <div className="aspect-[1/1.4] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          )}
        </div>

        {text && (
          <Reveal delayMs={240} className="mt-8 rounded-2xl bg-form-bg p-6 md:p-10">
            <p className="whitespace-pre-line text-charcoal-600">{text}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
