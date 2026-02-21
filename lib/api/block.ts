import {
  OPINION_REASON_MAP,
  type BlockOpinion as OpinionItem,
  type OpinionCategoryKey,
} from "@/lib/opinion-bottom-sheet"
import { apiClient } from "@/lib/api/client"

export type BlockOpinionType = "POSITIVE" | "NEUTRAL" | "NEGATIVE"

type PlanMember = {
  plan_member_id: string
  nickname: string
  picture: string
}

type BlockOpinionApi = {
  opinion_Id: string
  type: BlockOpinionType
  comment: string
  tag_ids: string[]
  added_by: PlanMember
}

type BlockDetailApiResponse = {
  time_block_id: string
  type: "PLACE" | "FREE"
  day_info: {
    day: number
    date: string
    dayOfWeek: string
  }
  start_time: string
  end_time: string
  opinions: BlockOpinionApi[]
  block: {
    block_id: string
    memo: string
    place: {
      place_id: string
      google_place_id: string
      name: string
      type: string
      address: string
      category: {
        level1: { category_id: string; name: string }
        level2: { category_id: string; name: string }
        level3: { category_id: string; name: string }
      }
      primary_type?: string | null
      google_maps_uri: string
      photos: string[]
      point: {
        latitude: number
        longitude: number
      }
    }
    selected: boolean
    added_by: PlanMember
    opinion_summary: {
      total_count: number
      distribution: {
        positive: number
        neutral: number
        negative: number
      }
      my?: {
        opinion_id: string
        type: BlockOpinionType
      }
    }
  }
  social_media: {
    social_media_id: string
    media_type: "YOUTUBE" | "YOUTUBE_SHORTS"
    url: string
    author_name: string
    title: string
    summary: string
  }
}

export type BlockDetail = {
  timeBlockId: string
  blockType: "PLACE" | "FREE"
  day: number
  date: string
  dayOfWeek: string
  startTime: string
  endTime: string
  blockId: string
  placeName: string
  category: string
  address: string
  googleMapsUri: string
  photoUrls: string[]
  latitude: number
  longitude: number
  memo: string
  aiSummary: string
  sourceTitle: string
  sourceUrl: string
  myPlanMemberId: string
  opinions: OpinionItem[]
  positiveCount: number
  neutralCount: number
  negativeCount: number
  positiveMembers: PlanMember[]
  negativeMembers: PlanMember[]
  myOpinion: BlockOpinionType | null
}

export type UpdateBlockOpinionRequest = {
  type: BlockOpinionType
  tag_ids: string[]
  comment?: string
}

export type UpdateBlockRequest = {
  day?: string
  start_time?: string
  end_time?: string
  memo?: string
}

const MOCK_BLOCK_DETAIL_STORE = new Map<string, BlockDetailApiResponse>()

const resolveOpinionCategoryKey = (category: string): OpinionCategoryKey => {
  if (category.includes("식당") || category.includes("주점")) return "FNB"
  if (category.includes("카페") || category.includes("디저트")) return "DESSERT"
  if (category.includes("숙소")) return "STAY"
  if (category.includes("쇼핑")) return "SHOPPING"
  if (
    category.includes("관광") ||
    category.includes("문화") ||
    category.includes("공원") ||
    category.includes("자연")
  ) {
    return "TOUR"
  }

  return "GENERAL"
}

const getTagIdsForMockOpinion = (
  categoryKey: OpinionCategoryKey,
  type: BlockOpinionType,
  count = 2,
) => {
  return OPINION_REASON_MAP[categoryKey][type]
    .slice(0, count)
    .map((reason) => String(reason.id))
}

