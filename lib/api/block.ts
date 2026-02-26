import { type BlockOpinion as OpinionItem } from "@/lib/opinion-bottom-sheet";
import { apiClient } from "@/lib/api/client";

export type BlockOpinionType = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type BlockStatus = "FIXED" | "PENDING" | "DIRECT";
export type TimeBlockType = "PLACE" | "FREE";

type PlanMember = {
  plan_member_id: string;
  nickname: string;
  picture: string;
};

type DayInfoApi = {
  day: number;
  date: string;
  day_of_week: string;
};

type PlaceCategoryApi = {
  level1: { category_id: string; name: string };
  level2: { category_id: string; name: string };
  level3: { category_id: string; name: string };
};

type PlaceApi = {
  place_id: string;
  google_place_id: string;
  name: string;
  address: string;
  category: PlaceCategoryApi;
  primary_type?: string | null;
  google_maps_uri: string;
  photos: string[];
  point: {
    latitude: number;
    longitude: number;
  };
};

type BlockOpinionSummaryApi = {
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

type CandidateApiResponse = {
  block_id: string;
  memo: string;
  place: PlaceApi | null;
  selected: boolean;
  added_by: PlanMember;
  opinion_summary: BlockOpinionSummaryApi;
};

type BlockListItemApiResponse = {
  time_block_id: string;
  type: TimeBlockType;
  block_status: BlockStatus;
  start_time: string;
  end_time: string;
  candidate_count: number;
  candidates: CandidateApiResponse[];
  selected_block: CandidateApiResponse;
};

type BlockListApiResponse = {
  // 스펙에 day_Info 로 내려옴(대문자 I)
  day_info: DayInfoApi;
  contents: BlockListItemApiResponse[];
  has_next: boolean;
  page: number;
  size: number;
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

export type Candidate = {
  blockId: string;
  memo: string;
  placeId: string;
  googlePlaceId: string;
  placeName: string;
  category: string;
  address: string;
  primaryType: string | null;
  googleMapsUri: string;
  photoUrls: string[];
  latitude: number;
  longitude: number;
  selected: boolean;
  addedBy: PlanMember;
  opinionSummary: {
    totalCount: number;
    positive: number;
    neutral: number;
    negative: number;
    myOpinionId: string | null;
    myOpinionType: BlockOpinionType | null;
  };
};

export type BlockListItem = {
  timeBlockId: string;
  type: TimeBlockType;
  blockStatus: BlockStatus;
  startTime: string;
  endTime: string;
  candidateCount: number;
  candidates: Candidate[];
  selectedBlock: Candidate | null;
};

export type BlockListResponse = {
  day: number;
  date: string;
  dayOfWeek: string;
  contents: BlockListItem[];
  hasNext: boolean;
  size: number;
  page: number;
};

export type GetBlockListParams = {
  day: number;
  page?: number;
  size?: number;
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
  myOpinionId: string | null;
  myPlanMemberId: string;
  opinions: OpinionItem[];
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positiveMembers: PlanMember[];
  negativeMembers: PlanMember[];
  myOpinion: BlockOpinionType | null;
};

export type CreateBlockOpinionRequest = {
  type: BlockOpinionType;
  tag_ids?: string[];
  comment?: string;
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

const normalizeCandidate = (c: CandidateApiResponse): Candidate => {
  const place = c.place;

  return {
    blockId: c.block_id,
    memo: c.memo ?? "",
    placeId: place?.place_id ?? "",
    googlePlaceId: place?.google_place_id ?? "",
    placeName: place?.name ?? "",
    category: place?.category?.level2?.name ?? "",
    address: place?.address ?? "",
    primaryType: place?.primary_type ?? null,
    googleMapsUri: place?.google_maps_uri ?? "",
    photoUrls: place?.photos ?? [],
    latitude: place?.point?.latitude ?? 0,
    longitude: place?.point?.longitude ?? 0,
    selected: Boolean(c.selected),
    addedBy: c.added_by,
    opinionSummary: {
      totalCount: c.opinion_summary?.total_count ?? 0,
      positive: c.opinion_summary?.distribution?.positive ?? 0,
      neutral: c.opinion_summary?.distribution?.neutral ?? 0,
      negative: c.opinion_summary?.distribution?.negative ?? 0,
      myOpinionId: c.opinion_summary?.my?.opinion_id ?? null,
      myOpinionType: c.opinion_summary?.my?.type ?? null,
    },
  };
};

const normalizeBlockList = (data: BlockListApiResponse): BlockListResponse => {
  const dayInfo = data.day_info;

  return {
    day: dayInfo.day,
    date: dayInfo.date,
    dayOfWeek: dayInfo.day_of_week,
    contents: (data.contents ?? []).map((item) => ({
      timeBlockId: item.time_block_id,
      type: item.type,
      blockStatus: item.block_status,
      startTime: item.start_time,
      endTime: item.end_time,
      candidateCount: item.candidate_count ?? 0,
      candidates: (item.candidates ?? []).map(normalizeCandidate),
      selectedBlock: item.selected_block
        ? normalizeCandidate(item.selected_block)
        : null,
    })),
    hasNext: Boolean(data.has_next),
    size: data.size,
    page: data.page,
  };
};

const normalizeBlockDetail = (data: BlockDetailApiResponse): BlockDetail => {
  const place = data.block.place;
  const opinions: OpinionItem[] = data.opinions.map((opinion) => ({
    opinion_Id: opinion.opinion_id,
    type: opinion.type,
    comment: opinion.comment,
    tag_ids: opinion.tag_ids,
    added_by: opinion.added_by,
  }));
  const myOpinionId = data.block.opinion_summary.my?.opinion_id ?? null;
  const myOpinionItem = myOpinionId
    ? opinions.find((opinion) => opinion.opinion_Id === myOpinionId)
    : null;

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
    myOpinionId,
    myPlanMemberId: myOpinionItem?.added_by.plan_member_id ?? "",
    opinions,
    positiveCount: data.block.opinion_summary.distribution.positive,
    neutralCount: data.block.opinion_summary.distribution.neutral,
    negativeCount: data.block.opinion_summary.distribution.negative,
    positiveMembers,
    negativeMembers,
    myOpinion: data.block.opinion_summary.my?.type ?? null,
  };
};

export const getBlockList = async (
  planId: string,
  params: GetBlockListParams,
): Promise<BlockListResponse> => {
  const { data } = await apiClient.get<BlockListApiResponse>(
    `/plans/${planId}/blocks`,
    { params },
  );

  return normalizeBlockList(data);
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

export const createBlockOpinion = async (
  planId: string,
  blockId: string,
  payload: CreateBlockOpinionRequest,
): Promise<OpinionItem> => {
  const { data } = await apiClient.post<BlockOpinionApi>(
    `/plans/${planId}/blocks/${blockId}/opinions`,
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

export const deleteTimeBlock = async (
  planId: string,
  timeBlockId: string,
): Promise<void> => {
  await apiClient.delete(`/plans/${planId}/blocks/${timeBlockId}`);
};

export const deleteCandidate = async (
  planId: string,
  timeBlockId: string,
  blockId: string,
): Promise<void> => {
  await apiClient.delete(
    `/plans/${planId}/blocks/${timeBlockId}/candidates/${blockId}`,
  );
};
