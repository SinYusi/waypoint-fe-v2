"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getCandidates } from "@/lib/api/plan";
import type { CandidatesResponse } from "@/types/plan";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseQueryOptions<CandidatesResponse, AxiosError<ProblemDetail>>,
  "queryKey" | "queryFn"
>;

export const useCandidates = (
  planId: string,
  timeBlockId: string,
  options?: Options,
) => {
  return useQuery<CandidatesResponse, AxiosError<ProblemDetail>>({
    queryKey: ["candidates", { planId, timeBlockId }],
    queryFn: () => getCandidates(planId, timeBlockId),
    enabled: !!planId && !!timeBlockId,
    ...options,
  });
};
