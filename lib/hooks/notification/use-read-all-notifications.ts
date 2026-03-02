"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ProblemDetail } from "@/types/problem-detail";
import { readAllNotifications } from "@/lib/api/notification";

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, void>,
  "mutationFn"
>;

export const useReadAllNotifications = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, void, unknown>({
    mutationFn: readAllNotifications,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
