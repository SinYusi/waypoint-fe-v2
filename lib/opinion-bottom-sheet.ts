export const OPINION_STATES = ["POSITIVE", "NEUTRAL", "NEGATIVE"] as const;

export type OpinionState = (typeof OPINION_STATES)[number];

export const OPINION_STATE_LABEL: Record<OpinionState, string> = {
  POSITIVE: "선호해요",
  NEUTRAL: "가능해요",
  NEGATIVE: "불가능해요",
};

export const OPINION_CATEGORIES = [
  {
    key: "FNB",
    label: "F&B",
    majorCategoryId: "100000",
    middleCategories: [
      { categoryId: "101000", label: "식당" },
      { categoryId: "102000", label: "주점" },
    ],
  },
  {
    key: "DESSERT",
    label: "후식",
    majorCategoryId: "200000",
    middleCategories: [
      { categoryId: "201000", label: "카페" },
      { categoryId: "202000", label: "디저트" },
    ],
  },
  {
    key: "TOUR",
    label: "관광",
    majorCategoryId: "300000",
    middleCategories: [
      { categoryId: "301000", label: "관광명소" },
      { categoryId: "302000", label: "문화예술" },
      { categoryId: "303000", label: "공원" },
      { categoryId: "304000", label: "자연" },
      { categoryId: "305000", label: "종교시설" },
      { categoryId: "306000", label: "테마파크" },
      { categoryId: "307000", label: "관람" },
      { categoryId: "308000", label: "유흥" },
    ],
  },
  {
    key: "STAY",
    label: "숙소",
    majorCategoryId: "400000",
    middleCategories: [{ categoryId: "401000", label: "숙소" }],
  },
  {
    key: "SHOPPING",
    label: "쇼핑",
    majorCategoryId: "500000",
    middleCategories: [{ categoryId: "501000", label: "쇼핑" }],
  },
  {
    key: "GENERAL",
    label: "일반",
    majorCategoryId: "600000",
    middleCategories: [
      { categoryId: "901000", label: "액티비티" },
      { categoryId: "902000", label: "스파" },
      { categoryId: "903000", label: "교통" },
      { categoryId: "904000", label: "편의시설" },
      { categoryId: "905000", label: "기타" },
    ],
  },
] as const;

export type OpinionCategory = (typeof OPINION_CATEGORIES)[number];
export type OpinionCategoryKey = OpinionCategory["key"];

export type OpinionReason = {
  id: number;
  text: string;
};

export const OPINION_REASON_MAP: Record<
  OpinionCategoryKey,
  Record<OpinionState, OpinionReason[]>
