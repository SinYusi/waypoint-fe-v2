"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { PlanMembersResponse } from "@/types/member";
import { getPlanMembers } from "@/lib/api/plan";
import type { ProblemDetail } from "@/types/problem-detail";

type PlanMembersQueryKey = readonly ["planMembers", { planId: string }];

type Options = Omit<
  UseQueryOptions<
    PlanMembersResponse,
    AxiosError<ProblemDetail>,
    PlanMembersResponse,
    PlanMembersQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const usePlanMembers = (planId: string, options?: Options) => {
  return useQuery<
    PlanMembersResponse,
    AxiosError<ProblemDetail>,
    PlanMembersResponse,
    PlanMembersQueryKey
  >({
    queryKey: ["planMembers", { planId }] as const,
    queryFn: () => getPlanMembers(planId),
    enabled: !!planId,
    ...options,
  });
};
