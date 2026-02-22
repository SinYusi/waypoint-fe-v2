import { type BlockOpinion as OpinionItem } from "@/lib/opinion-bottom-sheet";
import { apiClient } from "@/lib/api/client";

export type BlockOpinionType = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

type PlanMember = {
  plan_member_id: string;
  nickname: string;
  picture: string;
};

type BlockOpinionApi = {
  opinion_id: string;
  type: BlockOpinionType;
  comment: string;
  tag_ids: string[];
  added_by: PlanMember;
};

type BlockDetailApiResponse = {
  time_block_id: string;
  type: "PLACE" | "FREE";
  day_info: {
    day: number;
    date: string;
    day_of_week: string;
  };
  start_time: string;
  end_time: string;
  opinions: BlockOpinionApi[];
  block: {
    block_id: string;
    memo: string;
    place: {
      place_id: string;
      google_place_id: string;
      name: string;
      type: string;
      address: string;
      category: {
        level1: { category_id: string; name: string };
        level2: { category_id: string; name: string };
        level3: { category_id: string; name: string };
      };
      primary_type?: string | null;
      google_maps_uri: string;
      photos: string[];
      point: {
        latitude: number;
        longitude: number;
      };
    };
    selected: boolean;
    added_by: PlanMember;
    opinion_summary: {
      total_count: number;
      distribution: {
        positive: number;
        neutral: number;
        negative: number;
      };
      my?: {
        opinion_id: string;
        type: BlockOpinionType;
      };
    };
  };
  social_media?: {
    social_media_id: string;
    media_type: "YOUTUBE" | "YOUTUBE_SHORTS";
    url: string;
    author_name: string;
    title: string;
    summary: string;
  };
};

export type BlockDetail = {
  timeBlockId: string;
  blockType: "PLACE" | "FREE";
  day: number;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  blockId: string;
  placeName: string;
  category: string;
  address: string;
  googleMapsUri: string;
  photoUrls: string[];
  latitude: number;
  longitude: number;
  memo: string;
  aiSummary: string;
  sourceTitle: string;
  sourceUrl: string;
  myPlanMemberId: string;
  opinions: OpinionItem[];
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positiveMembers: PlanMember[];
  negativeMembers: PlanMember[];
  myOpinion: BlockOpinionType | null;
};

export type UpdateBlockOpinionRequest = {
  type: BlockOpinionType;
  tag_ids: string[];
  comment?: string;
};

export type UpdateBlockRequest = {
  day?: string;
  start_time?: string;
  end_time?: string;
  memo?: string;
};

const dedupeMembers = (members: PlanMember[]) => {
  const unique = new Map<string, PlanMember>();
  for (const member of members) {
    if (!unique.has(member.plan_member_id)) {
      unique.set(member.plan_member_id, member);
    }
  }
  return Array.from(unique.values());
};

const normalizeBlockDetail = (data: BlockDetailApiResponse): BlockDetail => {
  const place = data.block.place;

  const positiveMembers = dedupeMembers(
    data.opinions
      .filter((opinion) => opinion.type === "POSITIVE")
      .map((opinion) => opinion.added_by),
  );
  const negativeMembers = dedupeMembers(
    data.opinions
      .filter((opinion) => opinion.type === "NEGATIVE")
      .map((opinion) => opinion.added_by),
  );

  return {
    timeBlockId: data.time_block_id,
    blockType: data.type,
    day: data.day_info.day,
    date: data.day_info.date,
    dayOfWeek: data.day_info.day_of_week,
    startTime: data.start_time,
    endTime: data.end_time,
    blockId: data.block.block_id,
    placeName: place?.name ?? "",
    category: place?.category?.level2?.name ?? "",
    address: place?.address ?? "",
    googleMapsUri: place?.google_maps_uri ?? "",
    photoUrls: place?.photos ?? [],
    latitude: place?.point?.latitude ?? 0,
    longitude: place?.point?.longitude ?? 0,
    memo: data.block.memo ?? "",
    aiSummary: data.social_media?.summary ?? "",
    sourceTitle: data.social_media
      ? `${data.social_media.author_name} - ${data.social_media.title}`
      : "",
    sourceUrl: data.social_media?.url ?? "",
    myPlanMemberId: data.block.added_by.plan_member_id,
    opinions: data.opinions.map((opinion) => ({
      opinion_Id: opinion.opinion_id,
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
  };
};

export const getBlockDetail = async (
  planId: string,
  blockId: string,
): Promise<BlockDetail> => {
  const { data } = await apiClient.get<BlockDetailApiResponse>(
    `/plans/${planId}/blocks/${blockId}`,
  );

  return normalizeBlockDetail(data);
};

export const updateBlock = async (
  planId: string,
  blockId: string,
  payload: UpdateBlockRequest,
): Promise<BlockDetail> => {
  const { data } = await apiClient.patch<BlockDetailApiResponse>(
    `/plans/${planId}/blocks/${blockId}`,
    payload,
  );

  return normalizeBlockDetail(data);
};

export const updateBlockOpinion = async (
  planId: string,
  blockId: string,
  opinionId: string,
  payload: UpdateBlockOpinionRequest,
): Promise<OpinionItem> => {
  const { data } = await apiClient.put<BlockOpinionApi>(
    `/plans/${planId}/blocks/${blockId}/opinions/${opinionId}`,
    payload,
  );

  return {
    opinion_Id: data.opinion_id,
    type: data.type,
    comment: data.comment,
    tag_ids: data.tag_ids,
    added_by: data.added_by,
  };
};

export const deleteBlockOpinion = async (
  planId: string,
  blockId: string,
  opinionId: string,
): Promise<void> => {
  await apiClient.delete(
    `/plans/${planId}/blocks/${blockId}/opinions/${opinionId}`,
  );
};
