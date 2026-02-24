/**
 * Budget API
 * --------------------------------------------------
 *
 * - 예산 조회 (GET | `/plans/{planId}/budgets`)
 */

import type { BudgetResponse, GetBudgetParams } from "@/types/budget";
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
