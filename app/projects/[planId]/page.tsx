"use client";

import { useState, Fragment, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import DayNav from "@/components/common/DayNav";
// import GoogleMap from "@/components/common/GoogleMap";
import BudgetSummaryCard from "@/components/card/BudgetSummaryCard";
import ExpenseGroupItem from "@/components/card/ExpenseGroupItem";
import { DayHeader } from "@/components/layout/DayHeader";
import NavigationBar from "@/components/layout/NavigationBar";
import PlanHeader from "@/components/layout/PlanHeader";
import ProjectHeader from "@/components/layout/ProjectHeader";
import { useParams, useSearchParams } from "next/navigation";
import useQueryTab from "@/lib/hooks/use-query-tab";
import { useBudget } from "@/lib/hooks/plan/use-budget";
import { useExpenses } from "@/lib/hooks/plan/use-expenses";
import BudgetEmptyState from "@/components/common/BudgetEmptyState";
import { usePlanBlockData } from "@/lib/hooks/use-plan-block-data";
import { useScrollspyDay } from "@/lib/hooks/use-scrollspy-day";
import { formatDayInfoText } from "@/lib/utils/date";
import { useStickyStuck } from "@/lib/hooks/use-sticky-stuck";
import { cn } from "@/lib/utils/utils";
import DayTimeBlocks from "@/components/common/projects/DayTimeBlocks";
import PlanEmptyState from "@/components/common/projects/PlanEmptyState";

// day별 지출 항목 — 훅을 루프 밖에서 호출하기 위해 별도 컴포넌트로 분리
const DayExpenses = ({ planId, day }: { planId: string; day: number }) => {
  const { data } = useExpenses(planId, day);
  const expenses = data ?? [];

  if (expenses.length === 0) return null;

  return (
    <div className="flex flex-col px-5 py-3">
      {expenses.map((group, idx) => (
        <Fragment key={idx}>
          <ExpenseGroupItem group={group} />
          {idx < expenses.length - 1 && (
            <div className="flex justify-center">
              <div className="w-px h-5 bg-border" />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

const PlanPage = () => {
  const params = useParams<{ planId: string }>();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const planId = params.planId;

  const { tab: mode, setTab: setMode } = useQueryTab({
    defaultValue: "planMode",
    allowedValues: ["planMode", "budget"] as const,
    removeWhenDefault: true,
  });

  const activeMode = mode;

  const editHref = query
    ? `/projects/${planId}/plan-edit?${query}`
    : `/projects/${planId}/plan-edit`;

  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  // const [isMapVisible, setIsMapVisible] = useState(true);

  const dayNavSentinelRef = useRef<HTMLDivElement | null>(null);

  const [budgetCardMode, setBudgetCardMode] = useState<"view" | "edit">("view");
  const {
    plan,
    planTitle,
    totalDays,
    days,
    items,
    setActiveDay,
    safeActiveDay,
    dayQueries,
    openByDay,
    setOpenByDay,
    isAllDaysSettled,
    isAllDaysEmpty,
    isInitialLoading,
  } = usePlanBlockData({ planId });
  const startDate = plan?.start_date ?? "";
  const dateRange =
    plan?.start_date && plan?.end_date
      ? `${plan.start_date} ~ ${plan.end_date}`
      : undefined;
  const { data: budgetData } = useBudget(planId);
  const expensesByDay = useQueries({
    queries: days.map((day) => ({
      queryKey: ["expenses", { planId, day }] as const,
      queryFn: () =>
        import("@/lib/api/budget").then((m) => m.getExpenses(planId, day)),
      enabled: !!planId && days.length > 0,
    })),
  });
  const showHint = expensesByDay.some((q) =>
    q.data?.some(
      (group) =>
        group.type === "BLOCK" &&
        group.block_status === "PENDING" &&
        group.candidates?.some((c) => c.items.length > 0),
    ),
  );
  const hasBudgetData = !!budgetData;
  const isEmpty = budgetData?.type === "INITIAL";

  // 지도 실제 표시 여부 (settled 전에는 무조건 false)
  // const shouldShowMap =
  //   isAllDaysSettled &&
  //   activeMode === "planMode" &&
  //   isMapVisible &&
  //   !isAllDaysEmpty;

  // const dayNavTop = 64 + (shouldShowMap ? 180 : 0);
  const dayNavTop = 64;

  const isDayNavStuck = useStickyStuck(dayNavSentinelRef, {
    top: dayNavTop,
    enabled: isCalendarVisible,
  });

  const { suppressRef } = useScrollspyDay({
    days,
    topOffset: dayNavTop + 56,
    enabled: isAllDaysSettled && items.length > 0,
    onActivate: (day) => setActiveDay(day),
  });

  // 초기 데이터 로딩 상태
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="typography-body-body-reg text-muted-foreground">
          일정을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 - sticky */}
      <div className="sticky top-0 z-20">
        {activeMode === "budget" ? (
          <ProjectHeader
            variant="view"
            drawerTitle={planTitle}
            dateRange={dateRange}
            showCalendarButton
            isCalendarVisible={isCalendarVisible}
            onCalendar={() => setIsCalendarVisible((prev) => !prev)}
            showMenuButton
            className="backdrop-blur-md bg-background/60"
          />
        ) : (
          <ProjectHeader
            drawerTitle={planTitle}
            dateRange={dateRange}
            showCalendarButton
            isCalendarVisible={isCalendarVisible}
            onCalendar={() => setIsCalendarVisible((prev) => !prev)}
            showMenuButton
            className="backdrop-blur-md bg-background/60"
          />
        )}
      </div>

      {/* 지도 - sticky */}
      {/* {activeMode === "planMode" && isMapVisible && (
        <div className="sticky top-16 z-10">
          <GoogleMap
            showZoomControls
            center={{ lat: 37.566535, lng: 126.977969 }}
            zoom={15}
            markerPosition={{ lat: 37.566535, lng: 126.977969 }}
            className="w-full h-45 rounded-none"
          />
        </div>
      )} */}

      {/* PlanHeader - 스크롤 */}
      <div className="px-5 py-4">
        <PlanHeader title={planTitle} day={totalDays || 0} href={editHref} />
      </div>

      {/* DayNav - sticky (지도 아래) */}
      {isCalendarVisible && (
        <>
          {/* sticky 상태 감지용 sentinel (DayNav 바로 위에 위치) */}
          <div ref={dayNavSentinelRef} className="h-px" />
          <div
            className={cn(
              "sticky z-10 overflow-hidden",
              isDayNavStuck
                ? "border-t border-border backdrop-blur-xl bg-background/60"
                : "bg-background",
            )}
            style={{
              top: `${dayNavTop}px`,
            }}
          >
            <div className="relative">
              <DayNav
                items={items}
                value={safeActiveDay}
                onValueChange={(value) => {
                  setActiveDay(value);

                  const day = Number(value);
                  const idx = day - 1;
                  const q = dayQueries[idx];
                  const isDayEmpty =
                    !!q?.data && (q.data.contents?.length ?? 0) === 0;

                  // 접혀 있고 비어있지 않으면 펼침
                  if (!isDayEmpty) {
                    setOpenByDay((prev) => ({ ...prev, [day]: true }));
                  }

                  // 스크롤 중 scrollspy 억제
                  suppressRef.current = true;

                  const scrollToDay = () => {
                    const el = document.getElementById(`day-section-${value}`);
                    if (!el) return;
                    // const mapHeight = shouldShowMap ? 180 : 0;
                    const mapHeight = 0;
                    const offset = 64 + mapHeight + 56; // header + map + DayNav(h-14)
                    const top =
                      el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: "smooth" });
                    // smooth scroll 종료 후 억제 해제 (약 600ms)
                    setTimeout(() => {
                      suppressRef.current = false;
                    }, 700);
                  };

                  // 펼침 애니메이션 후 DOM 확정 시점에 스크롤
                  requestAnimationFrame(() =>
                    requestAnimationFrame(scrollToDay),
                  );
                }}
                className="gap-2.25 py-3 h-14"
                itemClassName="h-8 py-1.5"
              />
              <div className="pointer-events-none absolute top-0 -right-1.25 w-14 h-14 bg-[linear-gradient(90deg,rgba(252,252,252,0)_0%,rgba(252,252,252,1)_100%)]" />
            </div>
          </div>
        </>
      )}

      <main className="flex flex-col flex-1 pb-32">
        {/* 예산 탭 */}
        {activeMode === "budget" && (
          <>
            {/* 예산 탭: 빈 상태 */}
            {isEmpty && <BudgetEmptyState />}

            {/* 예산 탭: BudgetSummaryCard */}
            {hasBudgetData && !isEmpty && (
              <BudgetSummaryCard
                variant={budgetData.type === "BUDGET" ? "budget" : "expense"}
                mode={budgetCardMode}
                totalBudget={budgetData.total_budget ?? 0}
                usedAmount={budgetData.total_cost}
                perDayAmount={Math.round(budgetData.total_cost / items.length)}
                perPersonAmount={budgetData.cost_per_person}
                showHint={showHint}
                onEditClick={() => setBudgetCardMode("edit")}
                className="pt-3"
              />
            )}
          </>
        )}

        {/* 여행 일정 탭: 빈 상태 */}
        {activeMode === "planMode" && isAllDaysEmpty && <PlanEmptyState />}

        {((activeMode === "budget" && !isEmpty) ||
          (activeMode == "planMode" && !isAllDaysEmpty)) &&
          days.map((day, idx) => {
            const q = dayQueries[idx];
            const isDayEmpty =
              !!q?.data && (q.data.contents?.length ?? 0) === 0;
            const isOpen = openByDay[day] ?? !isDayEmpty;
            const dateText = q?.data
              ? formatDayInfoText(q.data.date, q.data.dayOfWeek)
              : "";

            return (
              <div key={day} id={`day-section-${day}`}>
                <div
                  id={`day-sentinel-${day}`}
                  data-day={day}
                  className="h-px"
                />
                <DayHeader
                  day={day}
                  date={dateText}
                  open={isOpen}
                  onOpenChange={(next) =>
                    setOpenByDay((prev) => ({ ...prev, [day]: next }))
                  }
                  disabled={q?.data ? isDayEmpty : false}
                >
                  {activeMode === "planMode" ? (
                    // Plan
                    <DayTimeBlocks planId={planId} day={day} data={q?.data} />
                  ) : (
                    // Budget
                    <DayExpenses planId={planId} day={day} />
                  )}
                </DayHeader>
              </div>
            );
          })}
      </main>

      <div className="fixed bottom-0 left-0 w-full">
        <NavigationBar
          variant="variant3"
          activeMode={activeMode}
          onPlanModeClick={() => setMode("planMode")}
          onBudgetClick={() => setMode("budget")}
        />
      </div>
    </div>
  );
};

export default PlanPage;
