import { PlaceResponse } from "./collection";

/**
 * 컬렉션 생성 요청
 * POST /collections
 */
export type CreateCollectionRequest = {
  title: string;
};

/**
 * 컬렉션 생성 성공 응답
 * 201
 */
export type CollectionResponse = {
  collection_id: string;
  title?: string;
  thumbnail?: string;
  member_count: number;
  place_count: number;
};

/**
 * 컬렉션 목록 조회 요청 쿼리 파라미터
 * GET /collections
 */
export type GetCollectionsParams = {
  page?: number;
  size?: number;
};

/**
 * 컬렉션 목록 조회 성공 응답
 * 200
 */
export type CollectionListResponse = {
  contents: CollectionResponse[];
  has_next: boolean;
  page: number;
  size: number;
};

/**
 * 컬렉션 조회 요청 Path 파라미터
 * GET /collections/{collectionId}
 */
export type GetCollectionParams = {
  collectionId: string;
};

/**
 * 컬렉션 삭제 요청 Path 파라미터
 * DELETE /collections/{collectionId}
 */
export type DeleteCollectionParams = {
  collectionId: string;
};

/**
 * 컬렉션 삭제 성공 응답
 * 204
 * (응답 바디 없음)
 */
export type DeleteCollectionResponse = void;

/**
 * 컬렉션 수정 요청 Path 파라미터
 * PUT /collections/{collectionId}
 */
export type UpdateCollectionParams = {
  collectionId: string;
};

/**
 * 컬렉션 수정 요청
 * PUT /collections/{collectionId}
 */
export type UpdateCollectionRequest = {
  title: string;
};

/**
 * 컬렉션 수정 성공 응답
 * 200
 */
export type UpdateCollectionResponse = CollectionResponse;

/**
 * 컬렉션 장소 PICK/PASS 요청 파라미터
 * POST /collections/{collectionId}/places/{collectionPlaceId}/preference
 */
export type PostCollectionPlacePreferenceParams = {
  collectionId: string;
  collectionPlaceId: string;
  type: "PICK" | "PASS";
};

/**
 * 컬렉션 장소 목록 조회 요청 파라미터
 * GET /collections/{collectionId}/places
 */
export type GetCollectionPlacesParams = {
  collectionId: string;
  page?: number;
  size?: number;
  sort?: "LATEST" | "OLDEST";
  added_by?: string;
};

export type {
  PlaceCategoryLevel,
  PlaceCategory,
  PlacePoint,
  PlaceResponse,
} from "@/types/place";

export type CollectionMemberResponse = {
  collection_member_id: string;
  nickname?: string;
  picture?: string;
  role?: "OWNER" | "MEMBER";
};

export type PickPassGroup = {
  members: CollectionMemberResponse[];
  count: number;
};

export type PickPassResponse = {
  picked: PickPassGroup;
  passed: PickPassGroup;
  my_preference: "PICK" | "PASS" | "NOTHING";
};

export type CollectionPlaceResponse = {
  collection_place_id: string;
  memo: string;
  place: PlaceResponse;
  pick_pass: PickPassResponse;
};

/**
 * 컬렉션 장소 추가 요청
 * POST /collections/{collectionId}/places
 */
export type AddCollectionPlaceRequest = {
  place_id: string;
};

/**
 * 컬렉션 장소 추가 성공 응답
 * 201
 */
export type AddCollectionPlaceResponse = CollectionPlaceResponse;

/**
 * 컬렉션 장소 목록 조회 성공 응답
 * 200
 */
export type CollectionPlacesResponse = {
  contents: CollectionPlaceResponse[];
  has_next: boolean;
  size: number;
  page: number;
};

export type { InvitationResponse } from "@/types/invitation";

/**
 * 컬렉션에 연결된 플랜 항목
 * GET /collections/{collectionId}/plans
 */
export type CollectionPlanItem = {
  plan_id: string;
  title: string;
};

export type CollectionPlansResponse = CollectionPlanItem[];
