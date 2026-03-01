"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlan } from "./project/plan/use-plan";
import { usePlanBlockList } from "./use-plan-block-list";

type DayNavItem = {
  value: string;
  label: string;
};

interface UsePlanBlockDataProps {
  planId: string;
  /** usePlan/usePlanBlockList 활성 여부 */
  enabled?: boolean;
  /** DayNav label 커스터마이즈 */
  dayLabelFormatter?: (day: number) => string;
  /** 초기 선택 day (기본 "1") */
  initialActiveDay?: string;
  /**
   * 열림 상태 자동 동기화 사용 여부
   * - 초기: non-empty면 open, empty면 close
   * - empty <-> non-empty 변화 시 자동 open/close
   */
  syncOpenState?: boolean;
}

export const usePlanBlockData = ({
  planId,
  enabled = true,
  dayLabelFormatter = (day) => `Day ${day}`,
  initialActiveDay = "1",
  syncOpenState = true,
}: UsePlanBlockDataProps) => {
  // 0-1) DayNav 선택 상태
  const [activeDay, setActiveDay] = useState<string>(initialActiveDay);

  // 0-2) DayHeader 열림 상태(각 day)
  const [openByDay, setOpenByDay] = useState<Record<number, boolean>>({});
  const prevEmptyByDay = useRef<Record<number, boolean>>({});

  // 1) Plan
  const planQuery = usePlan(planId);
  const plan = planQuery.data;

  const planTitle = plan?.title ?? "";
  const totalDays = plan?.duration_days ?? 0;

  // 2) Days array
  const days = useMemo(() => {
    if (!totalDays || totalDays < 1) return [];
    return Array.from({ length: totalDays }, (_, i) => i + 1);
  }, [totalDays]);

  // 3) Day block list queries (day별)
  const dayQueries = usePlanBlockList({
    planId,
    days,
    enabled: enabled && days.length > 0,
  });

  // 4) DayNav items
  const items: DayNavItem[] = useMemo(() => {
    return days.map((day) => ({
      value: String(day),
      label: dayLabelFormatter(day),
    }));
  }, [days, dayLabelFormatter]);

  // 4-1) safeActiveDay (items에 없는 값이면 첫 번째 day로 보정)
  const safeActiveDay = useMemo(() => {
    if (items.length === 0) return initialActiveDay;
    const exists = items.some((i) => i.value === activeDay);
    return exists ? activeDay : items[0].value;
  }, [items, activeDay, initialActiveDay]);

  // 5) 모두 “완료(settled)” 됐는지: data가 있거나 에러면 완료
  const isAllDaysSettled = useMemo(() => {
    if (!enabled) return false;
    if (days.length === 0) return false;
    if (dayQueries.length !== days.length) return false;

    return dayQueries.every((q) => !!q?.data || !!q?.isError);
  }, [enabled, days.length, dayQueries]);

  // 6) 모두 비었는지: settled 이후에만 판단
  const isAllDaysEmpty = useMemo(() => {
    if (!isAllDaysSettled) return false;
    return dayQueries.every((q) => (q?.data?.contents?.length ?? 0) === 0);
  }, [isAllDaysSettled, dayQueries]);

  // 7) 로딩 상태
  // - plan 로딩 중이거나
  // - days가 있는데 dayQueries가 전부 settled 안 됐으면
  const isInitialLoading = useMemo(() => {
    if (!enabled) return false;
    if (planQuery.isLoading) return true;
    if (days.length > 0 && !isAllDaysSettled) return true;
    return false;
  }, [enabled, planQuery.isLoading, days.length, isAllDaysSettled]);

  // 8) openByDay 자동 동기화
  useEffect(() => {
    if (!syncOpenState) return;
    if (!enabled) return;
    if (days.length === 0) return;

    days.forEach((day, idx) => {
      const q = dayQueries[idx];
      if (!q?.data) return;

      const isEmpty = (q.data.contents?.length ?? 0) === 0;
      const wasEmpty = prevEmptyByDay.current[day];

      setOpenByDay((prev) => {
        const current = prev[day];

        // 초기 세팅: 내용 있으면 open, 없으면 close
        if (current === undefined) return { ...prev, [day]: !isEmpty };

        // empty -> non-empty : open
        if (wasEmpty === true && isEmpty === false) {
          return current ? prev : { ...prev, [day]: true };
        }

        // non-empty -> empty : close
        if (wasEmpty === false && isEmpty === true) {
          return !current ? prev : { ...prev, [day]: false };
        }

        return prev;
      });

      prevEmptyByDay.current[day] = isEmpty;
    });
  }, [syncOpenState, enabled, days, dayQueries]);

  return {
    // plan
    plan,
    planTitle,
    totalDays,

    // days & dayNav
    days,
    items,

    // active dayNav
    activeDay,
    setActiveDay,
    safeActiveDay,

    // queries
    planQuery,
    dayQueries,

    // open state
    openByDay,
    setOpenByDay,

    // derived
    isAllDaysSettled,
    isAllDaysEmpty,
    isInitialLoading,
  };
};
