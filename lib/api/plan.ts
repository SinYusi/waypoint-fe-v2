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

import {
  CreatePlanRequest,
  DeletePlanParams,
  GetPlanParams,
  GetPlansParams,
  PlanListResponse,
  PlanResponse,
  UpdatePlanParams,
  UpdatePlanRequest,
  UpdatePlanResponse,
} from "@/types/plan";
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

/**
 * 플랜 목록 조회 API
 *
 * @param params - 페이지네이션 파라미터 (page, size)
 * @returns 플랜 목록 및 페이지 정보
 */
export const getPlans = async (params?: GetPlansParams) => {
  const res = await apiClient.get<PlanListResponse>("/plans", {
    params,
  });
  return res.data;
};

/**
 * 플랜 조회 API
 *
 * @param planId - 조회할 플랜 ID
 * @returns 플랜 상세 정보
 */
export const getPlan = async (planId: GetPlanParams["planId"]) => {
  const res = await apiClient.get<PlanResponse>(`/plans/${planId}`);
  return res.data;
};

/**
 * 플랜 삭제 API
 *
 * @param planId - 삭제할 플랜 ID
 * @returns void (204 No Content)
 */
export const deletePlan = async (planId: DeletePlanParams["planId"]) => {
  await apiClient.delete(`/plans/${planId}`);
};

/**
 * 플랜 수정 API
 *
 * @param planId - 수정할 플랜 ID
 * @param body - 수정 요청 데이터
 * @returns 플랜 수정 응답(확인 필요 여부 + plan + affectedDays)
 */
export const updatePlan = async (
  planId: UpdatePlanParams["planId"],
  body: UpdatePlanRequest,
) => {
  const res = await apiClient.put<UpdatePlanResponse>(`/plans/${planId}`, body);
  return res.data;
};
