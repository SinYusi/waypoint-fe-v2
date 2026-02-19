"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { logout } from "@/lib/api/auth";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, void>,
  "mutationFn"
>;

export const useLogout = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, void>({
    mutationFn: logout,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("accessToken");
      }
      queryClient.clear();

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
