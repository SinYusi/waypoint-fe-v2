"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { leavePlan } from "@/lib/api/plan";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, string>,
  "mutationFn"
>;

export const useLeavePlan = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, string>({
    mutationFn: leavePlan,
    ...options,
    onSuccess: (data, planId, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["planMembers", { planId }] });
      options?.onSuccess?.(data, planId, onMutateResult, context);
    },
  });
};
