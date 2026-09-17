"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in milliseconds, for revealing a list one item at a time. */
  delayMs?: number;
  /** Rendered element -- "li" when used as a direct child of a <ul>/<ol>. */
  as?: "div" | "li";
}

/**
 * Fade-up-on-scroll wrapper, hand-rolled with IntersectionObserver rather
 * than pulling in a library (same call as Phase 1's `useSpinDrag` -- small
 * enough to own directly). Fires once per element, then stays revealed.
 */
export function Reveal({ children, className, delayMs = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // Lazy initializer (not a setState-in-effect) so a reduced-motion
  // preference shows content immediately without ever entering the hidden
  // state -- no fade/translate to skip, nothing to synchronize.
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // `visible` is only read as a mount-time guard (skip entirely when
    // reduced-motion already revealed it) -- re-running this effect when it
    // flips true would just re-check the guard and no-op, never resubscribe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revealClassName = `transition-all duration-700 ease-out ${
    visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  } ${className ?? ""}`;
  const style = { transitionDelay: visible ? `${delayMs}ms` : "0ms" };

  if (as === "li") {
    return (
      <li ref={ref as React.Ref<HTMLLIElement>} className={revealClassName} style={style}>
        {children}
      </li>
    );
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={revealClassName} style={style}>
      {children}
    </div>
  );
}
