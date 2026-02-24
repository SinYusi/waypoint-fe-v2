/**
 * 예산 조회 요청 파라미터
 * GET /plans/{planId}/budgets
 */
export type GetBudgetParams = {
  planId: string;
};

/**
 * 예산 조회 성공 응답
 * 200
 */
export type BudgetResponse = {
  budget_id: number;
  /** BUDGET: 예산 중심, EXPENSE: 지출 중심 */
  type: "BUDGET" | "EXPENSE";
  /** 총 예산 (예산 중심일 때만 존재) */
  total_budget: number | null;
  /** 총 지출액 */
  total_cost: number;
  /** 남은 예산 (예산 중심일 때만 존재) */
  remaining_budget: number | null;
  /** 1인당 예상 비용 */
  cost_per_person: number;
  /** 여행 인원 수 */
  traveler_count: number;
};
