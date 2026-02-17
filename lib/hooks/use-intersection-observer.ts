"use client";

import { useEffect, useRef } from "react";

type UseIntersectionObserverParams = {
  onIntersect: () => void;
  enabled?: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export const useIntersectionObserver = ({
  onIntersect,
  enabled = true,
  root = null,
  rootMargin = "200px",
  threshold = 0,
}: UseIntersectionObserverParams) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        onIntersect();
      },
      { root, rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onIntersect, root, rootMargin, threshold]);

  return ref;
};
