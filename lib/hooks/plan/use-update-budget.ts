"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import type { BudgetResponse, UpdateBudgetRequest } from "@/types/budget";
import { updateBudget } from "@/lib/api/budget";

type Options = Omit<
  UseMutationOptions<BudgetResponse, AxiosError<ProblemDetail>, UpdateBudgetRequest>,
  "mutationFn"
>;

export const useUpdateBudget = (planId: string, options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<BudgetResponse, AxiosError<ProblemDetail>, UpdateBudgetRequest>({
    mutationFn: (body) => updateBudget(planId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["budget", { planId }] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
