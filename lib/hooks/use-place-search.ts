"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { PlaceSearchItem } from "@/lib/api/place";
import { searchPlaces } from "@/lib/api/place";
import type { ProblemDetail } from "@/types/problem-detail";

type PlaceSearchQueryKey = readonly ["place-search", { query: string }];

type Options = Omit<
  UseQueryOptions<
    PlaceSearchItem[],
    AxiosError<ProblemDetail>,
    PlaceSearchItem[],
    PlaceSearchQueryKey
  >,
  "queryKey" | "queryFn" | "enabled"
>;

export const usePlaceSearch = (query: string, options?: Options) => {
  return useQuery<
    PlaceSearchItem[],
    AxiosError<ProblemDetail>,
    PlaceSearchItem[],
    PlaceSearchQueryKey
  >({
    queryKey: ["place-search", { query }] as const,
    queryFn: () => searchPlaces(query),
    enabled: query.length >= 2,
    ...options,
  });
};
