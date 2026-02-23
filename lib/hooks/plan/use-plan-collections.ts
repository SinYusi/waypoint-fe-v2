"use client";

import { getPlanCollections } from "@/lib/api/plan";
import { ProblemDetail } from "@/types/problem-detail";
import { PlanCollectionResponse } from "@/types/plan";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type PlanCollectionsQueryKey = readonly ["plan-collections", { planId: string }];

type Options = Omit<
  UseQueryOptions<
    PlanCollectionResponse[],
    AxiosError<ProblemDetail>,
    PlanCollectionResponse[],
    PlanCollectionsQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const usePlanCollections = (planId: string, options?: Options) => {
  return useQuery<
    PlanCollectionResponse[],
    AxiosError<ProblemDetail>,
    PlanCollectionResponse[],
    PlanCollectionsQueryKey
  >({
    queryKey: ["plan-collections", { planId }] as const,
    queryFn: () => getPlanCollections(planId),
    enabled: !!planId,
    ...options,
  });
};
