"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { SectionOf } from "./types";

type VideoSection = SectionOf<"video">;

/**
 * Full width on desktop; an inset rounded card on mobile -- confirmed from
 * the two video screenshots (the text spec only says "full width", the
 * mobile screenshot shows an inset card instead). Does not autoplay; if
 * there's no posterUrl, the video's own first frame shows through (no
 * poster attribute set).
 */
export function Video({ videoUrl, posterUrl }: VideoSection) {
  const t = useTranslations("models.pageBuilder");
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-video md:px-0">
      <div className="mx-4 overflow-hidden rounded-2xl md:mx-0 md:rounded-none">
        <div className="relative aspect-video w-full bg-charcoal-900">
          {playing ? (
            <video src={videoUrl} controls autoPlay className="h-full w-full" />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={t("playVideo")}
              className="group relative block h-full w-full"
            >
              {posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={posterUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <video src={videoUrl} className="h-full w-full object-cover" muted preload="metadata" />
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110">
                  <Play className="ml-1 text-ink" size={24} fill="currentColor" />
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
