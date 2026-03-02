"use client";

import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getBlockList,
  type BlockListResponse,
  type GetBlockListParams,
} from "@/lib/api/block";

export const blockListInfiniteBaseQueryKey = (planId: string, day: number) =>
  ["block-list-infinite", planId, day] as const;

export const blockListInfiniteQueryKey = (
  planId: string,
  params: Pick<GetBlockListParams, "day" | "size">,
) =>
  [
    ...blockListInfiniteBaseQueryKey(planId, params.day),
    params.size ?? 10,
  ] as const;

type UseBlockListInfiniteOptions = {
  planId?: string;
  params: Pick<GetBlockListParams, "day" | "size">;
  enabled?: boolean;
  queryOptions?: Omit<
    UseInfiniteQueryOptions<
      BlockListResponse,
      AxiosError,
      InfiniteData<BlockListResponse>,
      ReturnType<typeof blockListInfiniteQueryKey>,
      number
    >,
    | "queryKey"
    | "queryFn"
    | "enabled"
    | "initialPageParam"
    | "getNextPageParam"
    | "initialData"
  > & {
    initialData?: BlockListResponse;
  };
};

export const useBlockListInfinite = ({
  planId,
  params,
  enabled = true,
  queryOptions,
}: UseBlockListInfiniteOptions) => {
  const { day, size = 10 } = params;
  const canFetch = Boolean(planId && enabled);

  const prefetched = queryOptions?.initialData;

  return useInfiniteQuery<
    BlockListResponse,
    AxiosError,
    InfiniteData<BlockListResponse>,
    ReturnType<typeof blockListInfiniteQueryKey>,
    number
  >({
    queryKey: blockListInfiniteQueryKey(planId ?? "", { day, size }),
    enabled: canFetch,
    initialPageParam: 0,

    queryFn: ({ pageParam }) =>
      getBlockList(planId!, { day, page: pageParam, size }),

    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,

    staleTime: 30_000,

    ...(prefetched
      ? ({
          initialData: { pages: [prefetched], pageParams: [0] },
        } as const)
      : {}),

    ...(queryOptions ? { ...queryOptions, initialData: undefined } : {}),
  });
};
