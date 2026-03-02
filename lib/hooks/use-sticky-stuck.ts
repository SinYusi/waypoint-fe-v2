"use client";

import { useLayoutEffect, useState } from "react";

type UseStickyStuckOptions = {
  top: number;
  enabled?: boolean;
  threshold?: number | number[];
};

export const useStickyStuck = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { top, enabled = true, threshold = 0 }: UseStickyStuckOptions,
) => {
  const [internalStuck, setInternalStuck] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;

    let rafId = 0;

    if (!enabled || !el) {
      rafId = requestAnimationFrame(() => {
        setInternalStuck(false);
      });
      return () => cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      setInternalStuck(rect.top < top);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInternalStuck(!entry.isIntersecting);
      },
      {
        root: null,
        threshold,
        rootMargin: `-${top}px 0px 0px 0px`,
      },
    );

    observer.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [top, enabled, threshold, ref]);

  return enabled ? internalStuck : false;
};
