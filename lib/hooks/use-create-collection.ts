"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  CollectionResponse,
  CreateCollectionRequest,
} from "@/types/collection";
import { createCollection } from "../api/collection";

type Options = Omit<
  UseMutationOptions<CollectionResponse, AxiosError, CreateCollectionRequest>,
  "mutationFn"
>;

export const useCreateCollection = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollection,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
