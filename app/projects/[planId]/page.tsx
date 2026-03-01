"use client";

import { useState, Fragment } from "react";
import { useParams } from "next/navigation";
import DayNav from "@/components/common/DayNav";
import GoogleMap from "@/components/common/GoogleMap";
import BudgetSummaryCard from "@/components/card/BudgetSummaryCard";
import ExpenseGroupItem from "@/components/card/ExpenseGroupItem";
import { DayHeader } from "@/components/layout/DayHeader";
import NavigationBar from "@/components/layout/NavigationBar";
import PlanHeader from "@/components/layout/PlanHeader";
import ProjectHeader from "@/components/layout/ProjectHeader";
import { useBudget } from "@/lib/hooks/plan/use-budget";
import { useExpenses } from "@/lib/hooks/plan/use-expenses";
import type { BudgetResponse, ExpenseGroupResponse } from "@/types/budget";

// TODO: 서버 연결 후 제거
const mockBudgetData: BudgetResponse = {
  budget_id: "1",
  type: "BUDGET",
  total_budget: 1500000,
  total_cost: 564000,
  remaining_budget: 936000,
  cost_per_person: 141000,
  traveler_count: 4,
};

// TODO: 서버 연결 후 제거
const mockExpensesByDay: Record<number, ExpenseGroupResponse[]> = {
  1: [
    // BLOCK + FIXED + 단일 후보 → BudgetPlaceCard
    {
      type: "BLOCK",
      time_block_id: "block-1",
      block_status: "FIXED",
      candidate_count: 1,
      candidates: null,
      selected: {
        expense_id: "exp-1",
        block: { block_id: "block-1", name: "성산일출봉" },
        items: [
          { expense_item_id: "item-1", name: "입장료", cost: 5000 },
          { expense_item_id: "item-1b", name: "주차비", cost: 3000 },
        ],
      },
    },
    // ADDITIONAL + 복수 항목 → BudgetCandidateGroup edit
    {
      type: "ADDITIONAL",
      time_block_id: null,
      block_status: null,
      candidate_count: null,
      candidates: null,
      selected: {
        expense_id: "exp-5",
        block: null,
        items: [
          { expense_item_id: "item-5", name: "렌터카", cost: 80000 },
        ],
      },
    },
    // BLOCK + FIXED + 복수 후보 → BudgetCandidateCard
    {
      type: "BLOCK",
      time_block_id: "block-2",
      block_status: "FIXED",
      candidate_count: 2,
      candidates: null,
      selected: {
        expense_id: "exp-2",
        block: { block_id: "block-2", name: "우도" },
        items: [{ expense_item_id: "item-2", name: "배 왕복", cost: 12000 }],
      },
    },
    {
      type: "BLOCK",
      time_block_id: "block-3",
      block_status: "PENDING",
      candidate_count: 2,
      candidates: [
        {
          expense_id: "exp-3",
          block: { block_id: "block-3", name: "협재 해수욕장" },
          items: [{ expense_item_id: "item-3", name: "주차비", cost: 3000 },
                { expense_item_id: "item-1b", name: "주차비", cost: 3000 },],
          
        },
        {
          expense_id: "exp-4",
          block: { block_id: "block-4", name: "곽지 해수욕장" },
          items: [{ expense_item_id: "item-4", name: "주차비", cost: 2000 }],
        },
        {
          expense_id: "exp-6",
          block: { block_id: "block-5", name: "해운대 해수욕장" },
          items: [{ expense_item_id: "item-6", name: "주차비", cost: 2000 }],
        },
      ],
      selected: null,
    },
    {
      type: "BLOCK",
      time_block_id: "block-3",
      block_status: "PENDING",
      candidate_count: 2,
      candidates: [
        {
          expense_id: "exp-3",
          block: { block_id: "block-3", name: "협재 해수욕장" },
          items: [{ expense_item_id: "item-3", name: "주차비", cost: 3000 },
                { expense_item_id: "item-1b", name: "주차비", cost: 3000 },],
          
        },
        {
          expense_id: "exp-4",
          block: { block_id: "block-4", name: "곽지 해수욕장" },
          items: [{ expense_item_id: "item-4", name: "주차비", cost: 2000 }],
        },
        {
          expense_id: "exp-6",
          block: { block_id: "block-5", name: "해운대 해수욕장" },
          items: [{ expense_item_id: "item-6", name: "주차비", cost: 2000 }],
        },
        {
          expense_id: "exp-7",
          block: { block_id: "block-6", name: "송도 해수욕장" },
          items: [{ expense_item_id: "item-7", name: "주차비", cost: 2000 }],
        },
      ],
      selected: null,
    },
  ],
  2: [
    // BLOCK + FIXED + 복수 후보 → BudgetCandidateCard
    {
      type: "BLOCK",
      time_block_id: "block-2",
      block_status: "FIXED",
      candidate_count: 2,
      candidates: null,
      selected: {
        expense_id: "exp-2",
        block: { block_id: "block-2", name: "우도" },
        items: [{ expense_item_id: "item-2", name: "배 왕복", cost: 12000 }],
      },
    },
  ],
  3: [
    // BLOCK + PENDING → BudgetCandidateGroup view
    {
      type: "BLOCK",
      time_block_id: "block-3",
      block_status: "PENDING",
      candidate_count: 2,
      candidates: [
        {
          expense_id: "exp-3",
          block: { block_id: "block-3", name: "협재 해수욕장" },
          items: [{ expense_item_id: "item-3", name: "주차비", cost: 3000 },
                { expense_item_id: "item-1b", name: "주차비", cost: 3000 },],
          
        },
        {
          expense_id: "exp-4",
          block: { block_id: "block-4", name: "곽지 해수욕장" },
          items: [{ expense_item_id: "item-4", name: "주차비", cost: 2000 }],
        },
        {
          expense_id: "exp-6",
          block: { block_id: "block-5", name: "해운대 해수욕장" },
          items: [{ expense_item_id: "item-6", name: "주차비", cost: 2000 }],
        },
        {
          expense_id: "exp-7",
          block: { block_id: "block-6", name: "송도 해수욕장" },
          items: [{ expense_item_id: "item-7", name: "주차비", cost: 2000 }],
        },
      ],
      selected: null,
    },
  ],
};

