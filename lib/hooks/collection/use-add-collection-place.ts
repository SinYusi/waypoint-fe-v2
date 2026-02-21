"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  AddCollectionPlaceRequest,
  AddCollectionPlaceResponse,
} from "@/types/collection";
import type { ProblemDetail } from "@/types/problem-detail";
import { addCollectionPlace } from "@/lib/api/collection";

type Variables = { collectionId: string } & AddCollectionPlaceRequest;

type Options = Omit<
  UseMutationOptions<
    AddCollectionPlaceResponse,
    AxiosError<ProblemDetail>,
    Variables
  >,
  "mutationFn"
>;

export const useAddCollectionPlace = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<
    AddCollectionPlaceResponse,
    AxiosError<ProblemDetail>,
    Variables
  >({
    mutationFn: ({ collectionId, place_id }) =>
      addCollectionPlace(collectionId, { place_id }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["collectionPlaces", { collectionId: variables.collectionId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["planCollectionPlaces"],
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
