"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ExtractionJobResponse, FromUrlStatus } from "@/types/extraction-job";
import type { ProblemDetail } from "@/types/problem-detail";
import { getLatestExtractionJob } from "@/lib/api/collection";

const TERMINAL_STATUSES: FromUrlStatus[] = ["COMPLETED", "FAILED"];

type Options = Omit<
  UseQueryOptions<ExtractionJobResponse, AxiosError<ProblemDetail>>,
  "queryKey" | "queryFn"
>;

export const useLatestExtractionJob = (
  collectionId: string,
  options?: Options,
) => {
  return useQuery<ExtractionJobResponse, AxiosError<ProblemDetail>>({
    queryKey: ["extractionJobLatest", collectionId],
    queryFn: () => getLatestExtractionJob(collectionId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || TERMINAL_STATUSES.includes(status)) return false;
      return 3000;
    },
    ...options,
  });
};
