"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import type { ExpenseGroupResponse, GetExpensesParams } from "@/types/budget";
import { getExpenses } from "@/lib/api/budget";

type ExpensesQueryKey = readonly ["expenses", { planId: string; day?: number }];

type Options = Omit<
  UseQueryOptions<
    ExpenseGroupResponse[],
    AxiosError<ProblemDetail>,
    ExpenseGroupResponse[],
    ExpensesQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const useExpenses = (
  planId: GetExpensesParams["planId"],
  day?: GetExpensesParams["day"],
  options?: Options,
) => {
  return useQuery<
    ExpenseGroupResponse[],
    AxiosError<ProblemDetail>,
    ExpenseGroupResponse[],
    ExpensesQueryKey
  >({
    queryKey: ["expenses", { planId, day }] as const,
    queryFn: () => getExpenses(planId, day),
    enabled: !!planId,
    ...options,
  });
};
