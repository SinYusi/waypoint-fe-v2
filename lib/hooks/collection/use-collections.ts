"use client";

import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  CollectionListResponse,
  GetCollectionsParams,
} from "@/types/collection";
import { getCollections } from "@/lib/api/collection";
import { ProblemDetail } from "@/types/problem-detail";

type CollectionsQueryKey = readonly ["collections", { size: number }];

type Options = Omit<
  UseInfiniteQueryOptions<
    CollectionListResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<CollectionListResponse, number>,
    CollectionsQueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const useCollections = (
  params?: Omit<GetCollectionsParams, "page">,
  options?: Options,
) => {
  const size = params?.size ?? 10;

  return useInfiniteQuery<
    CollectionListResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<CollectionListResponse, number>,
    CollectionsQueryKey,
    number
  >({
    queryKey: ["collections", { size }] as const,
    queryFn: ({ pageParam = 0 }) => getCollections({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    ...options,
  });
};
