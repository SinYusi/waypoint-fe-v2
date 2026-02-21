"use client";

import { getPlanCollectionPlaces } from "@/lib/api/plan";
import type { CollectionPlacesResponse } from "@/types/collection";
import type { ProblemDetail } from "@/types/problem-detail";
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

type PlanCollectionPlacesQueryKey = readonly [
  "planCollectionPlaces",
  {
    planId: string;
    collectionId: string;
    size: number;
  },
];

type Options = Omit<
  UseInfiniteQueryOptions<
    CollectionPlacesResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<CollectionPlacesResponse, number>,
    PlanCollectionPlacesQueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const usePlanCollectionPlaces = (
  planId: string,
  collectionId: string,
  params?: {
    size?: number;
  },
  options?: Options,
) => {
  const size = params?.size ?? 10;

  return useInfiniteQuery<
    CollectionPlacesResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<CollectionPlacesResponse, number>,
    PlanCollectionPlacesQueryKey,
    number
  >({
    queryKey: ["planCollectionPlaces", { planId, collectionId, size }] as const,
    queryFn: ({ pageParam = 0 }) =>
      getPlanCollectionPlaces(planId, collectionId, {
        page: pageParam,
        size,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    enabled: !!planId && !!collectionId,
    ...options,
  });
};
