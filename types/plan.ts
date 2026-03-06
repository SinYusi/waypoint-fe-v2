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

/**
 * 플랜 조회 요청 Path 파라미터
 * GET /plans/{planId}
 */
export type GetPlanParams = {
  planId: string;
};

/**
 * 플랜 삭제 요청 Path 파라미터
 * DELETE /plans/{planId}
 */
export type DeletePlanParams = {
  planId: string;
};

/**
 * 플랜 삭제 성공 응답
 * 204
 * (응답 바디 없음)
 */
export type DeletePlanResponse = void;

/**
 * 플랜 수정 요청 Path 파라미터
 * PUT /plans/{planId}
 */
export type UpdatePlanParams = {
  planId: string;
};

/**
 * 플랜 수정 요청 바디
 * PUT /plans/{planId}
 *
 * - 기본: title, start_date, end_date 전송
 * - 날짜 축소 시: requiresConfirmation: true가 오면 confirm: true 추가하여 재요청
 */
export type UpdatePlanRequest = {
  title: string;
  start_date: string; // date (YYYY-MM-DD)
  end_date: string; // date (YYYY-MM-DD)
  confirm?: boolean; // 날짜 삭제(축소) 재요청시 사용
};

export type UpdateType = "DECREASE" | "STAY" | "INCREASE" | null;

/**
 * 날짜 축소로 인해 영향 받는 일차 정보
 * affectedDays[].scheduleCount === 0 이면 일정 없이 삭제되는 날
 */
export type AffectedDays = {
  day: number;
  schedule_count: number;
};

/**
 * 플랜 수정 성공 응답
 * 200
 */
export type UpdatePlanResponse = {
  requires_confirmation: boolean;
  update_type: UpdateType;
  plan: PlanResponse | null;
  affected_days: AffectedDays[] | null;
};

export type PlanAddedBy = {
  plan_member_id: string;
  nickname: string;
  picture: string;
};

export type PlanCollectionResponse = {
  collection_id: string;
  title: string;
  added_by: PlanAddedBy;
};

export type TimeBlockType = "PLACE" | "FREE";

export type CreatePlanBlockRequest = {
  type: TimeBlockType;
  collection_place_id?: string;
  day: number;
  start_time: string;
  end_time: string;
  memo?: string;
};

export type CreatePlanBlockByPlaceRequest = {
  place_id?: string;
  day: number;
  start_time: string;
  end_time: string;
  memo?: string;
};

export type AddPlanBlockCandidatesRequest =
  | {
      collection_place_ids: string[];
      place_ids?: never;
    }
  | {
      place_ids: string[];
      collection_place_ids?: never;
    };

export type BlockResponse = {
  time_block_id: string;
  type: TimeBlockType;
  block_status: "FIXED" | "PENDING" | "DIRECT";
  start_time: string;
  end_time: string;
  candidate_count: number;
};

/**
 * 후보지 목록 조회 응답
 * GET /plans/{planId}/blocks/{timeBlockId}/candidates
 */
export type DayInfo = {
  day: number;
  date: string;
  day_of_week: string;
};

export type CandidateOpinionSummary = {
  total_count: number;
  distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  my: {
    opinion_id: string;
    type: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  } | null;
};

export type CandidateExpenseItem = {
  expense_item_id: string;
  name: string;
  cost: number;
};

export type CandidateItem = {
  block_id: string;
  memo: string;
  place: import("@/types/place").PlaceResponse;
  selected: boolean;
  added_by: PlanAddedBy;
  opinion_summary: CandidateOpinionSummary;
  expense_items: CandidateExpenseItem[];
};

export type CandidatesResponse = {
  time_block_id: string;
  title: string;
  day_info: DayInfo;
  start_time: string;
  end_time: string;
  candidate_count: number;
  candidates: CandidateItem[];
};
