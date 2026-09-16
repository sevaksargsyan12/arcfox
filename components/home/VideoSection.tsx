interface VideoSectionProps {
  videoUrl: string | null;
  posterUrl: string | null;
  videoTitle: string | null;
  videoSubtitle: string | null;
  videoButtonText: string | null;
  buttonLink: string | null;
}

/**
 * Full-width, autoplaying background video -- no play/pause control (unlike
 * the Model page's click-to-play Video.tsx), so this needs no client-side
 * state and stays a plain server component. `muted` is required for
 * autoplay under browser policy; `playsInline` (beyond the spec's literal
 * attribute list) is required for autoplay on iOS Safari with this exact
 * combination.
 */
export function VideoSection({
  videoUrl,
  posterUrl,
  videoTitle,
  videoSubtitle,
  videoButtonText,
  buttonLink,
}: VideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <section className="home-video relative flex h-[70vh] items-center justify-center overflow-hidden bg-charcoal-900">
      <video
        src={videoUrl}
        poster={posterUrl ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      {(videoTitle || videoSubtitle || videoButtonText) && (
        <div className="container-max relative z-10 flex flex-col items-center gap-4 text-center text-white">
          {videoTitle && <h2 className="font-display text-3xl font-bold md:text-4xl">{videoTitle}</h2>}
          {videoSubtitle && <p className="max-w-xl text-white/85">{videoSubtitle}</p>}
          {videoButtonText && buttonLink && (
            // Plain <a>, not the locale-aware Link -- same reasoning as
            // Hero's slide `link`: the CMS stores this as a full absolute
            // URL with a hardcoded locale segment baked in, not a
            // relative path.
            <a href={buttonLink} className="btn mt-2">
              {videoButtonText}
            </a>
          )}
        </div>
      )}
    </section>
  );
}
