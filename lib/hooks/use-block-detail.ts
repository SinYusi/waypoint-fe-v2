import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { getBlockDetail, type BlockDetail } from "@/lib/api/block"

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
