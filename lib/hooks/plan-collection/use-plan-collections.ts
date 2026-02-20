"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  GetPlanCollectionParams,
  GetPlanCollectionsResponse,
} from "@/types/plan-collection";
import type { ProblemDetail } from "@/types/problem-detail";
import { getPlanCollections } from "@/lib/api/plan-collection";

type PlanCollectionsQueryKey = readonly [
  "plan-collections",
  { planId: string },
];

type Options = Omit<
  UseQueryOptions<
    GetPlanCollectionsResponse,
    AxiosError<ProblemDetail>,
    GetPlanCollectionsResponse,
    PlanCollectionsQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const usePlanCollections = (
  planId: GetPlanCollectionParams["planId"],
  options?: Options,
) => {
  return useQuery<
    GetPlanCollectionsResponse,
    AxiosError<ProblemDetail>,
    GetPlanCollectionsResponse,
    PlanCollectionsQueryKey
  >({
    queryKey: ["plan-collections", { planId }] as const,
    queryFn: () => getPlanCollections(planId),
    enabled: !!planId,
    ...options,
  });
};
