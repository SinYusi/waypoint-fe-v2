"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  UpdatePlanParams,
  UpdatePlanRequest,
  UpdatePlanResponse,
} from "@/types/plan";
import { updatePlan } from "@/lib/api/plan";
import type { ProblemDetail } from "@/types/problem-detail";

type Variables = {
  planId: UpdatePlanParams["planId"];
  body: UpdatePlanRequest;
};

type Options = Omit<
  UseMutationOptions<UpdatePlanResponse, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useUpdatePlan = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePlanResponse, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ planId, body }) => updatePlan(planId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(
        ["plan", { planId: variables.planId }],
        data.plan,
      );

      queryClient.invalidateQueries({ queryKey: ["plans"] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
