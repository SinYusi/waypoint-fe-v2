"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import BudgetPlaceCard, { type ExpenseItem } from "@/components/card/BudgetPlaceCard";
import { type PlaceType } from "@/components/card/PlaceTypeIcon";
import { Button } from "@/components/ui/button";


// ─── Item type ────────────────────────────────────────────────────────────────

interface CardItem {
  placeName: string;
  expenseId?: string;
  items: ExpenseItem[];
  placeType: PlaceType;
}

// ─── Group props ──────────────────────────────────────────────────────────────

interface BudgetCandidateGroupEditProps {
  mode: "edit";
  cards: CardItem[];
  onCardClick?: (card: CardItem) => void;
  className?: string;
}

interface BudgetCandidateGroupViewProps {
  mode: "view";
  cards: CardItem[];
  onSelectCandidates?: () => void;
  onCardClick?: (card: CardItem) => void;
  className?: string;
}

type BudgetCandidateGroupProps =
  | BudgetCandidateGroupEditProps
  | BudgetCandidateGroupViewProps;

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLAPSE_THRESHOLD = 4;
const COLLAPSED_SHOW_COUNT = 3;

// ─── Component ────────────────────────────────────────────────────────────────

const BudgetCandidateGroup = (props: BudgetCandidateGroupProps) => {
  const { mode, cards, className, onCardClick } = props;
  const isCollapsible = cards.length >= COLLAPSE_THRESHOLD;
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCards =
    isCollapsible && !isExpanded ? cards.slice(0, COLLAPSED_SHOW_COUNT) : cards;

  const hiddenCount = cards.length - COLLAPSED_SHOW_COUNT;

  if (mode === "edit") {
    return (
      <div
        className={`flex flex-col gap-3 rounded-3xl border border-dashed border-border bg-card p-3 ${className ?? ""}`}
      >
        {visibleCards.map((card, index) => (
          <BudgetPlaceCard
            key={index}
            placeName={card.placeName}
            items={card.items}
            placeType={card.placeType}
            onClick={onCardClick ? () => onCardClick(card) : undefined}
          />
        ))}
        {isCollapsible && (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 px-2 py-2.5 typography-action-sm-reg text-foreground"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "접기" : `+ ${hiddenCount}개 더 보기`}
            {isExpanded ? (
              <ChevronUpIcon className="size-6 opacity-40" />
            ) : (
              <ChevronDownIcon className="size-6 opacity-40" />
            )}
          </button>
        )}
      </div>
    );
  }

  const { onSelectCandidates } = props as BudgetCandidateGroupViewProps;

  return (
    <div
      className={`flex flex-col gap-3 rounded-3xl border border-dashed border-border bg-card p-3 ${className ?? ""}`}
    >
      {visibleCards.map((card, index) => (
        <BudgetPlaceCard
          key={index}
          placeName={card.placeName}
          items={card.items}
          placeType={card.placeType}
          onClick={onCardClick ? () => onCardClick(card) : undefined}
        />
      ))}

      {/* 구분선 */}
      <div
        style={{
          height: 1,
          background:
            "repeating-linear-gradient(to right, #e2e2e2 0, #e2e2e2 2px, transparent 2px, transparent 4px)",
        }}
      />

      {/* 하단 버튼 영역 */}
      {isCollapsible ? (
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-2.5 typography-action-sm-reg text-foreground"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "접기" : `+ ${hiddenCount}개 더 보기`}
            {isExpanded ? (
              <ChevronUpIcon className="size-6 opacity-40" />
            ) : (
              <ChevronDownIcon className="size-6 opacity-40" />
            )}
          </button>
          <Button
            variant="outline"
            className="rounded-xl border border-border bg-background px-4 py-2.5 typography-action-sm-bold text-foreground"
            onClick={onSelectCandidates}
          >
            후보지 선택하기
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 typography-action-sm-bold text-foreground"
          onClick={onSelectCandidates}
        >
          후보지 선택하기
        </Button>
      )}
    </div>
  );
};

export default BudgetCandidateGroup;
