/**
 * 플랜 생성 요청
 * POST /plans
 */
export type CreatePlanRequest = {
  title: string;
  start_date: string; // date (YYYY-MM-DD)
  end_date: string; // date (YYYY-MM-DD)
};

/**
 * 플랜 생성 성공 응답
 * 201
 */
export type PlanResponse = {
  plan_id: string;
  title: string;
  thumbnail?: string;
  start_date: string; // date (YYYY-MM-DD)
  end_date: string; // date (YYYY-MM-DD)
  duration_days: number;
  member_count: number;
  collection_count: number;
};

/**
 * 플랜 목록 조회 요청 쿼리 파라미터
 * GET /plans
 */
export type GetPlansParams = {
  page?: number;
  size?: number;
};

/**
 * 플랜 목록 조회 성공 응답
 * 200
 */
export type PlanListResponse = {
  contents: PlanResponse[];
  has_next: boolean;
  page: number;
  size: number;
};
