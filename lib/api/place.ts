import { apiClient } from "@/lib/api/client";
import { resolveMiddleCategory } from "@/lib/place-category";
import type { PlaceSearchItem } from "@/types/place";
export type { PlaceSearchItem } from "@/types/place";

export const searchPlaces = async (
  query: string,
): Promise<PlaceSearchItem[]> => {
  const { data } = await apiClient.get<PlaceSearchItem[]>("/places/search", {
    params: { query },
  });
  return data;
};

type PlaceCategoryLevelApiResponse = {
  category_id: string;
  name: string;
};

type CollectionMemberApiResponse = {
  collection_member_id: string;
  nickname?: string;
  picture?: string;
  role?: "OWNER" | "MEMBER";
};

export type PlaceDetailApiResponse = {
  collection_place_id: string;
  memo: string | null;
  place: {
    place_id: string;
    google_place_id: string;
    name: string;
    address: string;
    category:
      | string
      | {
          level1?: PlaceCategoryLevelApiResponse;
          level2?: PlaceCategoryLevelApiResponse;
          level3?: PlaceCategoryLevelApiResponse;
        };
    primary_type?: string | null;
    google_maps_uri: string;
    photos: string[];
    point: {
      latitude: number | string;
      longitude: number | string;
    };
  };
  social_media?: {
    social_media_id: string;
    media_type: "YOUTUBE" | "YOUTUBE_SHORTS";
    url: string;
    author_name: string;
    title: string;
    summary: string;
  } | null;
  pick_pass?: {
    picked: {
      members?: CollectionMemberApiResponse[];
      count: number;
    };
    passed: {
      members?: CollectionMemberApiResponse[];
      count: number;
    };
    my_preference?: string | null;
  } | null;
};

export type PlaceDetail = {
  collectionPlaceId: string;
  placeId: string;
  googlePlaceId: string;
  name: string;
  category: string;
  address: string;
  googleMapsUri: string;
  photoUrls: string[];
  latitude: number;
  longitude: number;
  memo: string;
  aiSummary: string;
  externalUrl: string;
  sourceTitle: string;
  sourceUrl: string;
  pickCount: number;
  passCount: number;
  pickedMembers: CollectionMemberApiResponse[];
  passedMembers: CollectionMemberApiResponse[];
  myPreference: MyPreference;
};

export type UpdatePlaceMemoRequest = {
  memo: string;
};

type PickPassApiResponse = {
  picked: {
    members: CollectionMemberApiResponse[];
    count: number;
  };
  passed: {
    members: CollectionMemberApiResponse[];
    count: number;
  };
  my_preference?: string | null;
};

export type PlacePreferenceType = "PICK" | "PASS";
export type MyPreference = PlacePreferenceType | null;

export type UpdatePlacePreferenceRequest = {
  type: PlacePreferenceType;
};

export type PickPassResponse = {
  pickCount: number;
  passCount: number;
  pickedMembers: CollectionMemberApiResponse[];
  passedMembers: CollectionMemberApiResponse[];
  myPreference: MyPreference;
};

const normalizeMyPreference = (value?: string | null): MyPreference => {
  const trimmedValue = typeof value === "string" ? value.trim() : value;
  if (trimmedValue === "PICK" || trimmedValue === "PASS") {
    return trimmedValue;
  }
  return null;
};

export const normalizePlaceDetail = (data: PlaceDetailApiResponse): PlaceDetail => {
  const category =
    typeof data.place.category === "string"
      ? resolveMiddleCategory(data.place.category)
      : data.place.category?.level2?.name ||
        data.place.category?.level3?.name ||
        data.place.category?.level1?.name ||
        "";

  const sourceTitle = data.social_media
    ? `${data.social_media.author_name} - ${data.social_media.title}`
    : "";

  return {
    collectionPlaceId: data.collection_place_id,
    placeId: data.place.place_id,
    googlePlaceId: data.place.google_place_id,
    name: data.place.name,
    category,
    address: data.place.address,
    googleMapsUri: data.place.google_maps_uri,
    photoUrls: data.place.photos,
    latitude: Number(data.place.point.latitude),
    longitude: Number(data.place.point.longitude),
    memo: data.memo ?? "",
    aiSummary: data.social_media?.summary ?? "",
    externalUrl: data.place.google_maps_uri,
    sourceTitle,
    sourceUrl: data.social_media?.url ?? "",
    pickCount: data.pick_pass?.picked.count ?? 0,
    passCount: data.pick_pass?.passed.count ?? 0,
    pickedMembers: data.pick_pass?.picked.members ?? [],
    passedMembers: data.pick_pass?.passed.members ?? [],
    myPreference: normalizeMyPreference(data.pick_pass?.my_preference),
  };
};

const normalizePickPassResponse = (
  data: PickPassApiResponse,
): PickPassResponse => {
  return {
    pickCount: data.picked.count,
    passCount: data.passed.count,
    pickedMembers: data.picked.members ?? [],
    passedMembers: data.passed.members ?? [],
    myPreference: normalizeMyPreference(data.my_preference),
  };
};

export const getPlaceDetail = async (
  collectionId: string,
  collectionPlaceId: string,
) => {
  const { data } = await apiClient.get<PlaceDetailApiResponse>(
    `/collections/${collectionId}/places/${collectionPlaceId}`,
  );
  return normalizePlaceDetail(data);
};

export const updatePlaceMemo = async (
  collectionId: string,
  collectionPlaceId: string,
  payload: UpdatePlaceMemoRequest,
) => {
  await apiClient.patch<void>(
    `/collections/${collectionId}/places/${collectionPlaceId}/memo`,
    payload,
  );
};

export const updatePlacePreference = async (
  collectionId: string,
  collectionPlaceId: string,
  payload: UpdatePlacePreferenceRequest,
) => {
  const { data } = await apiClient.post<PickPassApiResponse>(
    `/collections/${collectionId}/places/${collectionPlaceId}/preference`,
    null,
    {
      params: {
        type: payload.type,
      },
    },
  );

  return normalizePickPassResponse(data);
};
