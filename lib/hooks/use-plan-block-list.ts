"use client";

import { useQueries, UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getBlockList, type BlockListResponse } from "@/lib/api/block";
import { blockListInfiniteBaseQueryKey } from "./use-block-list-infinite";

type UsePlanBlockListsOptions = {
  planId?: string;
  days: number[];
  enabled?: boolean;
};

export const usePlanBlockList = ({
  planId,
  days,
  enabled = true,
}: UsePlanBlockListsOptions): UseQueryResult<
  BlockListResponse,
  AxiosError
>[] => {
  const canFetch = Boolean(planId && enabled);

  return useQueries({
    queries: days.map((day) => ({
      queryKey: [
        ...blockListInfiniteBaseQueryKey(planId ?? "", day),
        "peek",
      ] as const,
      queryFn: () => getBlockList(planId!, { day, page: 0, size: 1 }),
      enabled: canFetch,
      staleTime: 30_000,
    })),
  });
};
