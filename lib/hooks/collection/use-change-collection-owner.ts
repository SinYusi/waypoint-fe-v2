"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { changeCollectionOwner } from "@/lib/api/collection";
import type { ProblemDetail } from "@/types/problem-detail";

type Variables = { collectionId: string; memberId: string };

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useChangeCollectionOwner = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ collectionId, memberId }) =>
      changeCollectionOwner(collectionId, memberId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["collectionMembers", { collectionId: variables.collectionId }],
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
