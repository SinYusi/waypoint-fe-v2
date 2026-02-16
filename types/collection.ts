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
 * 컬렉션 장소 목록 조회 요청 파라미터
 * GET /collections/{collectionId}/places
 */
export type GetCollectionPlacesParams = {
  collectionId: string;
  page?: number;
  size?: number;
};

export type PlaceCategoryLevel = {
  category_id: string;
  name: string;
};

export type PlaceCategory = {
  level1: PlaceCategoryLevel;
  level2: PlaceCategoryLevel;
  level3: PlaceCategoryLevel;
  primary_type: PlaceCategoryLevel | null;
};

export type PlacePoint = {
  latitude: number;
  longitude: number;
};

export type PlaceResponse = {
  place_id: string;
  google_place_id: string;
  name: string;
  address: string;
  category: PlaceCategory;
  google_maps_uri: string;
  photos: string[];
  point: PlacePoint;
};

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
 * 컬렉션 장소 목록 조회 성공 응답
 * 200
 */
export type CollectionPlacesResponse = {
  contents: CollectionPlaceResponse[];
  has_next: boolean;
  size: number;
  page: number;
};
