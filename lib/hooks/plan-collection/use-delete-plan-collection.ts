"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import type {
  DeletePlanCollectionParams,
  DeletePlanCollectionResponse,
} from "@/types/plan-collection";
import { deletePlanCollection } from "@/lib/api/plan-collection";

type Options = Omit<
  UseMutationOptions<
    DeletePlanCollectionResponse,
    AxiosError<ProblemDetail>,
    DeletePlanCollectionParams
  >,
  "mutationFn"
>;

export const useDeletePlanCollection = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeletePlanCollectionResponse,
    AxiosError<ProblemDetail>,
    DeletePlanCollectionParams
  >({
    mutationFn: ({ planId, collectionId }) =>
      deletePlanCollection({ planId, collectionId }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["plan-collections", { planId: variables.planId }],
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
