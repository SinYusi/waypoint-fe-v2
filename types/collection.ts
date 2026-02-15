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
