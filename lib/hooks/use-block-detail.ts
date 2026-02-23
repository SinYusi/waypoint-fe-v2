import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query"
import type { AxiosError } from "axios"

import {
  getBlockDetail,
  updateBlock,
  type BlockDetail,
  type UpdateBlockRequest,
} from "@/lib/api/block"

export const blockDetailQueryKey = (planId: string, blockId: string) =>
  ["block-detail", planId, blockId] as const

type UseBlockDetailOptions = {
  planId?: string
  blockId?: string
  enabled?: boolean
  queryOptions?: Omit<
    UseQueryOptions<BlockDetail, AxiosError>,
    "queryKey" | "queryFn" | "enabled"
  >
}

export const useBlockDetail = (options: UseBlockDetailOptions) => {
  const { planId, blockId, enabled = true, queryOptions } = options
  const canFetch = Boolean(planId && blockId && enabled)

  return useQuery<BlockDetail, AxiosError>({
    queryKey: blockDetailQueryKey(planId ?? "", blockId ?? ""),
    queryFn: () => getBlockDetail(planId!, blockId!),
    enabled: canFetch,
    ...queryOptions,
  })
}

type UseUpdateBlockOptions = {
  planId?: string
  blockId?: string
  mutationOptions?: Omit<
    UseMutationOptions<BlockDetail, AxiosError, UpdateBlockRequest>,
    "mutationFn"
  >
}

export const useUpdateBlock = (options: UseUpdateBlockOptions) => {
  const queryClient = useQueryClient()
  const { planId, blockId, mutationOptions } = options

  return useMutation<BlockDetail, AxiosError, UpdateBlockRequest>({
    mutationFn: async (payload) => {
      if (!planId || !blockId) {
        throw new Error("planId and blockId are required")
      }

      return updateBlock(planId, blockId, payload)
    },
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (planId && blockId) {
        queryClient.setQueryData<BlockDetail>(blockDetailQueryKey(planId, blockId), data)
      }
      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}
