"use client";

import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import { addExtractionJobPlaces } from "@/lib/api/collection";

type Variables = {
  collectionId: string;
  jobId: string;
  place_ids: string[];
};

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useAddExtractionJobPlaces = (options?: Options) => {
  return useMutation<void, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ collectionId, jobId, place_ids }) =>
      addExtractionJobPlaces(collectionId, jobId, place_ids),
    ...options,
  });
};
