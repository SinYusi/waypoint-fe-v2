"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updatePicture } from "@/lib/api/user";
import type { ProblemDetail } from "@/types/problem-detail";

type Variables = { file: File };

type Options = Omit<
  UseMutationOptions<void, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useUpdatePicture = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ file }) => updatePicture(file),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
