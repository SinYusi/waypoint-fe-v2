"use client";

import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { InvitationResponse } from "@/types/invitation";
import type { ProblemDetail } from "@/types/problem-detail";
import { createPlanInvitation } from "@/lib/api/plan";

type Options = Omit<
  UseMutationOptions<
    InvitationResponse,
    AxiosError<ProblemDetail>,
    string
  >,
  "mutationFn"
>;

export const useCreatePlanInvitation = (options?: Options) => {
  return useMutation<InvitationResponse, AxiosError<ProblemDetail>, string>({
    mutationFn: createPlanInvitation,
    ...options,
  });
};
