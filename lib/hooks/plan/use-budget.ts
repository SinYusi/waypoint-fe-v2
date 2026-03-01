"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import type { BudgetResponse, GetBudgetParams } from "@/types/budget";
import { getBudget } from "@/lib/api/budget";

type BudgetQueryKey = readonly ["budget", { planId: string }];

type Options = Omit<
  UseQueryOptions<
    BudgetResponse,
    AxiosError<ProblemDetail>,
    BudgetResponse,
    BudgetQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const useBudget = (planId: GetBudgetParams["planId"], options?: Options) => {
  return useQuery<
    BudgetResponse,
    AxiosError<ProblemDetail>,
    BudgetResponse,
    BudgetQueryKey
  >({
    queryKey: ["budget", { planId }] as const,
    queryFn: () => getBudget(planId),
    enabled: !!planId,
    ...options,
  });
};
