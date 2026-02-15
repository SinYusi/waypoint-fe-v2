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
