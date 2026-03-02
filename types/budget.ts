/**
 * 예산 조회 요청 파라미터
 * GET /plans/{planId}/budgets
 */
export type GetBudgetParams = {
  planId: string;
};

/**
 * 예산 조회/수정 성공 응답
 * GET | PATCH /plans/{planId}/budgets → 200
 */
export type BudgetResponse = {
  budget_id: string;
  /** BUDGET: 예산 중심, EXPENSE: 지출 중심, INITIAL: 초기 상태 */
  type: "BUDGET" | "EXPENSE" | "INITIAL";
  /** 총 예산 */
  total_budget: number;
  /** 총 지출액 */
  total_cost: number;
  /** 남은 예산 (음수면 초과) */
  remaining_budget: number;
  /** 1인당 비용 */
  cost_per_person: number;
  /** 여행 인원 */
  traveler_count: number;
};

/**
 * 예산 수정 요청
 * PATCH /plans/{planId}/budgets
 */
export type UpdateBudgetRequest = {
  type: "BUDGET" | "EXPENSE";
  total_budget?: number;
  traveler_count?: number;
};

// ---------------------------------------------------------------------------
// Expense 공통 타입
// ---------------------------------------------------------------------------

export type BlockStatus = "FIXED" | "PENDING" | "DIRECT";

export type ExpenseBlockInfo = {
  block_id: string;
  name: string;
  category: PlaceCategory;
};

export type PlaceCategoryLevel = {
  category_id: string;
  name: string;
};

export type PlaceCategory = {
  level1: PlaceCategoryLevel;
  level2: PlaceCategoryLevel;
  level3: PlaceCategoryLevel;
};

export type ExpenseItemResponse = {
  expense_item_id: string;
  name: string;
  cost: number;
};

/**
 * 지출 단건 응답
 */
export type ExpenseResponse = {
  expense_id: string;
  block?: ExpenseBlockInfo | null;
  items: ExpenseItemResponse[];
};

/**
 * 지출 그룹 응답 (타임블록 단위)
 */
export type ExpenseGroupResponse = {
  time_block_id?: string | null;
  /** ADDITIONAL: 추가 지출, BLOCK: 블록 */
  type: "ADDITIONAL" | "BLOCK";
  block_status?: BlockStatus | null;
  candidate_count?: number | null;
  candidates?: ExpenseResponse[] | null;
  selected?: ExpenseResponse | null;
};

// ---------------------------------------------------------------------------
// 지출 추가 (POST /plans/{planId}/expenses)
// ---------------------------------------------------------------------------

export type AddExpenseItemRequest = {
  name: string;
  cost: string;
};

export type AddExpenseRequest = {
  prev_expense_id?: string | null;
  items: AddExpenseItemRequest[];
};

/**
 * 지출 항목 조회 요청 파라미터
 * GET /plans/{planId}/expenses
 */
export type GetExpensesParams = {
  planId: string;
  day?: number;
};

// ---------------------------------------------------------------------------
// 지출 수정 (PUT /plans/{planId}/expenses/{expenseId})
// ---------------------------------------------------------------------------

export type UpdateExpenseItemRequest = {
  /** 기존 항목 수정 시 포함, 새 항목은 생략 */
  expense_item_id?: string | null;
  name: string;
  cost: string;
};

export type UpdateExpenseRequest = UpdateExpenseItemRequest[];
