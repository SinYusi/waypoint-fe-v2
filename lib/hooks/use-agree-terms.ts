"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { agreeTerms, type AgreeTermsResponse } from "@/lib/api/user";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseMutationOptions<AgreeTermsResponse, AxiosError<ProblemDetail>, void>,
  "mutationFn"
>;

export const useAgreeTerms = (options?: Options) => {
  return useMutation<AgreeTermsResponse, AxiosError<ProblemDetail>, void>({
    mutationFn: agreeTerms,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.access_token);
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
