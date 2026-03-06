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
 * - 초대 링크 생성 (POST | `/plans/{planId}/invitations`)
 * - 멤버 목록 조회 (GET | `/plans/{planId}/members`)
 * - 플랜 나가기 (DELETE | `/plans/{planId}/members/me`)
 */

import {
  AddPlanBlockCandidatesRequest,
  BlockResponse,
  CandidatesResponse,
  CreatePlanBlockByPlaceRequest,
  CreatePlanBlockRequest,
  CreatePlanRequest,
  DeletePlanParams,
  GetPlanParams,
  GetPlansParams,
  PlanCollectionResponse,
  PlanListResponse,
  PlanResponse,
  UpdatePlanParams,
  UpdatePlanRequest,
  UpdatePlanResponse,
} from "@/types/plan";
import { CollectionPlacesResponse } from "@/types/collection";
import {
  normalizePlaceDetail,
  type PlaceDetailApiResponse,
} from "@/lib/api/place";
import { InvitationResponse } from "@/types/invitation";
import { PlanMembersResponse } from "@/types/member";
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

export const getPlanCollections = async (planId: string) => {
  const res = await apiClient.get<PlanCollectionResponse[]>(
    `/plans/${planId}/collections`,
  );
  return res.data;
};

export const getPlanCollectionPlaces = async (
  planId: string,
  collectionId: string,
  params?: {
    page?: number;
    size?: number;
  },
) => {
  const res = await apiClient.get<CollectionPlacesResponse>(
    `/plans/${planId}/collections/${collectionId}/places`,
    { params },
  );
  return res.data;
};

export const getPlanCollectionPlaceDetail = async (
  planId: string,
  collectionId: string,
  collectionPlaceId: string,
) => {
  const res = await apiClient.get<PlaceDetailApiResponse>(
    `/plans/${planId}/collections/${collectionId}/places/${collectionPlaceId}`,
  );
  return normalizePlaceDetail(res.data);
};

export const createPlanBlock = async (
  planId: string,
  body: CreatePlanBlockRequest,
) => {
  const res = await apiClient.post<BlockResponse>(`/plans/${planId}/blocks`, body);
  return res.data;
};

export const createPlanBlockByPlace = async (
  planId: string,
  body: CreatePlanBlockByPlaceRequest,
) => {
  const res = await apiClient.post<BlockResponse>(
    `/plans/${planId}/blocks/by-place`,
    body,
  );
  return res.data;
};

export const addPlanBlockCandidates = async (
  planId: string,
  timeBlockId: string,
  body: AddPlanBlockCandidatesRequest,
) => {
  const res = await apiClient.post<BlockResponse>(
    `/plans/${planId}/blocks/${timeBlockId}/candidates`,
    body,
  );
  return res.data;
};

/**
 * 플랜 초대 링크 생성 API
 *
 * @param planId - 초대할 플랜 ID
 * @returns 초대 링크 정보 (type, reference_id, url, ttl)
 */
export const createPlanInvitation = async (planId: string) => {
  const res = await apiClient.post<InvitationResponse>(
    `/plans/${planId}/invitations`,
  );
  return res.data;
};

/**
 * 플랜 멤버 목록 조회 API
 *
 * @param planId - 조회할 플랜 ID
 * @returns 멤버 목록 (is_authenticated, me, members)
 */
export const getPlanMembers = async (planId: string) => {
  const res = await apiClient.get<PlanMembersResponse>(
    `/plans/${planId}/members`,
  );
  return res.data;
};

export const leavePlan = async (planId: string): Promise<void> => {
  await apiClient.delete(`/plans/${planId}/members/me`);
};

export const changePlanOwner = async (
  planId: string,
  plan_member_id: string,
): Promise<void> => {
  await apiClient.patch(`/plans/${planId}/owner`, { plan_member_id });
};

export const kickPlanMember = async (
  planId: string,
  memberId: string,
): Promise<void> => {
  await apiClient.delete(`/plans/${planId}/members/${memberId}`);
};

export const selectCandidate = async (
  planId: string,
  timeBlockId: string,
  block_id: string,
): Promise<void> => {
  await apiClient.patch(
    `/plans/${planId}/blocks/${timeBlockId}/selection`,
    { block_id },
  );
};

export const getCandidates = async (
  planId: string,
  timeBlockId: string,
): Promise<CandidatesResponse> => {
  const res = await apiClient.get<CandidatesResponse>(
    `/plans/${planId}/blocks/${timeBlockId}/candidates`,
  );
  return res.data;
};
