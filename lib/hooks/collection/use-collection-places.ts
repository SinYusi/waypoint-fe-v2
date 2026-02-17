"use client";

import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  CollectionPlacesResponse,
  GetCollectionPlacesParams,
} from "@/types/collection";
import { getCollectionPlaces } from "@/lib/api/collection";
import type { ProblemDetail } from "@/types/problem-detail";

type CollectionPlacesQueryKey = readonly [
  "collectionPlaces",
  {
    collectionId: string;
    size: number;
    sort?: "LATEST" | "OLDEST";
    added_by?: string;
  },
];

type Options = Omit<
  UseInfiniteQueryOptions<
    CollectionPlacesResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<CollectionPlacesResponse, number>,
    CollectionPlacesQueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const useCollectionPlaces = (
  collectionId: GetCollectionPlacesParams["collectionId"],
  params?: Omit<GetCollectionPlacesParams, "collectionId" | "page">,
  options?: Options,
) => {
  const size = params?.size ?? 10;
  const sort = params?.sort;
  const added_by = params?.added_by;

  return useInfiniteQuery<
    CollectionPlacesResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<CollectionPlacesResponse, number>,
    CollectionPlacesQueryKey,
    number
  >({
    queryKey: ["collectionPlaces", { collectionId, size, sort, added_by }] as const,
    queryFn: ({ pageParam = 0 }) =>
      getCollectionPlaces(collectionId, { page: pageParam, size, sort, added_by }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    enabled: !!collectionId,
    ...options,
  });
};
