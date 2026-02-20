"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deletePicture } from "@/lib/api/user";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, void>,
  "mutationFn"
>;

export const useDeletePicture = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, void>({
    mutationFn: deletePicture,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
