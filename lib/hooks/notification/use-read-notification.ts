"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ProblemDetail } from "@/types/problem-detail";
import { readNotification } from "@/lib/api/notification";

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, string>,
  "mutationFn"
>;

export const useReadNotification = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, string>({
    mutationFn: (notificationId) => readNotification(notificationId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
