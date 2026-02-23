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
