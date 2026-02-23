/**
 * Plans API
 * --------------------------------------------------
 *
 * - 생성 (POST | `/plans`)
 * - 목록 조회 (GET | `/plans`)
 * - 조회 (GET | `/plans/{planId}`)
 * - 수정 (PUT | `/plans/{planId}`)
 * - 삭제 (DELETE | `/plans/{planId}`)
 * - 소유자 변경 (PATCH | `/plans/{planId}/owner`)
 */

import { CreatePlanRequest, PlanResponse } from "@/types/plan";
import { apiClient } from "./client";

/**
 * 플랜 생성 API
 *
 * @param body - 생성 요청 데이터
 * @returns 생성된 플랜 정보
 */
export const createPlan = async (body: CreatePlanRequest) => {
  const res = await apiClient.post<PlanResponse>("/plans", body);
  return res.data;
};
