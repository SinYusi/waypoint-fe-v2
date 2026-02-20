/**
 * 플랜에 연결된 컬렉션 조회 요청 Path 파라미터
 * GET /plans/{planId}/collections
 */
export type GetPlanCollectionParams = {
  planId: string;
};

/**
 * added_by 필드
 */
export type PlanAddedBy = {
  plan_member_id: string;
  nickname: string;
  picture: string;
};

/**
 * 플랜에 연결된 컬렉션 조회 아이템 응답 (배열의 item)
 */
export type PlanCollectionResponse = {
  collection_id: string;
  title: string;
  added_by: PlanAddedBy;
};

/**
 * 플랜에 연결된 컬렉션 조회 성공 응답
 * 200
 * GET /plans/{planId}/collections
 */
export type GetPlanCollectionsResponse = PlanCollectionResponse[];

/**
 * 플랜에 연결된 컬렉션 삭제 요청 Path 파라미터
 * DELETE /plans/{planId}/collections/{collectionId}
 */
export type DeletePlanCollectionParams = {
  planId: string;
  collectionId: string;
};

/**
 * 플랜에 연결된 컬렉션 삭제 성공 응답
 * 204
 * (응답 바디 없음)
 */
export type DeletePlanCollectionResponse = void;

/**
 * 플랜에 컬렉션 추가 요청 Path 파라미터
 * POST /plans/{planId}/collections
 */
export type PostPlanCollectionsParams = {
  planId: string;
};

/**
 * 플랜에 컬렉션 추가 요청 바디
 * POST /plans/{planId}/collections
 */
export type PostPlanCollectionsRequest = {
  collection_ids: string[];
};

/**
 * 플랜에 컬렉션 추가 성공 응답
 * 201
 */
export type PostPlanCollectionsResponse = PlanCollectionResponse[];
