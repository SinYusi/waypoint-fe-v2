"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import type { AddExpenseRequest, ExpenseGroupResponse } from "@/types/budget";
import { addExpense } from "@/lib/api/budget";

type Options = Omit<
  UseMutationOptions<ExpenseGroupResponse, AxiosError<ProblemDetail>, AddExpenseRequest>,
  "mutationFn"
>;

export const useAddExpense = (planId: string, options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<ExpenseGroupResponse, AxiosError<ProblemDetail>, AddExpenseRequest>({
    mutationFn: (body) => addExpense(planId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", { planId }] });
      queryClient.invalidateQueries({ queryKey: ["budget", { planId }] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
