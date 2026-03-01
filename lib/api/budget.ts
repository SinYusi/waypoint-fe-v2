/**
 * Budget API
 * --------------------------------------------------
 *
 * - 예산 조회   (GET   | `/plans/{planId}/budgets`)
 * - 예산 수정   (PATCH | `/plans/{planId}/budgets`)
 * - 지출 추가   (POST  | `/plans/{planId}/expenses`)
 * - 지출 항목 조회 (GET | `/plans/{planId}/expenses`)
 * - 지출 수정   (PUT   | `/plans/{planId}/expenses/{expenseId}`)
 * - 지출 삭제   (DELETE| `/plans/{planId}/expenses/{expenseId}`)
 */

import type {
  BudgetResponse,
  GetBudgetParams,
  UpdateBudgetRequest,
  AddExpenseRequest,
  GetExpensesParams,
  UpdateExpenseRequest,
  ExpenseGroupResponse,
  ExpenseResponse,
} from "@/types/budget";
import { apiClient } from "./client";

/**
 * 예산 조회 API
 *
 * @param planId - 조회할 플랜 ID
 * @returns 예산 정보
 */
export const getBudget = async (planId: GetBudgetParams["planId"]) => {
  const res = await apiClient.get<BudgetResponse>(`/plans/${planId}/budgets`);
  return res.data;
};

/**
 * 예산 수정 API
 *
 * @param planId - 수정할 플랜 ID
 * @param body - 수정 요청 데이터
 * @returns 수정된 예산 정보
 */
export const updateBudget = async (planId: string, body: UpdateBudgetRequest) => {
  const res = await apiClient.patch<BudgetResponse>(`/plans/${planId}/budgets`, body);
  return res.data;
};

/**
 * 지출 추가 API
 *
 * @param planId - 플랜 ID
 * @param body - 추가할 지출 데이터 (prev_expense_id + items)
 * @returns 추가된 지출 그룹 정보
 */
export const addExpense = async (planId: string, body: AddExpenseRequest) => {
  const res = await apiClient.post<ExpenseGroupResponse>(`/plans/${planId}/expenses`, body);
  return res.data;
};

/**
 * 지출 항목 조회 API
 *
 * @param planId - 플랜 ID
 * @param day - (optional) 조회할 일차
 * @returns 지출 그룹 목록
 */
export const getExpenses = async (
  planId: GetExpensesParams["planId"],
  day?: GetExpensesParams["day"],
) => {
  const res = await apiClient.get<ExpenseGroupResponse[]>(`/plans/${planId}/expenses`, {
    params: day !== undefined ? { day } : undefined,
  });
  return res.data;
};

/**
 * 지출 수정 API
 *
 * @param planId - 플랜 ID
 * @param expenseId - 수정할 지출 ID
 * @param body - 수정할 지출 항목 목록
 * @returns 수정된 지출 정보
 */
export const updateExpense = async (
  planId: string,
  expenseId: string,
  body: UpdateExpenseRequest,
) => {
  const res = await apiClient.put<ExpenseResponse>(
    `/plans/${planId}/expenses/${expenseId}`,
    body,
  );
  return res.data;
};

/**
 * 지출 삭제 API
 *
 * @param planId - 플랜 ID
 * @param expenseId - 삭제할 지출 ID
 * @returns void (204 No Content)
 */
export const deleteExpense = async (planId: string, expenseId: string) => {
  await apiClient.delete(`/plans/${planId}/expenses/${expenseId}`);
};
