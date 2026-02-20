"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateMe, type UserMeResponse } from "@/lib/api/user";
import type { ProblemDetail } from "@/types/problem-detail";

type Variables = { nickname: string };

type Options = Omit<
  UseMutationOptions<UserMeResponse, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useUpdateMe = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<UserMeResponse, AxiosError<ProblemDetail>, Variables>({
    mutationFn: updateMe,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
