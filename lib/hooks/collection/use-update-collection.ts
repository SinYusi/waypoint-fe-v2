"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  UpdateCollectionRequest,
  UpdateCollectionResponse,
  UpdateCollectionParams,
} from "@/types/collection";
import { updateCollection } from "../../api/collection";
import { ProblemDetail } from "@/types/problem-detail";

type Variables = {
  collectionId: UpdateCollectionParams["collectionId"];
  body: UpdateCollectionRequest;
};

type Options = Omit<
  UseMutationOptions<
    UpdateCollectionResponse,
    AxiosError<ProblemDetail>,
    Variables
  >,
  "mutationFn"
>;

export const useUpdateCollection = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateCollectionResponse,
    AxiosError<ProblemDetail>,
    Variables
  >({
    mutationFn: ({ collectionId, body }) =>
      updateCollection(collectionId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(
        ["collection", { collectionId: variables.collectionId }],
        data,
      );

      queryClient.invalidateQueries({ queryKey: ["collections"] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
