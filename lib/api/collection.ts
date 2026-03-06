/**
 * Collection API
 * --------------------------------------------------
 *
 * - 생성 (POST | `/collections`)
 * - 목록 조회 (GET | `/collections`)
 * - 조회 (GET | `/collections/{collectionId}`)
 * - 수정 (PUT | `/collections/{collectionId}`)
 * - 삭제 (DELETE | `/collections/{collectionId}`)
 * - 소유자 변경 (PATCH | `/collections/{collectionId}/owner`)
 * - AI 장소 추출 작업 생성 (POST | `/collections/{collectionId}/extraction-jobs`)
 * - AI 장소 추출 최신 작업 조회 (GET | `/collections/{collectionId}/extraction-jobs/latest`)
 * - AI 장소 추출 작업 취소 (DELETE | `/collections/{collectionId}/extraction-jobs/{jobId}`)
 * - AI 장소 추출 결과 장소 추가 (POST | `/collections/{collectionId}/extraction-jobs/{jobId}/places`)
 * - 컬렉션 나가기 (DELETE | `/collections/{collectionId}/members/me`)
 * - 연결된 플랜 목록 조회 (GET | `/collections/{collectionId}/plans`)
 * - 소유자 변경 (PATCH | `/collections/{collectionId}/owner`)
 * - 멤버 강퇴 (DELETE | `/collections/{collectionId}/members/{memberId}`)
 */

import {
  AddCollectionPlaceRequest,
  AddCollectionPlaceResponse,
  CollectionListResponse,
  CollectionPlacesResponse,
  CollectionResponse,
  CreateCollectionRequest,
  DeleteCollectionParams,
  GetCollectionParams,
  GetCollectionPlacesParams,
  GetCollectionsParams,
  PostCollectionPlacePreferenceParams,
  UpdateCollectionParams,
  UpdateCollectionRequest,
  UpdateCollectionResponse,
} from "@/types/collection";
import { InvitationResponse } from "@/types/invitation";
import { CollectionMembersResponse } from "@/types/member";
import { CollectionPlansResponse } from "@/types/collection";
import {
  CreateExtractionJobResponse,
  ExtractionJobResponse,
} from "@/types/extraction-job";
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
 * 컬렉션 조회 API
 *
 * @param collectionId - 조회할 컬렉션 ID
 * @returns 컬렉션 상세 정보
 */
export const getCollection = async (
  collectionId: GetCollectionParams["collectionId"],
) => {
  const res = await apiClient.get<CollectionResponse>(
    `/collections/${collectionId}`,
  );
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
 * 컬렉션 장소 추가 API
 *
 * @param collectionId - 컬렉션 ID
 * @param body - place_id
 * @returns 추가된 컬렉션 장소 정보
 */
export const addCollectionPlace = async (
  collectionId: string,
  body: AddCollectionPlaceRequest,
) => {
  const res = await apiClient.post<AddCollectionPlaceResponse>(
    `/collections/${collectionId}/places`,
    body,
  );
  return res.data;
};

/**
 * 컬렉션 장소 목록 조회 API
 *
 * @param collectionId - 조회할 컬렉션 ID
 * @param params - 페이지네이션 파라미터 (page, size)
 * @returns 컬렉션 장소 목록 및 페이지 정보
 */
export const getCollectionPlaces = async (
  collectionId: GetCollectionPlacesParams["collectionId"],
  params?: Omit<GetCollectionPlacesParams, "collectionId">,
) => {
  const res = await apiClient.get<CollectionPlacesResponse>(
    `/collections/${collectionId}/places`,
    { params },
  );
  return res.data;
};

/**
 * 컬렉션 멤버 조회 API
 *
 * @param collectionId - 조회할 컬렉션 ID
 * @returns 컬렉션 멤버 목록
 */
export const getCollectionMembers = async (collectionId: string) => {
  const res = await apiClient.get<CollectionMembersResponse>(
    `/collections/${collectionId}/members`,
  );
  return res.data;
};

/**
 * 컬렉션 장소 PICK/PASS API
 *
 * @param collectionId - 컬렉션 ID
 * @param collectionPlaceId - 컬렉션 장소 ID
 * @param type - PICK 또는 PASS
 */
export const postCollectionPlacePreference = async ({
  collectionId,
  collectionPlaceId,
  type,
}: PostCollectionPlacePreferenceParams) => {
  await apiClient.post(
    `/collections/${collectionId}/places/${collectionPlaceId}/preference`,
    null,
    { params: { type } },
  );
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

/**
 * 컬렉션 초대 링크 생성 API
 *
 * @param collectionId - 초대할 컬렉션 ID
 * @returns 초대 링크 정보 (type, reference_id, url, ttl)
 */
export const createCollectionInvitation = async (collectionId: string) => {
  const res = await apiClient.post<InvitationResponse>(
    `/collections/${collectionId}/invitations`,
  );
  return res.data;
};

/**
 * AI 장소 추출 작업 생성 API
 *
 * @param collectionId - 컬렉션 ID
 * @param url - 분석할 URL
 * @returns job_id, status
 */
export const createExtractionJob = async (
  collectionId: string,
  url: string,
) => {
  const res = await apiClient.post<CreateExtractionJobResponse>(
    `/collections/${collectionId}/extraction-jobs`,
    { url },
  );
  return res.data;
};

/**
 * AI 장소 추출 최신 작업 조회 API
 *
 * @param collectionId - 컬렉션 ID
 * @returns 마지막 추출 작업 결과
 */
export const getLatestExtractionJob = async (collectionId: string) => {
  const res = await apiClient.get<ExtractionJobResponse>(
    `/collections/${collectionId}/extraction-jobs/latest`,
  );
  return res.data;
};

/**
 * AI 장소 추출 작업 취소 API
 *
 * @param collectionId - 컬렉션 ID
 * @param jobId - 취소할 작업 ID
 */
export const deleteExtractionJob = async (
  collectionId: string,
  jobId: string,
) => {
  await apiClient.delete(
    `/collections/${collectionId}/extraction-jobs/${jobId}`,
  );
};

/**
 * AI 장소 추출 결과 장소 추가 API
 *
 * @param collectionId - 컬렉션 ID
 * @param jobId - 추출 작업 ID
 * @param place_ids - 추가할 장소 ID 목록
 */
export const addExtractionJobPlaces = async (
  collectionId: string,
  jobId: string,
  place_ids: string[],
) => {
  await apiClient.post(
    `/collections/${collectionId}/extraction-jobs/${jobId}/places`,
    { place_ids },
  );
};

export const leaveCollection = async (collectionId: string): Promise<void> => {
  await apiClient.delete(`/collections/${collectionId}/members/me`);
};

export const getCollectionPlans = async (collectionId: string): Promise<CollectionPlansResponse> => {
  const res = await apiClient.get<CollectionPlansResponse>(
    `/collections/${collectionId}/plans`,
  );
  return res.data;
};

export const changeCollectionOwner = async (
  collectionId: string,
  collection_member_id: string,
): Promise<void> => {
  await apiClient.patch(`/collections/${collectionId}/owner`, {
    collection_member_id,
  });
};

export const kickCollectionMember = async (
  collectionId: string,
  memberId: string,
): Promise<void> => {
  await apiClient.delete(`/collections/${collectionId}/members/${memberId}`);
};
