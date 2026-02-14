/**
 * 컬렉션 생성 요청 DTO
 * POST /collections
 */
export type CreateCollectionRequest = {
  title: string;
};

/**
 * 컬렉션 생성 성공 응답 DTO
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
 * 컬렉션 목록 조회 성공 응답 DTO
 * 200
 */
export type CollectionListResponse = {
  contents: CollectionResponse[];
  has_next: boolean;
  page: number;
  size: number;
};
