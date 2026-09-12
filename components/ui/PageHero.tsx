interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
}

/** Shared hero banner for content-marketing pages (About, Partners, Global R&D). */
export function PageHero({ title, subtitle, imageUrl }: PageHeroProps) {
  return (
    <section className="relative flex h-[380px] items-center justify-center overflow-hidden md:h-[480px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="container-max relative z-10 text-center text-white">
        {subtitle && (
          <p className="font-display text-sm uppercase tracking-widest text-white/80">{subtitle}</p>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">{title}</h1>
      </div>
    </section>
  );
}