// day별 지출 항목 — 훅을 루프 밖에서 호출하기 위해 별도 컴포넌트로 분리
const DayExpenses = ({
  planId,
  day,
}: {
  planId: string;
  day: number;
}) => {
  const { data } = useExpenses(planId, day);
  const expenses = data ?? mockExpensesByDay[day] ?? [];

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
  const { planId } = useParams<{ planId: string }>();
  const [activeMode, setActiveMode] = useState<"planMode" | "budget">("planMode");
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [budgetCardMode, setBudgetCardMode] = useState<"view" | "edit">("view");
  const { data } = useBudget(planId);
  const budgetData = data ?? mockBudgetData;
  const showHint = Object.values(mockExpensesByDay).flat().length > 0;
  const startDate = "2026-02-24";
  const items = [
    { value: "1", label: "Day 1" },
    { value: "2", label: "Day 2" },
    { value: "3", label: "Day 3" },
    { value: "4", label: "Day 4" },
    { value: "5", label: "Day 5" },
    { value: "6", label: "Day 6" },
  ];

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
        <PlanHeader title="제주도 여행" day={15} href="" />
      </div>

      {/* DayNav - sticky (지도 아래) */}
      {isCalendarVisible && (
        <div
          className="sticky z-10 bg-background"
          style={{ top: `${64 + (activeMode === "planMode" && isMapVisible ? 180 : 0)}px` }}
        >
          <DayNav
            items={items}
            className="gap-2.25 py-3 h-14"
            itemClassName="h-8 py-1.5"
            onValueChange={(value) => {
              const el = document.getElementById(`day-section-${value}`);
              if (!el) return;
              const mapHeight = activeMode === "planMode" && isMapVisible ? 180 : 0;
              const offset = 64 + mapHeight + 56; // header + map + DayNav(h-14)
              const top = el.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: "smooth" });
            }}
          />
        </div>
      )}

      <main className="flex flex-col pb-18">
        {/* 예산 탭: BudgetSummaryCard */}
        {activeMode === "budget" && (
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

        {items.map((item) => (
          <div key={item.value} id={`day-section-${item.value}`}>
            <DayHeader
              day={Number(item.value)}
              date={formatDayDate(startDate, Number(item.value) - 1)}
              defaultOpen
            >
              {activeMode === "budget" && (
                <DayExpenses planId={planId} day={Number(item.value)} />
              )}
            </DayHeader>
          </div>
        ))}
      </main>

      <div className="fixed bottom-0 left-0 w-full">
        <NavigationBar
          variant="variant3"
          onPlanModeClick={() => setActiveMode("planMode")}
          onBudgetClick={() => setActiveMode("budget")}
        />
      </div>
    </div>
  );
};

export default PlanPage;
