/**
 * Plan - Collection API
 * --------------------------------------------------
 * [플랜에 연결된]
 * - 컬렉션 조회 (GET | `/plans/{planId}/collections`)
 * - 컬렉션의 장소 조회 (GET | `/plans/{planId}/collections/{collectionId}/places`)
 * - 컬렉션의 장소 상세 조회 (GET | `/plans/{planId}/collections/{collectionId}/places/{collectionPlaceId}`)
 * - 컬렉션 삭제 (DELETE | `/plans/{planId}/collections/{collectionId}`)
 * [플랜에]
 * - 컬렉션 추가 (POST | `/plans/{planId}/collections`)
 */

import {
  DeletePlanCollectionParams,
  GetPlanCollectionParams,
  GetPlanCollectionsResponse,
  PostPlanCollectionsParams,
  PostPlanCollectionsRequest,
  PostPlanCollectionsResponse,
} from "@/types/plan-collection";
import { apiClient } from "./client";

/**
 * 플랜에 연결된 컬렉션 조회 API
 *
 * @param planId - 조회할 플랜 ID
 * @returns 연결된 컬렉션 목록
 */
export const getPlanCollections = async (
  planId: GetPlanCollectionParams["planId"],
) => {
  const res = await apiClient.get<GetPlanCollectionsResponse>(
    `/plans/${planId}/collections`,
  );
  return res.data;
};

/**
 * 플랜에 컬렉션 추가 API
 *
 * @param planId - 플랜 ID
 * @param body - 추가할 컬렉션 id 배열
 * @returns 추가된 컬렉션 목록(added_by 포함)
 */
export const postPlanCollections = async (
  { planId }: PostPlanCollectionsParams,
  body: PostPlanCollectionsRequest,
) => {
  const res = await apiClient.post<PostPlanCollectionsResponse>(
    `/plans/${planId}/collections`,
    body,
  );
  return res.data;
};

/**
 * 플랜에 연결된 컬렉션 삭제 API
 *
 * @param planId - 연결된 플랜 ID
 * @param collectionId - 삭제할 컬렉션 ID
 * @returns void (204 No Content)
 */
export const deletePlanCollection = async ({
  planId,
  collectionId,
}: DeletePlanCollectionParams) => {
  await apiClient.delete(`/plans/${planId}/collections/${collectionId}`);
};
