import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import {
  createBlockOpinion,
  deleteBlockOpinion,
  updateBlockOpinion,
  type BlockDetail,
  type CreateBlockOpinionRequest,
  type UpdateBlockOpinionRequest,
} from "@/lib/api/block";
import type { BlockOpinion } from "@/lib/opinion-bottom-sheet";
import { blockDetailQueryKey } from "@/lib/hooks/use-block-detail";

const dedupeMembers = (
  opinions: BlockOpinion[],
  type: "POSITIVE" | "NEGATIVE",
) => {
  const unique = new Map<string, BlockOpinion["added_by"]>();

  for (const opinion of opinions) {
    if (opinion.type !== type) continue;
    const member = opinion.added_by;
    if (!unique.has(member.plan_member_id)) {
      unique.set(member.plan_member_id, member);
    }
  }

  return Array.from(unique.values());
};

const patchBlockDetailOpinionDerivedFields = (
  detail: BlockDetail,
): BlockDetail => {
  const positiveCount = detail.opinions.filter(
    (opinion) => opinion.type === "POSITIVE",
  ).length;
  const neutralCount = detail.opinions.filter(
    (opinion) => opinion.type === "NEUTRAL",
  ).length;
  const negativeCount = detail.opinions.filter(
    (opinion) => opinion.type === "NEGATIVE",
  ).length;
  const myOpinionItem = detail.myOpinionId
    ? detail.opinions.find(
        (opinion) => opinion.opinion_Id === detail.myOpinionId,
      )
    : undefined;

  return {
    ...detail,
    positiveCount,
    neutralCount,
    negativeCount,
    positiveMembers: dedupeMembers(detail.opinions, "POSITIVE"),
    negativeMembers: dedupeMembers(detail.opinions, "NEGATIVE"),
    myOpinionId: myOpinionItem?.opinion_Id ?? null,
    myPlanMemberId: myOpinionItem?.added_by.plan_member_id ?? "",
    myOpinion: myOpinionItem?.type ?? null,
  };
};

type UpdateBlockOpinionVariables = {
  opinionId: string;
  payload: UpdateBlockOpinionRequest;
};

type UseUpdateBlockOpinionOptions = {
  planId?: string;
  blockId?: string;
  mutationOptions?: Omit<
    UseMutationOptions<BlockOpinion, AxiosError, UpdateBlockOpinionVariables>,
    "mutationFn"
  >;
};

type UseCreateBlockOpinionOptions = {
  planId?: string;
  blockId?: string;
  mutationOptions?: Omit<
    UseMutationOptions<BlockOpinion, AxiosError, CreateBlockOpinionRequest>,
    "mutationFn"
  >;
};

export const useCreateBlockOpinion = (
  options: UseCreateBlockOpinionOptions,
) => {
  const queryClient = useQueryClient();
  const { planId, blockId, mutationOptions } = options;

  return useMutation<BlockOpinion, AxiosError, CreateBlockOpinionRequest>({
    mutationFn: async (payload) => {
      if (!planId || !blockId) {
        throw new Error("planId and blockId are required");
      }

      return createBlockOpinion(planId, blockId, payload);
    },
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (planId && blockId) {
        queryClient.setQueryData<BlockDetail>(
          blockDetailQueryKey(planId, blockId),
          (old) => {
            if (!old) return old;

            const next = {
              ...old,
              opinions: [...old.opinions, data],
              myOpinionId: data.opinion_Id,
            };

            return patchBlockDetailOpinionDerivedFields(next);
          },
        );

        queryClient.invalidateQueries({
          queryKey: ["block-list-infinite", planId],
        });
      }

      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useUpdateBlockOpinion = (
  options: UseUpdateBlockOpinionOptions,
) => {
  const queryClient = useQueryClient();
  const { planId, blockId, mutationOptions } = options;

  return useMutation<BlockOpinion, AxiosError, UpdateBlockOpinionVariables>({
    mutationFn: async (variables) => {
      if (!planId || !blockId) {
        throw new Error("planId and blockId are required");
      }

      return updateBlockOpinion(
        planId,
        blockId,
        variables.opinionId,
        variables.payload,
      );
    },
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (planId && blockId) {
        queryClient.setQueryData<BlockDetail>(
          blockDetailQueryKey(planId, blockId),
          (old) => {
            if (!old) return old;

            const next = {
              ...old,
              opinions: old.opinions.map((opinion) =>
                opinion.opinion_Id === variables.opinionId ? data : opinion,
              ),
            };

            return patchBlockDetailOpinionDerivedFields(next);
          },
        );

        queryClient.invalidateQueries({
          queryKey: ["block-list-infinite", planId],
        });
      }

      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type DeleteBlockOpinionVariables = {
  opinionId: string;
};

type UseDeleteBlockOpinionOptions = {
  planId?: string;
  blockId?: string;
  mutationOptions?: Omit<
    UseMutationOptions<void, AxiosError, DeleteBlockOpinionVariables>,
    "mutationFn"
  >;
};

export const useDeleteBlockOpinion = (
  options: UseDeleteBlockOpinionOptions,
) => {
  const queryClient = useQueryClient();
  const { planId, blockId, mutationOptions } = options;

  return useMutation<void, AxiosError, DeleteBlockOpinionVariables>({
    mutationFn: async ({ opinionId }) => {
      if (!planId || !blockId) {
        throw new Error("planId and blockId are required");
      }

      await deleteBlockOpinion(planId, blockId, opinionId);
    },
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (planId && blockId) {
        queryClient.setQueryData<BlockDetail>(
          blockDetailQueryKey(planId, blockId),
          (old) => {
            if (!old) return old;

            const next = {
              ...old,
              opinions: old.opinions.filter(
                (opinion) => opinion.opinion_Id !== variables.opinionId,
              ),
            };

            return patchBlockDetailOpinionDerivedFields(next);
          },
        );

        queryClient.invalidateQueries({
          queryKey: ["block-list-infinite", planId],
        });
      }

      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
