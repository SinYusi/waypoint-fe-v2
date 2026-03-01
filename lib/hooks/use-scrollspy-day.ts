"use client";

import { useEffect, useRef, useState } from "react";

type UseScrollspyDayOptions = {
  /** 감지할 day 값 목록 (ex: [1, 2, 3]) */
  days: number[];
  /** sticky 요소들의 총 높이 (header + map + dayNav) */
  topOffset: number;
  /** false면 observer 비활성화 */
  enabled?: boolean;
  /** activeDay가 변경될 때 호출되는 콜백 (외부 상태와 동기화) */
  onActivate?: (day: string) => void;
};

/**
 * 스크롤 위치에 따라 현재 보이는 day를 반환하는 훅.
 * `suppressRef.current = true`로 설정하면 일시적으로 감지를 억제한다.
 * (dayNav 클릭 등 프로그래매틱 스크롤 중 오작동 방지용)
 */
export const useScrollspyDay = ({
  days,
  topOffset,
  enabled = true,
  onActivate,
}: UseScrollspyDayOptions) => {
  const [activeDay, setActiveDay] = useState<string | undefined>(undefined);
  /** true인 동안 observer 콜백에서 상태를 업데이트하지 않음 */
  const suppressRef = useRef(false);
  const onActivateRef = useRef(onActivate);
  useEffect(() => {
    onActivateRef.current = onActivate;
  });

  useEffect(() => {
    if (!enabled || days.length === 0) return;

    // 뷰포트 상단 topOffset 아래 ~ 뷰포트 하단 50% 위 사이의 얇은 띠에서 교차 감지
    const bottomMargin = -(
      (typeof window !== "undefined" ? window.innerHeight : 800) -
      topOffset -
      1
    );
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressRef.current) return;

        // 가장 위에 있는 교차 섹션을 활성화
        let topmost: { day: string; top: number } | null = null;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const day = (entry.target as HTMLElement).dataset.spyDay;
          if (!day) return;
          const top = entry.boundingClientRect.top;
          if (!topmost || top < topmost.top) {
            topmost = { day, top };
          }
        });

        if (topmost) {
          const day = (topmost as { day: string; top: number }).day;
          setActiveDay(day);
          onActivateRef.current?.(day);
        }
      },
      {
        rootMargin: `-${topOffset}px 0px ${bottomMargin}px 0px`,
        threshold: 0,
      },
    );

    days.forEach((day) => {
      const el = document.getElementById(`day-section-${day}`);
      if (el) {
        el.dataset.spyDay = String(day);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [days, topOffset, enabled]);

  return { activeDay, setActiveDay, suppressRef };
};
