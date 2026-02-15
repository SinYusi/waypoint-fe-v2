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
  CollectionResponse,
  CreateCollectionRequest,
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