const getMockBlockDetail = (planId: string, blockId: string): BlockDetailApiResponse => {
  const myPlanMemberId = "pm-me"
  const placeMiddleCategoryName = "카페"
  const opinionCategoryKey = resolveOpinionCategoryKey(placeMiddleCategoryName)

  const opinions: BlockOpinionApi[] = [
    {
      opinion_Id: "op-1",
      type: "POSITIVE",
      comment: "동선 좋고 분위기 좋아요.",
      tag_ids: getTagIdsForMockOpinion(opinionCategoryKey, "POSITIVE", 3),
      added_by: {
        plan_member_id: myPlanMemberId,
        nickname: "나",
        picture: "",
      },
    },
    {
      opinion_Id: "op-2",
      type: "NEGATIVE",
      comment: "대기 시간이 너무 길 수도 있어요.",
      tag_ids: getTagIdsForMockOpinion(opinionCategoryKey, "NEGATIVE", 3),
      added_by: {
        plan_member_id: "pm-2",
        nickname: "지훈",
        picture: "",
      },
    },
    {
      opinion_Id: "op-3",
      type: "NEUTRAL",
      comment: "동선만 맞으면 들러도 좋을 것 같아요.",
      tag_ids: getTagIdsForMockOpinion(opinionCategoryKey, "NEUTRAL", 3),
      added_by: {
        plan_member_id: "pm-3",
        nickname: "서연",
        picture: "",
      },
    },
  ]

  return {
    time_block_id: blockId,
    type: "PLACE",
    day_info: {
      day: 1,
      date: "2026-03-14",
      dayOfWeek: "SAT",
    },
    start_time: "12:00",
    end_time: "14:00",
    opinions,
    block: {
      block_id: `block-${blockId}`,
      memo: `플랜(${planId})의 블록 목데이터 메모입니다.`,
      place: {
        place_id: "place-101",
        google_place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
        name: "카페 오르빗",
        type: "NORMAL",
        address: "서울특별시 마포구 연남동 123-45",
        category: {
          level1: { category_id: "l1", name: "F&B" },
          level2: { category_id: "l2", name: placeMiddleCategoryName },
          level3: { category_id: "l3", name: "디저트 카페" },
        },
        primary_type: "cafe",
        google_maps_uri: "https://maps.google.com/?cid=1234567890123456789",
        photos: [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
        ],
        point: {
          latitude: 37.566535,
          longitude: 126.977969,
        },
      },
      selected: true,
      added_by: {
        plan_member_id: myPlanMemberId,
        nickname: "여행대장",
        picture: "",
      },
      opinion_summary: {
        total_count: 3,
        distribution: {
          positive: 1,
          neutral: 1,
          negative: 1,
        },
        my: {
          opinion_id: "op-1",
          type: "POSITIVE",
        },
      },
    },
    social_media: {
      social_media_id: "sm-1",
      media_type: "YOUTUBE",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      author_name: "상인 튜브",
      title: "파주 팡팡 맛집 투어",
      summary: "주차가 편하고, 대표 메뉴가 안정적으로 맛있다는 리뷰가 많습니다.",
    },
  }
}

const mockStoreKey = (planId: string, blockId: string) => `${planId}:${blockId}`

const getOrCreateMockBlockDetail = (planId: string, blockId: string) => {
  const key = mockStoreKey(planId, blockId)
  const existing = MOCK_BLOCK_DETAIL_STORE.get(key)
  if (existing) return existing

  const created = getMockBlockDetail(planId, blockId)
  MOCK_BLOCK_DETAIL_STORE.set(key, created)
  return created
}

const syncOpinionSummary = (data: BlockDetailApiResponse) => {
  const positive = data.opinions.filter((opinion) => opinion.type === "POSITIVE").length
  const neutral = data.opinions.filter((opinion) => opinion.type === "NEUTRAL").length
  const negative = data.opinions.filter((opinion) => opinion.type === "NEGATIVE").length
  const myPlanMemberId = data.block.added_by.plan_member_id
  const myOpinion = data.opinions.find((opinion) => opinion.added_by.plan_member_id === myPlanMemberId)

  data.block.opinion_summary = {
    total_count: data.opinions.length,
    distribution: {
      positive,
      neutral,
      negative,
    },
    ...(myOpinion
      ? {
          my: {
            opinion_id: myOpinion.opinion_Id,
            type: myOpinion.type,
          },
        }
      : {}),
  }
}

