"use client";

import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { CreateExtractionJobResponse } from "@/types/extraction-job";
import type { ProblemDetail } from "@/types/problem-detail";
import { createExtractionJob } from "@/lib/api/collection";

type Variables = {
  collectionId: string;
  url: string;
};

type Options = Omit<
  UseMutationOptions<
    CreateExtractionJobResponse,
    AxiosError<ProblemDetail>,
    Variables
  >,
  "mutationFn"
>;

export const useCreateExtractionJob = (options?: Options) => {
  return useMutation<
    CreateExtractionJobResponse,
    AxiosError<ProblemDetail>,
    Variables
  >({
    mutationFn: ({ collectionId, url }) =>
      createExtractionJob(collectionId, url),
    ...options,
  });
};
