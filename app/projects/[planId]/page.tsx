"use client";

import { useState, Fragment } from "react";
import DayNav from "@/components/common/DayNav";
import GoogleMap from "@/components/common/GoogleMap";
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

const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

const formatDayDate = (startDate: string, dayIndex: number) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + dayIndex);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dow = DAYS_KO[date.getDay()];
  return `${date.getFullYear()}.${mm}.${dd} (${dow})`;
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
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [budgetCardMode, setBudgetCardMode] = useState<"view" | "edit">("view");
  const {
    plan,
    planTitle,
    totalDays,
    items,
    dayQueries,
    openByDay,
    setOpenByDay,
  } = usePlanBlockData({ planId });
  const startDate = plan?.start_date ?? "";
  const { data: budgetData } = useBudget(planId);
  const showHint = false;
  const hasBudgetData = !!budgetData;
  const isEmpty = budgetData?.type === "INITIAL";

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 - sticky */}
      <div className="sticky top-0 z-20">
        {activeMode === "budget" ? (
          <ProjectHeader
            variant="view"
            showCalendarButton
            isCalendarVisible={isCalendarVisible}
            onCalendar={() => setIsCalendarVisible((prev) => !prev)}
            showMenuButton
            className="backdrop-blur-md"
          />
        ) : (
          <ProjectHeader
            showMapButton
            isMapVisible={isMapVisible}
            onMap={() => setIsMapVisible((prev) => !prev)}
            showCalendarButton
            isCalendarVisible={isCalendarVisible}
            onCalendar={() => setIsCalendarVisible((prev) => !prev)}
            showMenuButton
            className="backdrop-blur-md"
          />
        )}
      </div>

      {/* 지도 - sticky */}
      {activeMode === "planMode" && isMapVisible && (
        <div className="sticky top-16 z-10">
          <GoogleMap
            showZoomControls
            center={{ lat: 37.566535, lng: 126.977969 }}
            zoom={15}
            markerPosition={{ lat: 37.566535, lng: 126.977969 }}
            className="w-full h-45 rounded-none"
          />
        </div>
      )}

      {/* PlanHeader - 스크롤 */}
      <div className="px-5 py-4">
        <PlanHeader title={planTitle} day={totalDays} href={editHref} />
      </div>

      {/* DayNav - sticky (지도 아래) */}
      {isCalendarVisible && (
        <div
          className="sticky z-10 bg-background overflow-hidden"
          style={{
            top: `${64 + (activeMode === "planMode" && isMapVisible ? 180 : 0)}px`,
          }}
        >
          <DayNav
            items={items}
            className="gap-2.25 py-3 h-14"
            itemClassName="h-8 py-1.5"
            onValueChange={(value) => {
              const day = Number(value);
              const idx = day - 1;
              const q = dayQueries[idx];
              const isDayEmpty = !!q?.data && (q.data.contents?.length ?? 0) === 0;

              // 접혀 있고 비어있지 않으면 펼침
              if (!isDayEmpty) {
                setOpenByDay((prev) => ({ ...prev, [day]: true }));
              }

              const el = document.getElementById(`day-section-${value}`);
              if (!el) return;
              const mapHeight =
                activeMode === "planMode" && isMapVisible ? 180 : 0;
              const offset = 64 + mapHeight + 56; // header + map + DayNav(h-14)
              const top =
                el.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: "smooth" });
            }}
          />
          <div className="pointer-events-none absolute top-0 -right-1.25 w-14 h-14 bg-[linear-gradient(90deg,rgba(252,252,252,0)_0%,rgba(252,252,252,1)_100%)]" />
        </div>
      )}

      <main className="flex flex-col pb-18">
        {/* 예산 탭: 빈 상태 */}
        {activeMode === "budget" && isEmpty && <BudgetEmptyState />}

        {/* 예산 탭: BudgetSummaryCard */}
        {activeMode === "budget" && hasBudgetData && !isEmpty && (
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

        {(!isEmpty || activeMode !== "budget") && items.map((item, idx) => {
          const day = Number(item.value);
          const q = dayQueries[idx];
          const isDayEmpty = !!q?.data && (q.data.contents?.length ?? 0) === 0;
          const isOpen = openByDay[day] ?? !isDayEmpty;

          return (
            <div key={item.value} id={`day-section-${item.value}`}>
              <DayHeader
                day={day}
                date={formatDayDate(startDate, day - 1)}
                open={isOpen}
                onOpenChange={(next) =>
                  setOpenByDay((prev) => ({ ...prev, [day]: next }))
                }
                disabled={q?.data ? isDayEmpty : false}
              >
                {activeMode === "budget" && (
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
