"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import { deleteExpense } from "@/lib/api/budget";

type Variables = {
  expenseId: string;
};

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useDeleteExpense = (planId: string, options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ expenseId }) => deleteExpense(planId, expenseId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", { planId }] });
      queryClient.invalidateQueries({ queryKey: ["budget", { planId }] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
