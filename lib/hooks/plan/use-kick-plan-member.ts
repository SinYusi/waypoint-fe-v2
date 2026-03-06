"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { kickPlanMember } from "@/lib/api/plan";
import type { ProblemDetail } from "@/types/problem-detail";

type Variables = { planId: string; memberId: string };

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useKickPlanMember = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ planId, memberId }) => kickPlanMember(planId, memberId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["planMembers", { planId: variables.planId }],
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
