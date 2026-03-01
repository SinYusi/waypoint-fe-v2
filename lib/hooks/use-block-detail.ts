import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import {
  getBlockDetail,
  updateBlock,
  type BlockDetail,
  type UpdateBlockRequest,
} from "@/lib/api/block";
import { blockListInfiniteBaseQueryKey } from "./use-block-list-infinite";

export const blockDetailQueryKey = (planId: string, blockId: string) =>
  ["block-detail", planId, blockId] as const;

type UseBlockDetailOptions = {
  planId?: string;
  blockId?: string;
  enabled?: boolean;
  queryOptions?: Omit<
    UseQueryOptions<BlockDetail, AxiosError>,
    "queryKey" | "queryFn" | "enabled"
  >;
};

export const useBlockDetail = (options: UseBlockDetailOptions) => {
  const { planId, blockId, enabled = true, queryOptions } = options;
  const canFetch = Boolean(planId && blockId && enabled);

  return useQuery<BlockDetail, AxiosError>({
    queryKey: blockDetailQueryKey(planId ?? "", blockId ?? ""),
    queryFn: () => getBlockDetail(planId!, blockId!),
    enabled: canFetch,
    ...queryOptions,
  });
};

type UseUpdateBlockOptions = {
  planId?: string;
  blockId?: string;
  day?: number; // 현재 블록이 속한 수정 전 day
  mutationOptions?: Omit<
    UseMutationOptions<BlockDetail, AxiosError, UpdateBlockRequest>,
    "mutationFn"
  >;
};

export const useUpdateBlock = (options: UseUpdateBlockOptions) => {
  const queryClient = useQueryClient();
  const { planId, blockId, day: oldDay, mutationOptions } = options;

  return useMutation<BlockDetail, AxiosError, UpdateBlockRequest>({
    mutationFn: async (payload) => {
      if (!planId || !blockId) {
        throw new Error("planId and blockId are required");
      }

      return updateBlock(planId, blockId, payload);
    },
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      // detail 캐시 갱신
      if (planId && blockId) {
        queryClient.setQueryData<BlockDetail>(
          blockDetailQueryKey(planId, blockId),
          data,
        );
      }
      // 목록 invalidate (oldDay, newDay)
      if (planId && oldDay) {
        const nextDay = variables.day ? Number(variables.day) : oldDay;

        // old day
        queryClient.invalidateQueries({
          queryKey: blockListInfiniteBaseQueryKey(planId, oldDay),
          exact: false,
          refetchType: "active",
        });

        // moved day
        if (nextDay !== oldDay) {
          queryClient.invalidateQueries({
            queryKey: blockListInfiniteBaseQueryKey(planId, nextDay),
            exact: false,
            refetchType: "active",
          });
        }
      }
      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
