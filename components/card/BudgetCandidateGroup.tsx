"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import BudgetPlaceCard from "@/components/card/BudgetPlaceCard";
import { type PlaceType } from "@/components/card/PlaceTypeIcon";

const VISIBLE_COUNT = 3;

interface CardItem {
  placeName: string;
  feeLabel?: string;
  amount: number;
  placeType: PlaceType;
}

interface BudgetCandidateGroupProps {
  mode?: "edit" | "view";
  cards: CardItem[];
  onSelectCandidates?: () => void;
  className?: string;
}

const BudgetCandidateGroup = ({
  mode = "view",
  cards,
  onSelectCandidates,
  className,
}: BudgetCandidateGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMore = cards.length > VISIBLE_COUNT;
  const hiddenCount = cards.length - VISIBLE_COUNT;
  const visibleCards = hasMore && !isExpanded ? cards.slice(0, VISIBLE_COUNT) : cards;

  return (
    <div
      className={`flex flex-col gap-3 rounded-3xl border border-dashed border-border bg-card p-3 ${className ?? ""}`}
    >
      {/* 카드 목록 */}
      {visibleCards.map((card, index) => (
        <BudgetPlaceCard
          key={index}
          placeName={card.placeName}
          feeLabel={card.feeLabel}
          amount={card.amount}
          placeType={card.placeType}
        />
      ))}

      {/* Edit 모드 푸터: 더 보기/접기 버튼만 (≤3개일 때는 푸터 없음) */}
      {mode === "edit" && hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex h-10 w-full items-center justify-center gap-1 rounded-2xl py-2.5 px-2 text-foreground"
        >
          <span className="typography-action-sm-reg">
            {isExpanded ? "접기" : `+ ${hiddenCount}개 더 보기`}
          </span>
          {isExpanded ? (
            <ChevronUp className="size-6 opacity-40" strokeWidth={2} />
          ) : (
            <ChevronDown className="size-6 opacity-40" strokeWidth={2} />
          )}
        </button>
      )}

      {/* View 모드 푸터: 항상 표시 (구분선 + 버튼 영역) */}
      {mode === "view" && (
        <div className="border-t border-dashed border-border pt-3">
          <div
            className={`flex h-10 items-center ${hasMore ? "justify-between" : ""}`}
          >
            {/* 더 보기/접기 링크 버튼 (4개 이상일 때만) */}
            {hasMore && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex h-10 items-center gap-1 rounded-2xl py-2.5 px-2 text-foreground"
              >
                <span className="typography-action-sm-reg">
                  {isExpanded ? "접기" : `+ ${hiddenCount}개 더 보기`}
                </span>
                {isExpanded ? (
                  <ChevronUp className="size-6 opacity-40" strokeWidth={2} />
                ) : (
                  <ChevronDown className="size-6 opacity-40" strokeWidth={2} />
                )}
              </button>
            )}

            {/* 후보지 선택하기 버튼 */}
            <button
              type="button"
              onClick={onSelectCandidates}
              className={`flex h-10 items-center justify-center gap-1 rounded-xl border border-border bg-background px-4 py-2.5 ${!hasMore ? "w-full" : ""}`}
            >
              <span className="typography-action-sm-bold text-foreground">
                후보지 선택하기
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCandidateGroup;
