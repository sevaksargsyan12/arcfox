import { Reveal } from "@/components/ui/Reveal";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface AboutFooterBlockProps {
  imageUrl: string | null;
  imageMobileUrl: string | null;
  title: string | null;
  contentHtml: string | null;
}

export function AboutFooterBlock({ imageUrl, imageMobileUrl, title, contentHtml }: AboutFooterBlockProps) {
  const image = imageUrl ?? imageMobileUrl;
  if (!image && !title && !contentHtml) return null;

  return (
    // Image rendered in normal flow at `w-full` with no height constraint --
    // like AboutHero, the full image is always visible at its own aspect
    // ratio rather than being cropped to a fixed section height (same
    // sizing convention as the Exterior section's image).
    <section className="about-footer relative overflow-hidden">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl ?? image} alt="" className="hidden w-full object-cover md:block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageMobileUrl ?? image} alt="" className="w-full object-cover md:hidden" />
          <div className="absolute inset-0 bg-black/45" />
        </>
      )}
      <div
        className={
          image
            ? "absolute inset-0 z-10 mx-auto flex max-w-2xl flex-col items-center justify-center px-4 text-center text-white"
            : "mx-auto max-w-2xl px-4 py-16 text-center md:py-24"
        }
      >
        {title && (
          <Reveal>
            <h2 className="font-display text-3xl font-bold md:text-5xl">{title}</h2>
          </Reveal>
        )}
        {contentHtml && (
          <Reveal delayMs={150}>
            <div
              className={`g-html mt-4 ${image ? "text-white/90" : "text-charcoal-600"}`}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentHtml) }}
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}
