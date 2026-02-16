"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getMe, type UserMeResponse } from "@/lib/api/user";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseQueryOptions<UserMeResponse, AxiosError<ProblemDetail>>,
  "queryKey" | "queryFn"
>;

export const useMe = (options?: Options) => {
  return useQuery<UserMeResponse, AxiosError<ProblemDetail>>({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
