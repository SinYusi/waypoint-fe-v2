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

const isQueryKeyPrefix = (
  queryKey: readonly unknown[],
  prefix: readonly unknown[],
) => prefix.every((v, i) => queryKey[i] === v);

export const useUpdatePlan = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePlanResponse, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ planId, body }) => updatePlan(planId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      const isConfirmRequest = variables.body.confirm === true;

      const shouldSkipCacheUpdate =
        !isConfirmRequest && data.requires_confirmation === true;

      if (!shouldSkipCacheUpdate) {
        if (data.plan) {
          queryClient.setQueryData(
            ["plan", { planId: variables.planId }],
            data.plan,
          );
        }

        queryClient.invalidateQueries({ queryKey: ["plans"] });

        queryClient.invalidateQueries({
          predicate: (q) => {
            const key = q.queryKey;
            return (
              Array.isArray(key) &&
              isQueryKeyPrefix(key, ["block-list-infinite", variables.planId])
            );
          },
        });
      }

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
