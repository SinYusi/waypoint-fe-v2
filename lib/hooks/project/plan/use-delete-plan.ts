"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ProblemDetail } from "@/types/problem-detail";
import { DeletePlanParams, DeletePlanResponse } from "@/types/plan";
import { deletePlan } from "@/lib/api/plan";

type Options = Omit<
  UseMutationOptions<
    DeletePlanResponse,
    AxiosError<ProblemDetail>,
    DeletePlanParams
  >,
  "mutationFn"
>;

export const useDeletePlan = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeletePlanResponse,
    AxiosError<ProblemDetail>,
    DeletePlanParams
  >({
    mutationFn: ({ planId }) => deletePlan(planId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
