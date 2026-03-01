"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import type { ExpenseResponse, UpdateExpenseRequest } from "@/types/budget";
import { updateExpense } from "@/lib/api/budget";

type Variables = {
  expenseId: string;
  items: UpdateExpenseRequest;
};

type Options = Omit<
  UseMutationOptions<ExpenseResponse, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useUpdateExpense = (planId: string, options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<ExpenseResponse, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ expenseId, items }) => updateExpense(planId, expenseId, items),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", { planId }] });
      queryClient.invalidateQueries({ queryKey: ["budget", { planId }] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
