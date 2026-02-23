type BudgetSummaryVariant = "expense" | "budget";
type BudgetSummaryMode = "view" | "edit";

interface BudgetSummaryCardProps {
  /** undefined → 예산 설정 안 함, 아무것도 렌더링하지 않음 */
  variant?: BudgetSummaryVariant;
  /** "view" = 보기 카드, "edit" = 편집모드 카드 (예산 편집하기) */
  mode?: BudgetSummaryMode;
  className?: string;
}

const BudgetSummaryCard = ({
  variant,
  mode = "view",
  className,
}: BudgetSummaryCardProps) => {
  // 예산 설정 안 했을 때 - 렌더링 없음
  if (!variant) return null;

  // 지출 중심 카드 - 보기
  if (variant === "expense" && mode === "view") {
    return <div className={className}>{/* TODO: 지출 중심 카드 */}</div>;
  }

  // 지출 중심 카드 - 편집
  if (variant === "expense" && mode === "edit") {
    return <div className={className}>{/* TODO: 지출 중심 편집 카드 */}</div>;
  }

  // 예산 중심 카드 - 보기
  if (variant === "budget" && mode === "view") {
    return <div className={className}>{/* TODO: 예산 중심 카드 */}</div>;
  }

  // 예산 중심 카드 - 편집
  if (variant === "budget" && mode === "edit") {
    return <div className={className}>{/* TODO: 예산 중심 편집 카드 */}</div>;
  }

  return null;
};

export default BudgetSummaryCard;
