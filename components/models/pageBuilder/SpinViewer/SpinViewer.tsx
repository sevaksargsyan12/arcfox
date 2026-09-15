"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { useSpinDrag } from "./useSpinDrag";

interface SpinViewerProps {
  frames: string[];
  alt: string;
  hint: string;
}

/**
 * The one genuinely novel interactive piece in Phase 1: a real drag-to-spin
 * 360deg viewer. Ships with 8 placeholder frames per color (the reference
 * uses ~36-72 real photographed frames) -- frame count is just the length
 * of the `frames` array, so a richer sequence later is a data change, not
 * a code change.
 */
export function SpinViewer({ frames, alt, hint }: SpinViewerProps) {
  const { frameIndex, setFrameIndex, handlers } = useSpinDrag(frames.length);

  // Preload every frame on mount / color change so dragging feels
  // responsive even with a small frame count.
  useEffect(() => {
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    setFrameIndex(0);
  }, [frames, setFrameIndex]);

  return (
    <div className="relative">
      <div
        className="flex aspect-[2.5/1] w-full cursor-grab touch-none items-center justify-center select-none active:cursor-grabbing"
        {...handlers}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={frames[frameIndex]} alt={alt} className="h-full w-full object-contain" draggable={false} />
      </div>
      <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
        <RotateCw size={12} />
        {hint}
      </div>
    </div>
  );
}
