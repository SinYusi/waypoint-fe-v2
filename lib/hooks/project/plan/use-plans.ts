"use client";

import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ProblemDetail } from "@/types/problem-detail";
import type { GetPlansParams, PlanListResponse } from "@/types/plan";
import { getPlans } from "@/lib/api/plan";

type PlansQueryKey = readonly ["plans", { size: number }];

type Options = Omit<
  UseInfiniteQueryOptions<
    PlanListResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<PlanListResponse, number>,
    PlansQueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const usePlans = (
  params?: Omit<GetPlansParams, "page">,
  options?: Options,
) => {
  const size = params?.size ?? 10;

  return useInfiniteQuery<
    PlanListResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<PlanListResponse, number>,
    PlansQueryKey,
    number
  >({
    queryKey: ["plans", { size }] as const,
    queryFn: ({ pageParam = 0 }) => getPlans({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    ...options,
  });
};
