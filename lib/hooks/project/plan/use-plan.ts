"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import type { GetPlanParams, PlanResponse } from "@/types/plan";
import { getPlan } from "@/lib/api/plan";

type PlanQueryKey = readonly ["plan", { planId: string }];

type Options = Omit<
  UseQueryOptions<
    PlanResponse,
    AxiosError<ProblemDetail>,
    PlanResponse,
    PlanQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const usePlan = (planId: GetPlanParams["planId"], options?: Options) => {
  return useQuery<
    PlanResponse,
    AxiosError<ProblemDetail>,
    PlanResponse,
    PlanQueryKey
  >({
    queryKey: ["plan", { planId }] as const,
    queryFn: () => getPlan(planId),
    enabled: !!planId,
    ...options,
  });
};
