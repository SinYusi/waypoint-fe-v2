"use client";

import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProblemDetail } from "@/types/problem-detail";
import { deleteExtractionJob } from "@/lib/api/collection";

type Variables = {
  collectionId: string;
  jobId: string;
};

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useDeleteExtractionJob = (options?: Options) => {
  return useMutation<void, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ collectionId, jobId }) =>
      deleteExtractionJob(collectionId, jobId),
    ...options,
  });
};
