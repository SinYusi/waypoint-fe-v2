"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { selectCandidate } from "@/lib/api/plan";
import type { ProblemDetail } from "@/types/problem-detail";

type Variables = { planId: string; timeBlockId: string; blockId: string };

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useSelectCandidate = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ planId, timeBlockId, blockId }) =>
      selectCandidate(planId, timeBlockId, blockId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["candidates", { planId: variables.planId, timeBlockId: variables.timeBlockId }],
      });
      queryClient.invalidateQueries({ queryKey: ["blocks", { planId: variables.planId }] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
