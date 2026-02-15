"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  CollectionResponse,
  GetCollectionParams,
} from "@/types/collection";
import { getCollection } from "@/lib/api/collection";
import type { ProblemDetail } from "@/types/problem-detail";

type CollectionQueryKey = readonly ["collection", { collectionId: string }];

type Options = Omit<
  UseQueryOptions<
    CollectionResponse,
    AxiosError<ProblemDetail>,
    CollectionResponse,
    CollectionQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const useCollection = (
  collectionId: GetCollectionParams["collectionId"],
  options?: Options,
) => {
  return useQuery<
    CollectionResponse,
    AxiosError<ProblemDetail>,
    CollectionResponse,
    CollectionQueryKey
  >({
    queryKey: ["collection", { collectionId }] as const,
    queryFn: () => getCollection(collectionId),
    enabled: !!collectionId,
    ...options,
  });
};
