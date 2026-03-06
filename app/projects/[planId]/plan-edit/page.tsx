"use client";

import { useRef, useState, Fragment } from "react";
import { useQueries } from "@tanstack/react-query";
import DayNav from "@/components/common/DayNav";
// import GoogleMap from "@/components/common/GoogleMap";
import { DayHeader } from "@/components/layout/DayHeader";
import NavigationBar from "@/components/layout/NavigationBar";
import PlanHeader from "@/components/layout/PlanHeader";
import ProjectHeader from "@/components/layout/ProjectHeader";
import { useParams, useRouter } from "next/navigation";
import useQueryTab from "@/lib/hooks/use-query-tab";
import { formatDayInfoText } from "@/lib/utils/date";
import DayTimeBlocks from "@/components/common/projects/DayTimeBlocks";
import { usePlanBlockData } from "@/lib/hooks/use-plan-block-data";
import { cn } from "@/lib/utils/utils";
import { useStickyStuck } from "@/lib/hooks/use-sticky-stuck";
import { useScrollspyDay } from "@/lib/hooks/use-scrollspy-day";
import { useExpenses } from "@/lib/hooks/plan/use-expenses";
import ExpenseGroupItem from "@/components/card/ExpenseGroupItem";
import { Plus } from "lucide-react";
import BudgetBottomSheet, {
  type EditExpenseItem,
  type BudgetBottomSheetMode,
} from "@/components/common/BudgetBottomSheet";
import { useUpdateExpense } from "@/lib/hooks/plan/use-update-expense";
import { useDeleteExpense } from "@/lib/hooks/plan/use-delete-expense";
import { useAddExpense } from "@/lib/hooks/plan/use-add-expense";
import { useBudget } from "@/lib/hooks/plan/use-budget";
import { useUpdateBudget } from "@/lib/hooks/plan/use-update-budget";
import BudgetSummaryCard from "@/components/card/BudgetSummaryCard";
import BudgetEditDialog from "@/components/common/BudgetEditDialog";

