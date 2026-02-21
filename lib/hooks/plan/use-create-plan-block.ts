"use client";

import { createPlanBlock, createPlanBlockByPlace } from "@/lib/api/plan";
import type {
  BlockResponse,
  CreatePlanBlockByPlaceRequest,
  CreatePlanBlockRequest,
} from "@/types/plan";
import type { ProblemDetail } from "@/types/problem-detail";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
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
  return useMutation<BlockResponse, AxiosError<ProblemDetail>, Variables>({
    mutationFn: ({ planId, body }) => createPlanBlock(planId, body),
    ...options,
  });
};

type ByPlaceVariables = {
  planId: string;
  body: CreatePlanBlockByPlaceRequest;
};

type ByPlaceOptions = Omit<
  UseMutationOptions<BlockResponse, AxiosError<ProblemDetail>, ByPlaceVariables>,
  "mutationFn"
>;

export const useCreatePlanBlockByPlace = (options?: ByPlaceOptions) => {
  return useMutation<BlockResponse, AxiosError<ProblemDetail>, ByPlaceVariables>({
    mutationFn: ({ planId, body }) => createPlanBlockByPlace(planId, body),
    ...options,
  });
};
