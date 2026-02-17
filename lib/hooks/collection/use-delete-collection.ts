"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  DeleteCollectionParams,
  DeleteCollectionResponse,
} from "@/types/collection";
import { ProblemDetail } from "@/types/problem-detail";
import { deleteCollection } from "@/lib/api/collection";

type Options = Omit<
  UseMutationOptions<
    DeleteCollectionResponse,
    AxiosError<ProblemDetail>,
    DeleteCollectionParams
  >,
  "mutationFn"
>;

export const useDeleteCollection = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteCollectionResponse,
    AxiosError<ProblemDetail>,
    DeleteCollectionParams
  >({
    mutationFn: ({ collectionId }) => deleteCollection(collectionId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
