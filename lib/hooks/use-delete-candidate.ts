"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deleteCandidate } from "@/lib/api/block";
import type { ProblemDetail } from "@/types/problem-detail";
import { blockListInfiniteBaseQueryKey } from "./use-block-list-infinite";

export type DeleteCandidateRequest = {
  planId: string;
  timeBlockId: string;
  blockId: string;
  day: number;
};

type UseDeleteCandidateOptions = {
  mutationOptions?: Omit<
    UseMutationOptions<void, AxiosError<ProblemDetail>, DeleteCandidateRequest>,
    "mutationFn"
  >;
};

export const useDeleteCandidate = (options: UseDeleteCandidateOptions = {}) => {
  const queryClient = useQueryClient();
  const { mutationOptions } = options;

  return useMutation<void, AxiosError<ProblemDetail>, DeleteCandidateRequest>({
    mutationFn: async ({ planId, timeBlockId, blockId }) => {
      if (!planId || !timeBlockId || !blockId) {
        throw new Error("planId, timeBlockId, blockId are required");
      }
      await deleteCandidate(planId, timeBlockId, blockId);
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
