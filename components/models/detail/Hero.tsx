interface ModelHeroProps {
  images: string[];
  name: string;
  tagline: string;
  bodyType: string;
}

export function Hero({ images, name, tagline, bodyType }: ModelHeroProps) {
  return (
    // -mt-20 pulls the hero up under the sticky header, matching the home
    // hero's overlay treatment (see components/home/Hero.tsx).
    <section className="relative -mt-20 flex h-140 items-center justify-center overflow-hidden md:h-190">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[0]} alt={name} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="container-max relative z-10 flex h-full flex-col items-start justify-end pb-20 text-white">
        <p className="font-display text-sm uppercase tracking-widest text-white/80">{bodyType}</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">{name}</h1>
        <p className="mt-3 max-w-md text-white/85">{tagline}</p>
      </div>
    </section>
  );
}