// day별 지출 항목 — 훅을 루프 밖에서 호출하기 위해 별도 컴포넌트로 분리
const DayExpenses = ({ planId, day }: { planId: string; day: number }) => {
  const { data } = useExpenses(planId, day);
  const expenses = data ?? [];
  const [bottomSheet, setBottomSheet] = useState<{
    placeName?: string;
    expenseId?: string;
    items: EditExpenseItem[];
    mode: BudgetBottomSheetMode;
  } | null>(null);
  const { mutate: updateExpense } = useUpdateExpense(planId);
  const { mutate: deleteExpense } = useDeleteExpense(planId);
  const { mutate: addExpense } = useAddExpense(planId);
  const [createSheet, setCreateSheet] = useState<{
    prevExpenseId?: string;
  } | null>(null);

  if (expenses.length === 0) return null;

  return (
    <>
      <div className="flex flex-col px-5 py-3">
        {expenses.map((group, idx) => (
          <Fragment key={idx}>
            <ExpenseGroupItem
              group={group}
              onCardClick={(data) =>
                setBottomSheet({
                  ...data,
                  mode:
                    data.items.length === 0 ? "add-expense" : "edit-expense",
                })
              }
            />
            {idx < expenses.length - 1 ? (
              <div className="flex flex-col items-center">
                <div className="w-px h-2.5 bg-border" />
                <button
                  className="w-7 h-7 rounded-4xl bg-secondary flex items-center justify-center"
                  onClick={() =>
                    setCreateSheet({
                      prevExpenseId: expenses[idx].selected?.expense_id,
                    })
                  }
                >
                  <Plus className="w-3 h-3 text-slate-50" strokeWidth={2} />
                </button>
                <div className="w-px h-2.5 bg-border" />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-px h-2.5 bg-border" />
                <button
                  className="w-7 h-7 rounded-4xl bg-secondary flex items-center justify-center"
                  onClick={() =>
                    setCreateSheet({
                      prevExpenseId: expenses[idx].selected?.expense_id,
                    })
                  }
                >
                  <Plus className="w-3 h-3 text-slate-50" strokeWidth={2} />
                </button>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <BudgetBottomSheet
        open={!!bottomSheet}
        onOpenChange={(open) => {
          if (!open) setBottomSheet(null);
        }}
        mode={bottomSheet?.mode ?? "edit-expense"}
        placeName={bottomSheet?.placeName}
        editItems={bottomSheet?.items ?? []}
        onSave={(savedItems) => {
          if (!bottomSheet?.expenseId) return;
          updateExpense({
            expenseId: bottomSheet.expenseId,
            items: savedItems.map((i) => ({
              expense_item_id: i.expense_item_id ?? null,
              name: i.name,
              cost: String(i.cost),
            })),
          });
        }}
        onDelete={() => {
          if (!bottomSheet?.expenseId) return;
          deleteExpense({ expenseId: bottomSheet.expenseId });
        }}
      />

      <BudgetBottomSheet
        open={!!createSheet}
        onOpenChange={(open) => {
          if (!open) setCreateSheet(null);
        }}
        mode="create-expense"
        onSave={(savedItems) => {
          addExpense({
            prev_expense_id: createSheet?.prevExpenseId ?? null,
            items: savedItems.map((i) => ({
              name: i.name,
              cost: String(i.cost),
            })),
          });
        }}
      />
    </>
  );
};

const PlanEditPage = () => {
  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const planId = params.planId;

  const { tab: mode, setTab: setMode } = useQueryTab({
    defaultValue: "planMode",
    allowedValues: ["planMode", "budget"] as const,
    removeWhenDefault: true,
  });
  const activeMode = mode;

  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  // const [isMapVisible, setIsMapVisible] = useState(true);

  const dayNavSentinelRef = useRef<HTMLDivElement | null>(null);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);

  const {
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
    // isAllDaysEmpty,
    isInitialLoading,
  } = usePlanBlockData({
    planId,
  });

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

  const { data: budgetData } = useBudget(planId);
  const hasBudgetData = !!budgetData;
  const isBudgetEmpty = budgetData?.type === "INITIAL";
  const { mutate: updateBudget } = useUpdateBudget(planId);

  // 전체 day 지출 병렬 조회: PENDING 그룹 중 예산이 입력된 후보지가 있으면 힌트 표시
  const expensesByDay = useQueries({
    queries: days.map((day) => ({
      queryKey: ["expenses", { planId, day }] as const,
      queryFn: () =>
        import("@/lib/api/budget").then((m) => m.getExpenses(planId, day)),
      enabled: !!planId && days.length > 0,
    })),
  });
  const hasPendingBlocks = expensesByDay.some((q) =>
    q.data?.some(
      (group) =>
        group.type === "BLOCK" &&
        group.block_status === "PENDING" &&
        group.candidates?.some((c) => c.items.length > 0),
    ),
  );

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
            variant="edit"
            title="편집모드"
            showCalendarButton
            isCalendarVisible={isCalendarVisible}
            onCalendar={() => setIsCalendarVisible((prev) => !prev)}
            className="backdrop-blur-md bg-background/60"
          />
        ) : (
          <ProjectHeader
            variant="edit"
            title="편집모드"
            // showMapButton
            // isMapVisible={isMapVisible}
            // onMap={() => setIsMapVisible((prev) => !prev)}
            // mapDisabled={isAllDaysSettled && isAllDaysEmpty}
            showCalendarButton
            isCalendarVisible={isCalendarVisible}
            onCalendar={() => setIsCalendarVisible((prev) => !prev)}
            className="backdrop-blur-md bg-background/60"
          />
        )}
      </div>

      {/* 지도 - sticky */}
      {/* {shouldShowMap && (
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
        <PlanHeader
          title={planTitle}
          day={totalDays || 0}
          href={`/projects/${planId}/edit?returnTo=${encodeURIComponent(
            `/projects/${planId}/plan-edit`,
          )}`}
          isEditing
          isEditBudget={activeMode === "budget" ? true : false}
        />
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

      <main className="flex flex-col pb-32">
        {/* 예산 탭: 빈 상태 (편집 모드) */}
        {activeMode === "budget" && isBudgetEmpty && (
          <BudgetSummaryCard
            mode="edit"
            className="pt-3"
            onEditClick={() => setBudgetDialogOpen(true)}
          />
        )}

        {/* 예산 탭: BudgetSummaryCard */}
        {activeMode === "budget" && hasBudgetData && !isBudgetEmpty && (
          <BudgetSummaryCard
            variant={budgetData.type === "BUDGET" ? "budget" : "expense"}
            mode="edit"
            totalBudget={budgetData.total_budget ?? 0}
            usedAmount={budgetData.total_cost}
            perDayAmount={
              totalDays > 0 ? Math.round(budgetData.total_cost / totalDays) : 0
            }
            perPersonAmount={budgetData.cost_per_person}
            showHint={hasPendingBlocks}
            className="pt-3"
            onEditClick={() => setBudgetDialogOpen(true)}
          />
        )}

        {/* 예산 편집 다이얼로그 */}
        <BudgetEditDialog
          open={budgetDialogOpen}
          onOpenChange={setBudgetDialogOpen}
          defaultMode={budgetData?.type === "EXPENSE" ? "expense" : "budget"}
          initialBudget={budgetData?.total_budget ?? undefined}
          initialPersonCount={budgetData?.traveler_count}
          onSave={({ mode, totalBudget, personCount }) => {
            updateBudget({
              type: mode === "budget" ? "BUDGET" : "EXPENSE",
              total_budget: totalBudget,
              traveler_count: personCount,
            });
          }}
        />
        {days.map((day, idx) => {
          const q = dayQueries[idx];
          const isEmpty = !!q?.data && (q.data.contents?.length ?? 0) === 0;
          const isOpen = openByDay[day] ?? !isEmpty;
          const dateText = q?.data
            ? formatDayInfoText(q.data.date, q.data.dayOfWeek)
            : "";

          return (
            <div key={day} id={`day-section-${day}`}>
              <div id={`day-sentinel-${day}`} data-day={day} className="h-px" />
              <DayHeader
                day={day}
                date={dateText}
                open={isOpen}
                onOpenChange={(next) =>
                  setOpenByDay((prev) => ({ ...prev, [day]: next }))
                }
                disabled={q?.data ? isEmpty : false}
              >
                {activeMode === "planMode" ? (
                  // Plan
                  <DayTimeBlocks
                    planId={planId}
                    day={day}
                    data={q?.data}
                    isEdit
                  />
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
          variant={activeMode === "budget" ? "variant3" : "variant2"}
          activeMode={activeMode}
          onPlanModeClick={() => setMode("planMode")}
          onBudgetClick={() => setMode("budget")}
          onAddPlaceClick={() => router.push(`/projects/${planId}/add-place`)}
        />
      </div>
    </div>
  );
};

export default PlanEditPage;
