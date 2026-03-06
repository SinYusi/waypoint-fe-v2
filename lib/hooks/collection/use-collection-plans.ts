"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { CollectionPlansResponse } from "@/types/collection";
import { getCollectionPlans } from "@/lib/api/collection";
import type { ProblemDetail } from "@/types/problem-detail";

type CollectionPlansQueryKey = readonly [
  "collectionPlans",
  { collectionId: string },
];

type Options = Omit<
  UseQueryOptions<
    CollectionPlansResponse,
    AxiosError<ProblemDetail>,
    CollectionPlansResponse,
    CollectionPlansQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const useCollectionPlans = (collectionId: string, options?: Options) => {
  return useQuery<
    CollectionPlansResponse,
    AxiosError<ProblemDetail>,
    CollectionPlansResponse,
    CollectionPlansQueryKey
  >({
    queryKey: ["collectionPlans", { collectionId }] as const,
    queryFn: () => getCollectionPlans(collectionId),
    enabled: !!collectionId,
    ...options,
  });
};
