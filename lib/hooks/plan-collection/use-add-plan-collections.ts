"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  PostPlanCollectionsParams,
  PostPlanCollectionsRequest,
  PostPlanCollectionsResponse,
} from "@/types/plan-collection";
import { ProblemDetail } from "@/types/problem-detail";
import { postPlanCollections } from "@/lib/api/plan-collection";

type Variables = PostPlanCollectionsParams & {
  body: PostPlanCollectionsRequest;
};

type Options = Omit<
  UseMutationOptions<
    PostPlanCollectionsResponse,
    AxiosError<ProblemDetail>,
    Variables
  >,
  "mutationFn"
>;

export const useAddPlanCollections = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<
    PostPlanCollectionsResponse,
    AxiosError<ProblemDetail>,
    Variables
  >({
    mutationFn: ({ planId, body }) => postPlanCollections({ planId }, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["plan-collections", { planId: variables.planId }],
      });

      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
