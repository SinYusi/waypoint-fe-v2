"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deleteTimeBlock } from "@/lib/api/block";
import type { ProblemDetail } from "@/types/problem-detail";
import { blockListInfiniteBaseQueryKey } from "./use-block-list-infinite";

export type DeleteTimeBlockRequest = {
  planId: string;
  timeBlockId: string;
  day: number;
};

type UseDeleteTimeBlockOptions = {
  mutationOptions?: Omit<
    UseMutationOptions<void, AxiosError<ProblemDetail>, DeleteTimeBlockRequest>,
    "mutationFn"
  >;
};

export const useDeleteTimeBlock = (options: UseDeleteTimeBlockOptions = {}) => {
  const queryClient = useQueryClient();
  const { mutationOptions } = options;

  return useMutation<void, AxiosError<ProblemDetail>, DeleteTimeBlockRequest>({
    mutationFn: async ({ planId, timeBlockId }) => {
      if (!planId || !timeBlockId) {
        throw new Error("planId and timeBlockId are required");
      }
      await deleteTimeBlock(planId, timeBlockId);
    },
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      const { planId, day } = variables;

      queryClient.invalidateQueries({
        queryKey: blockListInfiniteBaseQueryKey(planId, day),
        exact: false,
        refetchType: "active",
      });

      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