> = {
  FNB: {
    POSITIVE: [
      { id: 1, text: "꼭 가보고 싶어요" },
      { id: 2, text: "시그니처 메뉴가 있대요" },
      { id: 3, text: "현지인 맛집이에요" },
      { id: 4, text: "리뷰 평점이 높아요" },
      { id: 5, text: "SNS에서 핫한 곳이에요" },
      { id: 6, text: "분위기가 좋아요" },
      { id: 7, text: "가성비가 좋대요" },
    ],
    NEUTRAL: [
      { id: 1, text: "이동 경로 내에 있다면 가능해요" },
      { id: 2, text: "간단한 식사라면 방문 가능해요" },
      { id: 3, text: "대기 시간이 짧으면 가능해요" },
      { id: 4, text: "호불호 없는 메뉴라면 가능해요" },
      { id: 5, text: "예산 범위 내라면 가능해요" },
      { id: 6, text: "일행이 원한다면 맞출 수 있어요" },
    ],
    NEGATIVE: [
      { id: 1, text: "입맛이 안 맞아요" },
      { id: 2, text: "가격이 너무 비싸요" },
      { id: 3, text: "위치가 너무 멀어요" },
      { id: 4, text: "대기가 길대요" },
      { id: 5, text: "알레르기/식이제한 있어요" },
      { id: 6, text: "영업시간이 안 맞아요" },
      { id: 7, text: "비위생적이라는 후기가 있어요" },
    ],
  },
  DESSERT: {
    POSITIVE: [
      { id: 1, text: "시그니처 메뉴가 있대요" },
      { id: 2, text: "분위기가 예뻐요" },
      { id: 3, text: "디저트가 유명해요" },
      { id: 4, text: "포토존이 있어요" },
      { id: 5, text: "현지 유명 카페에요" },
      { id: 6, text: "뷰가 좋대요" },
      { id: 7, text: "SNS에서 핫한 곳이에요" },
    ],
    NEUTRAL: [
      { id: 1, text: "이동 경로 내에 있다면 가능해요" },
      { id: 2, text: "쉬어간다면 가능해요" },
      { id: 3, text: "일정에 여유가 있다면 가능해요" },
      { id: 4, text: "포장 주문이라면 방문 가능해요" },
      { id: 5, text: "음료 가격이 합리적이면 가능해요" },
      { id: 6, text: "일행이 원한다면 맞출 수 있어요" },
    ],
    NEGATIVE: [
      { id: 1, text: "카페/디저트에 관심 없어요" },
      { id: 2, text: "가격이 너무 비싸요" },
      { id: 3, text: "위치가 너무 멀어요" },
      { id: 4, text: "대기가 길대요" },
      { id: 5, text: "자리가 없을 것 같아요" },
      { id: 6, text: "영업시간이 안 맞아요" },
      { id: 7, text: "비슷한 카페는 어디나 있어요" },
    ],
  },
  STAY: {
    POSITIVE: [
      { id: 1, text: "위치가 좋아요" },
      { id: 2, text: "가성비가 좋아요" },
      { id: 3, text: "리뷰가 좋아요" },
      { id: 4, text: "시설이 깨끗해요" },
      { id: 5, text: "조식이 포함돼요" },
      { id: 6, text: "주변 편의시설이 좋아요" },
      { id: 7, text: "특별한 숙소 경험이에요" },
    ],
    NEUTRAL: [
      { id: 1, text: "관광지와 가깝다면 숙박 가능해요" },
      { id: 2, text: "예산 범위 내라면 가능해요" },
      { id: 3, text: "대중교통 접근성이 좋으면 가능해요" },
      { id: 4, text: "1~2박 정도라면 가능해요" },
      { id: 5, text: "위생 상태만 좋다면 묵을 수 있어요" },
      { id: 6, text: "대안이 없을 땐 가능해요" },
      { id: 7, text: "일행이 원한다면 맞출 수 있어요" },
    ],
    NEGATIVE: [
      { id: 1, text: "예산 초과예요" },
      { id: 2, text: "위치가 너무 불편해요" },
      { id: 3, text: "리뷰가 안 좋아요" },
      { id: 4, text: "시설이 너무 낡았어요" },
      { id: 5, text: "주변이 안전하지 않대요" },
      { id: 6, text: "소음 문제가 있대요" },
      { id: 7, text: "취소/환불이 안 돼요" },
    ],
  },
  SHOPPING: {
    POSITIVE: [
      { id: 1, text: "여기서만 살 수 있어요" },
      { id: 2, text: "가격이 저렴해요" },
      { id: 3, text: "현지 특산물이 있어요" },
      { id: 4, text: "면세/할인 혜택이 있어요" },
      { id: 5, text: "구경만 해도 재미있어요" },
      { id: 6, text: "선물 사기 좋아요" },
      { id: 7, text: "분위기가 독특해요" },
    ],
    NEUTRAL: [
      { id: 1, text: "이동 경로 내에 있다면 가능해요" },
      { id: 2, text: "구경만 하는 거라면 가능해요" },
      { id: 3, text: "일정에 여유가 있다면 가능해요" },
      { id: 4, text: "살 게 확실히 있다면 방문 가능해요" },
      { id: 5, text: "가성비 좋은 곳이라면 가능해요" },
      { id: 6, text: "면세/할인 혜택이 있다면 가능해요" },
      { id: 7, text: "일행이 원한다면 맞출 수 있어요" },
    ],
    NEGATIVE: [
      { id: 1, text: "쇼핑에 관심 없어요" },
      { id: 2, text: "가격이 비싸요" },
      { id: 3, text: "짐이 너무 많아져요" },
      { id: 4, text: "위치가 너무 멀어요" },
      { id: 5, text: "시간이 아까워요" },
      { id: 6, text: "비슷한 매장은 어디나 있어요" },
      { id: 7, text: "혼잡할 것 같아요" },
    ],
  },
  TOUR: {
    POSITIVE: [
      { id: 1, text: "꼭 가봐야 할 곳이에요" },
      { id: 2, text: "대표 명소예요" },
      { id: 3, text: "사진 찍기 좋아요" },
      { id: 4, text: "여기서만 볼 수 있어요" },
      { id: 5, text: "경치/뷰가 좋대요" },
      { id: 6, text: "역사적 의미가 있어요" },
      { id: 7, text: "리뷰가 정말 좋아요" },
    ],
    NEUTRAL: [
      { id: 1, text: "이동 경로 내에 있다면 가능해요" },
      { id: 2, text: "짧게 둘러보는 코스라면 가능해요" },
      { id: 3, text: "일정에 여유가 있다면 가능해요" },
      { id: 4, text: "날씨가 좋을 때는 관람 가능해요" },
      { id: 5, text: "일행이 원한다면 맞출 수 있어요" },
      { id: 6, text: "많이 걷지 않는다면 가능해요" },
    ],
    NEGATIVE: [
      { id: 1, text: "관심 없는 분야예요" },
      { id: 2, text: "입장료가 너무 비싸요" },
      { id: 3, text: "이미 가본 곳이에요" },
      { id: 4, text: "대기 시간이 너무 길어요" },
      { id: 5, text: "체력적으로 어려워요" },
      { id: 6, text: "위치가 너무 멀어요" },
      { id: 7, text: "날씨/계절이 안 맞아요" },
    ],
  },
  GENERAL: {
    POSITIVE: [
      { id: 1, text: "꼭 가보고 싶어요" },
      { id: 2, text: "특별한 경험이에요" },
      { id: 3, text: "리뷰가 좋아요" },
      { id: 4, text: "현지에서만 할 수 있어요" },
      { id: 5, text: "동행자와 즐기기 좋아요" },
      { id: 6, text: "분위기가 좋대요" },
    ],
    NEUTRAL: [
      { id: 1, text: "이동 경로 내에 있다면 가능해요" },
      { id: 2, text: "일정에 여유가 있다면 가능해요" },
      { id: 3, text: "예산 범위 내라면 가능해요" },
      { id: 4, text: "일행이 원한다면 맞출 수 있어요" },
      { id: 5, text: "경험 삼아 한 번은 가능해요" },
      { id: 6, text: "체력적으로 괜찮다면 가능해요" },
    ],
    NEGATIVE: [
      { id: 1, text: "관심이 없어요" },
      { id: 2, text: "시간이 부족해요" },
      { id: 3, text: "가격이 너무 비싸요" },
      { id: 4, text: "위치가 너무 멀어요" },
      { id: 5, text: "굳이 여행에서 안 해도 돼요" },
      { id: 6, text: "더 좋은 대안이 있어요" },
    ],
  },
};

/** API BlockOpinion 스펙 타입 */
export type PlanAddedBy = {
  plan_member_id: string;
  nickname: string;
  picture: string;
};

export type BlockOpinion = {
  opinion_Id: string;
  type: OpinionState;
  comment: string;
  tag_ids: string[];
  added_by: PlanAddedBy;
};

/**
 * categoryKey + state + tagId 조합으로 태그 텍스트 조회
 * (카테고리×상태별로 같은 id가 다른 의미를 가질 수 있으므로 세 값 모두 필요)
 */
export const getTagText = (
  categoryKey: OpinionCategoryKey,
  state: OpinionState,
  tagId: string,
): string => {
  const reason = OPINION_REASON_MAP[categoryKey][state].find(
    (r) => String(r.id) === tagId,
  );
  return reason?.text ?? tagId;
};

export const OPINION_BOTTOM_SHEET_VARIANTS = OPINION_CATEGORIES.flatMap(
  (category) =>
    OPINION_STATES.map((state) => ({
      categoryKey: category.key,
      categoryLabel: category.label,
      majorCategoryId: category.majorCategoryId,
      state,
      stateLabel: OPINION_STATE_LABEL[state],
      reasons: OPINION_REASON_MAP[category.key][state],
    })),
);
