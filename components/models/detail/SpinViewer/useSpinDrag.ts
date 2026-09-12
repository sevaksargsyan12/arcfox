"use client";

import { useCallback, useRef, useState } from "react";

const PX_PER_FRAME = 18;

function wrap(index: number, count: number): number {
  return ((index % count) + count) % count;
}

/**
 * Pointer-drag-to-frame-index logic for the 360deg spin viewer. No gesture
 * library -- plain pointer events, matching the reference's hand-rolled
 * touch handling but implemented natively for React/DOM pointer events.
 */
export function useSpinDrag(frameCount: number) {
  const [frameIndex, setFrameIndex] = useState(0);
  const dragState = useRef<{ startX: number; startFrame: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragState.current = { startX: e.clientX, startFrame: frameIndex };
    },
    [frameIndex]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current) return;
      const delta = e.clientX - dragState.current.startX;
      const step = Math.round(delta / PX_PER_FRAME);
      setFrameIndex(wrap(dragState.current.startFrame - step, frameCount));
    },
    [frameCount]
  );

  const onPointerUp = useCallback(() => {
    dragState.current = null;
  }, []);

  return {
    frameIndex,
    setFrameIndex,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