const dedupeMembers = (members: PlanMember[]) => {
  const unique = new Map<string, PlanMember>()
  for (const member of members) {
    if (!unique.has(member.plan_member_id)) {
      unique.set(member.plan_member_id, member)
    }
  }
  return Array.from(unique.values())
}

const normalizeBlockDetail = (data: BlockDetailApiResponse): BlockDetail => {
  const positiveMembers = dedupeMembers(
    data.opinions.filter((opinion) => opinion.type === "POSITIVE").map((opinion) => opinion.added_by),
  )
  const negativeMembers = dedupeMembers(
    data.opinions.filter((opinion) => opinion.type === "NEGATIVE").map((opinion) => opinion.added_by),
  )

  return {
    timeBlockId: data.time_block_id,
    blockType: data.type,
    day: data.day_info.day,
    date: data.day_info.date,
    dayOfWeek: data.day_info.dayOfWeek,
    startTime: data.start_time,
    endTime: data.end_time,
    blockId: data.block.block_id,
    placeName: data.block.place.name,
    category: data.block.place.category.level2.name,
    address: data.block.place.address,
    googleMapsUri: data.block.place.google_maps_uri,
    photoUrls: data.block.place.photos,
    latitude: data.block.place.point.latitude,
    longitude: data.block.place.point.longitude,
    memo: data.block.memo,
    aiSummary: data.social_media.summary,
    sourceTitle: `${data.social_media.author_name} - ${data.social_media.title}`,
    sourceUrl: data.social_media.url,
    myPlanMemberId: data.block.added_by.plan_member_id,
    opinions: data.opinions.map((opinion) => ({
      opinion_Id: opinion.opinion_Id,
      type: opinion.type,
      comment: opinion.comment,
      tag_ids: opinion.tag_ids,
      added_by: opinion.added_by,
    })),
    positiveCount: data.block.opinion_summary.distribution.positive,
    neutralCount: data.block.opinion_summary.distribution.neutral,
    negativeCount: data.block.opinion_summary.distribution.negative,
    positiveMembers,
    negativeMembers,
    myOpinion: data.block.opinion_summary.my?.type ?? null,
  }
}

export const getBlockDetail = async (planId: string, blockId: string): Promise<BlockDetail> => {
  const mockData = getOrCreateMockBlockDetail(planId, blockId)

  await new Promise((resolve) => setTimeout(resolve, 200))

  return normalizeBlockDetail(mockData)
}

export const updateBlock = async (
  planId: string,
  blockId: string,
  payload: UpdateBlockRequest,
): Promise<BlockDetail> => {
  const { data } = await apiClient.patch<BlockDetailApiResponse>(
    `/plans/${planId}/blocks/${blockId}`,
    payload,
  )

  return normalizeBlockDetail(data)
}

export const updateBlockOpinion = async (
  planId: string,
  blockId: string,
  opinionId: string,
  payload: UpdateBlockOpinionRequest,
): Promise<OpinionItem> => {
  const data = getOrCreateMockBlockDetail(planId, blockId)
  const targetIndex = data.opinions.findIndex((opinion) => opinion.opinion_Id === opinionId)

  if (targetIndex === -1) {
    throw new Error("Opinion not found")
  }

  const target = data.opinions[targetIndex]
  const updated: BlockOpinionApi = {
    ...target,
    type: payload.type,
    tag_ids: payload.tag_ids,
    comment: payload.comment ?? "",
  }

  data.opinions[targetIndex] = updated
  syncOpinionSummary(data)

  await new Promise((resolve) => setTimeout(resolve, 200))

  return {
    opinion_Id: updated.opinion_Id,
    type: updated.type,
    comment: updated.comment,
    tag_ids: updated.tag_ids,
    added_by: updated.added_by,
  }
}

export const deleteBlockOpinion = async (
  planId: string,
  blockId: string,
  opinionId: string,
): Promise<void> => {
  const data = getOrCreateMockBlockDetail(planId, blockId)
  const nextOpinions = data.opinions.filter((opinion) => opinion.opinion_Id !== opinionId)

  data.opinions = nextOpinions
  syncOpinionSummary(data)

  await new Promise((resolve) => setTimeout(resolve, 200))
}
