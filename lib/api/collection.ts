/**
 * Collection API
 * --------------------------------------------------
 *
 * - 생성 (POST | `/collections`)
 * - 목록 조회 (GET | `/collections`)
 * - 수정 (PUT | `/collections/{collectionId}`)
 * - 삭제 (DELETE | `/collections/{collectionId}`)
 * - 소유자 변경 (PATCH | `/collections/{collectionId}/owner`)
 */

import {
  CollectionListResponse,
  CollectionResponse,
  CreateCollectionRequest,
  DeleteCollectionParams,
  GetCollectionsParams,
  UpdateCollectionParams,
  UpdateCollectionRequest,
  UpdateCollectionResponse,
} from "@/types/collection";
import { apiClient } from "./client";

/**
 * 컬렉션 생성 API
 *
 * @param body - 생성 요청 데이터
 * @returns 생성된 컬렉션 정보
 */
export const createCollection = async (body: CreateCollectionRequest) => {
  const res = await apiClient.post<CollectionResponse>("/collections", body);
  return res.data;
};

/**
 * 컬렉션 목록 조회 API
 *
 * @param params - 페이지네이션 파라미터 (page, size)
 * @returns 컬렉션 목록 및 페이지 정보
 */
export const getCollections = async (params?: GetCollectionsParams) => {
  const res = await apiClient.get<CollectionListResponse>("/collections", {
    params,
  });
  return res.data;
};

/**
 * 컬렉션 수정 API
 *
 * @param collectionId - 수정할 컬렉션 ID
 * @param body - 수정 요청 데이터
 * @returns 수정된 컬렉션 정보
 */
export const updateCollection = async (
  collectionId: UpdateCollectionParams["collectionId"],
  body: UpdateCollectionRequest,
) => {
  const res = await apiClient.put<UpdateCollectionResponse>(
    `/collections/${collectionId}`,
    body,
  );
  return res.data;
};

/**
 * 컬렉션 삭제 API
 *
 * @param collectionId - 삭제할 컬렉션 ID
 * @returns void (204 No Content)
 */
export const deleteCollection = async (
  collectionId: DeleteCollectionParams["collectionId"],
) => {
  await apiClient.delete(`/collections/${collectionId}`);
};
