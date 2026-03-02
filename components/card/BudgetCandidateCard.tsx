import { CircleCheck, ChevronRight } from "lucide-react";
import PlaceTypeIcon, { type PlaceType } from "@/components/card/PlaceTypeIcon";
import type { ExpenseItem } from "@/components/card/BudgetPlaceCard";

interface BudgetCandidateCardProps {
  placeName: string;
  items: ExpenseItem[];
  placeType: PlaceType;
  candidateCount: number;
  onSelectClick?: () => void;
  onClick?: () => void;
  className?: string;
}

const BudgetCandidateCard = ({
  placeName,
  items,
  placeType,
  candidateCount,
  onSelectClick,
  onClick,
  className,
}: BudgetCandidateCardProps) => {
  return (
    <article
      onClick={onClick}
      className={`w-full overflow-hidden rounded-2xl border border-border bg-background shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
    >
      {/* Header */}
      <header className="flex items-start justify-between px-4 pt-3.5 pb-3">
        <div className="flex min-w-0 items-center gap-2 pr-1.5">
          <h3 className="typography-display-lg-bold truncate text-[#020618]">
            {placeName}
          </h3>
        </div>
        <div className="shrink-0">
          <PlaceTypeIcon type={placeType} />
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-col gap-3 pt-1 pb-3.5">
        {/* 요금 행(들) */}
        <div className="flex flex-col gap-1 pl-4 pr-3">
          {items.length === 0 ? (
            <div className="flex h-6 w-full items-center justify-end gap-2 pr-1">
              <span className="typography-body-base text-[#757575]">지출없음</span>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex w-full items-center justify-between pr-1">
                <span className="typography-body-sm-reg text-muted-foreground">
                  {item.name}
                </span>
                <div className="flex h-6 items-center justify-end gap-0.5 text-foreground">
                  <span className="typography-body-base h-6 whitespace-nowrap leading-6">
                    {item.cost.toLocaleString("ko-KR")}
                  </span>
                  <span className="typography-body-sm-reg h-6 leading-6">원</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 다시 선택하기 버튼 */}
        <div className="px-4">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelectClick?.(); }}
            className="flex h-8 w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#F0F0F0] px-2.5 py-2"
          >
            <CircleCheck
              className="size-4 shrink-0 text-primary"
              strokeWidth={2}
            />
            <span className="typography-nav-xl-reg text-foreground">
              총 {candidateCount}개의 후보지 중 다시 선택하기
            </span>
            <ChevronRight
              className="size-4 shrink-0 opacity-40"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default BudgetCandidateCard;
