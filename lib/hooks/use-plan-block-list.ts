"use client";

import { useQueries, UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getBlockList,
  type BlockListResponse,
  type GetBlockListParams,
} from "@/lib/api/block";
import { blockListQueryKey } from "@/lib/hooks/use-block-list";

type UsePlanBlockListsOptions = {
  planId?: string;
  days: number[];
  params?: Omit<GetBlockListParams, "day">;
  enabled?: boolean;
};

export const usePlanBlockList = ({
  planId,
  days,
  params = { page: 0, size: 20 },
  enabled = true,
}: UsePlanBlockListsOptions): UseQueryResult<
  BlockListResponse,
  AxiosError
>[] => {
  const canFetch = Boolean(planId && enabled);

  return useQueries({
    queries: days.map((day) => ({
      queryKey: blockListQueryKey(planId ?? "", { day, ...params }),
      queryFn: () => getBlockList(planId!, { day, ...params }),
      enabled: canFetch,
      staleTime: 30_000,
    })),
  });
};
