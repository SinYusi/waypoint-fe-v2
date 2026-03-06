"use client";

import {
  addPlanBlockCandidates,
  createPlanBlock,
  createPlanBlockByPlace,
} from "@/lib/api/plan";
import type {
  AddPlanBlockCandidatesRequest,
  BlockResponse,
  CreatePlanBlockByPlaceRequest,
  CreatePlanBlockRequest,
} from "@/types/plan";
import type { ProblemDetail } from "@/types/problem-detail";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

type Variables = {
  planId: string;
  body: CreatePlanBlockRequest;
};

type Options = Omit<
  UseMutationOptions<BlockResponse, AxiosError<ProblemDetail>, Variables>,
  "mutationFn"
>;

export const useCreatePlanBlock = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<BlockResponse, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ planId, body }) => createPlanBlock(planId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["block-list-infinite", variables.planId],
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type ByPlaceVariables = {
  planId: string;
  body: CreatePlanBlockByPlaceRequest;
};

type ByPlaceOptions = Omit<
  UseMutationOptions<
    BlockResponse,
    AxiosError<ProblemDetail>,
    ByPlaceVariables
  >,
  "mutationFn"
>;

export const useCreatePlanBlockByPlace = (options?: ByPlaceOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    BlockResponse,
    AxiosError<ProblemDetail>,
    ByPlaceVariables
  >({
    mutationFn: ({ planId, body }) => createPlanBlockByPlace(planId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["block-list-infinite", variables.planId],
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type AddCandidatesVariables = {
  planId: string;
  timeBlockId: string;
  body: AddPlanBlockCandidatesRequest;
};

type AddCandidatesOptions = Omit<
  UseMutationOptions<
    BlockResponse,
    AxiosError<ProblemDetail>,
    AddCandidatesVariables
  >,
  "mutationFn"
>;

export const useAddPlanBlockCandidates = (options?: AddCandidatesOptions) => {
  const queryClient = useQueryClient();
  return useMutation<
    BlockResponse,
    AxiosError<ProblemDetail>,
    AddCandidatesVariables
  >({
    mutationFn: ({ planId, timeBlockId, body }) =>
      addPlanBlockCandidates(planId, timeBlockId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["block-list-infinite", variables.planId],
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
