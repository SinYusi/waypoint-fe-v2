"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { leaveCollection } from "@/lib/api/collection";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, string>,
  "mutationFn"
>;

export const useLeaveCollection = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, string>({
    mutationFn: leaveCollection,
    ...options,
    onSuccess: (data, collectionId, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collectionMembers", { collectionId }] });
      options?.onSuccess?.(data, collectionId, onMutateResult, context);
    },
  });
};
