"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { reissue, type DevLoginResponse } from "@/lib/api/auth";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseMutationOptions<DevLoginResponse, AxiosError<ProblemDetail>, void>,
  "mutationFn"
>;

export const useReissue = (options?: Options) => {
  return useMutation<DevLoginResponse, AxiosError<ProblemDetail>, void>({
    mutationFn: reissue,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", data.access_token);
      }

      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};
