"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { PostCollectionPlacePreferenceParams } from "@/types/collection";
import type { ProblemDetail } from "@/types/problem-detail";
import { postCollectionPlacePreference } from "@/lib/api/collection";

type Options = Omit<
  UseMutationOptions<
    void,
    AxiosError<ProblemDetail>,
    PostCollectionPlacePreferenceParams
  >,
  "mutationFn"
>;

export const useCollectionPlacePreference = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ProblemDetail>,
    PostCollectionPlacePreferenceParams
  >({
    mutationFn: postCollectionPlacePreference,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: ["collectionPlaces"],
      });
      queryClient.invalidateQueries({
        queryKey: ["planCollectionPlaces"],
      });

      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};
