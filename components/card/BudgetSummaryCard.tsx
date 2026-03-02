"use client";

import { CircleHelp, Pencil, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

type BudgetSummaryVariant = "expense" | "budget";
type BudgetSummaryMode = "view" | "edit";

interface BudgetSummaryCardProps {
  /** undefined → 예산 설정 안 함, 아무것도 렌더링하지 않음 */
  variant?: BudgetSummaryVariant;
  /** "view" = 보기 카드, "edit" = 편집모드 카드 (예산 편집하기) */
  mode?: BudgetSummaryMode;
  /** 총 예산 */
  totalBudget?: number;
  /** 지출액 */
  usedAmount?: number;
  /** 1일 평균 지출 */
  perDayAmount?: number;
  /** 1인당 예상 비용 */
  perPersonAmount?: number;
  /** 후보지에 지출이 입력된 경우에만 true → 안내 문구 표시 */
  showHint?: boolean;
  /** 편집 버튼 클릭 핸들러 */
  onEditClick?: () => void;
  className?: string;
}

const formatKRW = (amount: number) =>
  Math.abs(amount).toLocaleString("ko-KR");

const BudgetSummaryCard = ({
  variant,
  mode = "view",
  totalBudget = 0,
  usedAmount = 0,
  perDayAmount = 0,
  perPersonAmount = 0,
  showHint = false,
  onEditClick,
  className,
}: BudgetSummaryCardProps) => {
  // 예산 설정 안 했을 때 - view 모드는 렌더링 없음
  if (!variant && mode === "view") return null;

  // 예산 설정 안 했을 때 - 편집 모드
  if (!variant && mode === "edit") {
    return (
      <div className={cn("px-5 py-1 flex flex-col gap-4", className)}>
        <div className="rounded-3xl p-4 bg-card flex flex-col gap-3">
          {/* 안내 메시지 섹션 */}
          <div className="pb-3 border-b border-dashed border-border">
            <div className="flex items-center gap-1">
              <CircleHelp className="size-4.5 shrink-0 text-muted-foreground" strokeWidth={2} />
              <span className="typography-action-sm-bold text-muted-foreground">
                아직 여행 예산이 설정되지 않았어요
              </span>
            </div>
          </div>

          {/* 편집 버튼 */}
          <Button
            variant="secondary"
            size="M"
            className="w-full bg-secondary/30 hover:bg-secondary/40"
            rightIcon={<Pencil className="size-4.5 opacity-40" strokeWidth={2} />}
            onClick={onEditClick}
          >
            여행 예산 편집
          </Button>
        </div>
      </div>
    );
  }

  // 지출 중심 카드 - 보기
  if (variant === "expense" && mode === "view") {
    return (
      <div className={cn("px-5 py-1 flex flex-col gap-4", className)}>
        {/* 카드 */}
        <div className="rounded-3xl p-4 bg-card flex flex-col gap-3">
          {/* 상단 섹션 */}
          <div className="pb-4 border-b border-dashed border-border">
            {/* Row: 총 지출 / 1일 평균 지출 */}
            <div className="flex justify-between">
              {/* 총 지출 */}
              <div className="flex flex-col">
                <span className="typography-nav-xl-bold text-muted-foreground">총 지출</span>
                <div className="flex items-center gap-0.5">
                  <span className="typography-display-lg-bold text-primary">
                    {formatKRW(usedAmount)}
                  </span>
                  <span className="typography-action-base-bold text-primary">원</span>
                </div>
              </div>

              {/* 1일 평균 지출 */}
              <div className="flex flex-col items-end">
                <span className="typography-nav-xl-bold text-muted-foreground">1일 평균 지출</span>
                <div className="flex items-center gap-0.5">
                  <span className="typography-display-lg-bold text-muted-foreground">
                    {formatKRW(perDayAmount)}
                  </span>
                  <span className="typography-action-base-bold text-muted-foreground">원</span>
                </div>
              </div>
            </div>
          </div>

          {/* 하단: 1인당 예상 비용 badge + 금액 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 rounded-full bg-background px-2.75 py-0.75">
              <UsersRound className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="typography-caption-xs-reg text-primary">1인당 예상 비용</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="typography-display-lg-bold text-foreground">
                {formatKRW(perPersonAmount)}
              </span>
              <span className="typography-action-base-bold text-foreground">원</span>
            </div>
          </div>
        </div>

        {/* 안내 문구: 후보지에 지출이 입력된 경우에만 표시 */}
        {showHint && (
          <div className="flex items-center justify-center gap-1 px-4">
            <CircleHelp className="size-4.5 shrink-0 text-muted-foreground" strokeWidth={2} />
            <span className="typography-caption-xs-reg text-muted-foreground">
              후보지 중 가장 비싼 장소를 기준으로 계산되었어요!
            </span>
          </div>
        )}
      </div>
    );
  }

  // 지출 중심 카드 - 편집
  if (variant === "expense" && mode === "edit") {
    return (
      <div className={cn("px-5 py-1 flex flex-col gap-4", className)}>
        {/* 카드 */}
        <div className="rounded-3xl p-4 bg-card flex flex-col gap-3">
          {/* 상단 섹션 */}
          <div className="pb-4 border-b border-dashed border-border">
            {/* Row: 총 지출 / 1일 평균 지출 */}
            <div className="flex justify-between">
              {/* 총 지출 */}
              <div className="flex flex-col">
                <span className="typography-nav-xl-bold text-muted-foreground">총 지출</span>
                <div className="flex items-center gap-0.5">
                  <span className="typography-display-lg-bold text-primary">
                    {formatKRW(usedAmount)}
                  </span>
                  <span className="typography-action-base-bold text-primary">원</span>
                </div>
              </div>

              {/* 1일 평균 지출 */}
              <div className="flex flex-col items-end">
                <span className="typography-nav-xl-bold text-muted-foreground">1일 평균 지출</span>
                <div className="flex items-center gap-0.5">
                  <span className="typography-display-lg-bold text-muted-foreground">
                    {formatKRW(perDayAmount)}
                  </span>
                  <span className="typography-action-base-bold text-muted-foreground">원</span>
                </div>
              </div>
            </div>
          </div>

          {/* 1인당 예상 비용 badge + 금액 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 rounded-full bg-background px-2.75 py-0.75">
              <UsersRound className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="typography-caption-xs-reg text-primary">1인당 예상 비용</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="typography-display-lg-bold text-foreground">
                {formatKRW(perPersonAmount)}
              </span>
              <span className="typography-action-base-bold text-foreground">원</span>
            </div>
          </div>

          {/* 편집 버튼 */}
          <Button
            variant="secondary"
            size="M"
            className="w-full bg-secondary/30 hover:bg-secondary/40"
            rightIcon={<Pencil className="size-4.5 opacity-40" strokeWidth={2} />}
            onClick={onEditClick}
          >
            여행 예산 편집
          </Button>
        </div>

        {/* 안내 문구: 후보지에 지출이 입력된 경우에만 표시 */}
        {showHint && (
          <div className="flex items-center justify-center gap-1 px-4">
            <CircleHelp className="size-4.5 shrink-0 text-muted-foreground" strokeWidth={2} />
            <span className="typography-caption-xs-reg text-muted-foreground">
              후보지 중 가장 비싼 장소를 기준으로 계산되었어요!
            </span>
          </div>
        )}
      </div>
    );
  }

  // 예산 중심 카드 - 보기
  if (variant === "budget" && mode === "view") {
    const remaining = totalBudget - usedAmount;
    const isOver = remaining < 0;
    const percentage = totalBudget > 0 ? (usedAmount / totalBudget) * 100 : 0;
    const barWidth = Math.min(100, percentage);

    return (
      <div className={cn("px-5 py-1 flex flex-col gap-4", className)}>
        {/* 카드 */}
        <div className="rounded-3xl p-4 bg-card flex flex-col gap-3">
          {/* 상단 섹션 */}
          <div className="flex flex-col gap-4 pb-4 border-b border-dashed border-border">
            {/* Row 1: 총 예산 / 남은 예산 */}
            <div className="flex justify-between">
              {/* 총 예산 */}
              <div className="flex flex-col">
                <span className="typography-nav-xl-bold text-muted-foreground">총 예산</span>
                <div className="flex items-center gap-0.5">
                  <span className="typography-display-lg-bold text-foreground">
                    {formatKRW(totalBudget)}
                  </span>
                  <span className="typography-action-base-bold text-foreground">원</span>
                </div>
              </div>

              {/* 남은 예산 */}
              <div className="flex flex-col items-end">
                <span className="typography-nav-xl-bold text-muted-foreground">
                  남은 예산
                </span>
                <div className="flex items-center gap-0.5">
                  <span
                    className={cn(
                      "typography-display-lg-bold",
                      isOver ? "text-red-500" : "text-primary",
                    )}
                  >
                    {isOver ? "-" : ""}{formatKRW(remaining)}
                  </span>
                  <span
                    className={cn(
                      "typography-action-base-bold",
                      isOver ? "text-red-500" : "text-primary",
                    )}
                  >
                    원
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: 지출액 + 프로그레스 바 */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <span className="typography-nav-xl-bold text-muted-foreground">지출액</span>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-0.5">
                    <span className="typography-display-lg-bold text-foreground">
                      {formatKRW(usedAmount)}
                    </span>
                    <span className="typography-action-base-bold text-foreground">원</span>
                  </div>
                  <span className={cn("typography-nav-xl-bold pt-[1.5px]", isOver ? "text-red-500" : "text-muted-foreground")}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              {/* 프로그레스 바 */}
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn("h-full rounded-sm", isOver ? "bg-red-500" : "bg-primary")}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          </div>

          {/* 하단: 1인당 예상 비용 badge + 금액 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 rounded-full bg-background px-2.75 py-0.75">
              <UsersRound className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="typography-caption-xs-reg text-primary">1인당 예상 비용</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="typography-display-lg-bold text-foreground">
                {formatKRW(perPersonAmount)}
              </span>
              <span className="typography-action-base-bold text-foreground">원</span>
            </div>
          </div>
        </div>

        {/* 안내 문구: 후보지에 지출이 입력된 경우에만 표시 */}
        {showHint && (
          <div className="flex items-center justify-center gap-1 px-4">
            <CircleHelp className="size-4.5 shrink-0 text-muted-foreground" strokeWidth={2} />
            <span className="typography-caption-xs-reg text-muted-foreground">
              후보지 중 가장 비싼 장소를 기준으로 계산되었어요!
            </span>
          </div>
        )}
      </div>
    );
  }

  // 예산 중심 카드 - 편집
  if (variant === "budget" && mode === "edit") {
    const remaining = totalBudget - usedAmount;
    const isOver = remaining < 0;
    const percentage = totalBudget > 0 ? (usedAmount / totalBudget) * 100 : 0;
    const barWidth = Math.min(100, percentage);

    return (
      <div className={cn("px-5 py-1 flex flex-col gap-4", className)}>
        {/* 카드 */}
        <div className="rounded-3xl p-4 bg-card flex flex-col gap-3">
          {/* 상단 섹션 */}
          <div className="flex flex-col gap-4 pb-4 border-b border-dashed border-border">
            {/* Row 1: 총 예산 / 남은 예산 */}
            <div className="flex justify-between">
              {/* 총 예산 */}
              <div className="flex flex-col">
                <span className="typography-nav-xl-bold text-muted-foreground">총 예산</span>
                <div className="flex items-center gap-0.5">
                  <span className="typography-display-lg-bold text-foreground">
                    {formatKRW(totalBudget)}
                  </span>
                  <span className="typography-action-base-bold text-foreground">원</span>
                </div>
              </div>

              {/* 남은 예산 */}
              <div className="flex flex-col items-end">
                <span className="typography-nav-xl-bold text-muted-foreground">남은 예산</span>
                <div className="flex items-center gap-0.5">
                  <span
                    className={cn(
                      "typography-display-lg-bold",
                      isOver ? "text-red-500" : "text-primary",
                    )}
                  >
                    {isOver ? "-" : ""}{formatKRW(remaining)}
                  </span>
                  <span
                    className={cn(
                      "typography-action-base-bold",
                      isOver ? "text-red-500" : "text-primary",
                    )}
                  >
                    원
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: 지출액 + 프로그레스 바 */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <span className="typography-nav-xl-bold text-muted-foreground">지출액</span>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-0.5">
                    <span className="typography-display-lg-bold text-foreground">
                      {formatKRW(usedAmount)}
                    </span>
                    <span className="typography-action-base-bold text-foreground">원</span>
                  </div>
                  <span className={cn("typography-nav-xl-bold pt-[1.5px]", isOver ? "text-red-500" : "text-muted-foreground")}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              {/* 프로그레스 바 */}
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn("h-full rounded-sm", isOver ? "bg-red-500" : "bg-primary")}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          </div>

          {/* 1인당 예상 비용 badge + 금액 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 rounded-full bg-background px-2.75 py-0.75">
              <UsersRound className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="typography-caption-xs-reg text-primary">1인당 예상 비용</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="typography-display-lg-bold text-foreground">
                {formatKRW(perPersonAmount)}
              </span>
              <span className="typography-action-base-bold text-foreground">원</span>
            </div>
          </div>

          {/* 편집 버튼 */}
          <Button
            variant="secondary"
            size="M"
            className="w-full bg-secondary/30 hover:bg-secondary/40"
            rightIcon={<Pencil className="size-4.5 opacity-40" strokeWidth={2} />}
            onClick={onEditClick}
          >
            여행 예산 편집
          </Button>
        </div>

        {/* 안내 문구: 후보지에 지출이 입력된 경우에만 표시 */}
        {showHint && (
          <div className="flex items-center justify-center gap-1 px-4">
            <CircleHelp className="size-4.5 shrink-0 text-muted-foreground" strokeWidth={2} />
            <span className="typography-caption-xs-reg text-muted-foreground">
              후보지 중 가장 비싼 장소를 기준으로 계산되었어요!
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default BudgetSummaryCard;
