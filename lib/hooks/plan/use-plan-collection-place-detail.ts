"use client";

import { getPlanCollectionPlaceDetail } from "@/lib/api/plan";
import type { PlaceDetail } from "@/lib/api/place";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const planCollectionPlaceDetailQueryKey = (
  planId: string,
  collectionId: string,
  collectionPlaceId: string,
) => ["plan-collection-place-detail", planId, collectionId, collectionPlaceId] as const;

type UsePlanCollectionPlaceDetailOptions = {
  planId?: string;
  collectionId?: string;
  collectionPlaceId?: string;
  enabled?: boolean;
  queryOptions?: Omit<
    UseQueryOptions<PlaceDetail, AxiosError>,
    "queryKey" | "queryFn" | "enabled"
  >;
};

export const usePlanCollectionPlaceDetail = (
  options: UsePlanCollectionPlaceDetailOptions,
) => {
  const { planId, collectionId, collectionPlaceId, enabled = true, queryOptions } = options;
  const canFetch = Boolean(planId && collectionId && collectionPlaceId && enabled);

  return useQuery<PlaceDetail, AxiosError>({
    queryKey: planCollectionPlaceDetailQueryKey(
      planId ?? "",
      collectionId ?? "",
      collectionPlaceId ?? "",
    ),
    queryFn: () => getPlanCollectionPlaceDetail(planId!, collectionId!, collectionPlaceId!),
    enabled: canFetch,
    ...queryOptions,
  });
};
