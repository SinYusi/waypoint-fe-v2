"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deleteMe } from "@/lib/api/user";
import type { ProblemDetail } from "@/types/problem-detail";

type Variables = { reason: string };

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useDeleteMe = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, Variables>({
    mutationFn: deleteMe,
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
