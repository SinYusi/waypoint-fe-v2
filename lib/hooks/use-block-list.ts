import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getBlockList,
  type BlockListResponse,
  type GetBlockListParams,
} from "@/lib/api/block";

export const blockListQueryKey = (planId: string, params: GetBlockListParams) =>
  [
    "block-list",
    planId,
    params.day,
    params.page ?? 0,
    params.size ?? 20,
  ] as const;

type UseBlockListOptions = {
  planId?: string;
  params?: GetBlockListParams;
  enabled?: boolean;
  queryOptions?: Omit<
    UseQueryOptions<BlockListResponse, AxiosError>,
    "queryKey" | "queryFn" | "enabled"
  >;
};

export const useBlockList = (options: UseBlockListOptions) => {
  const { planId, params, enabled = true, queryOptions } = options;
  const canFetch = Boolean(planId && params?.day && enabled);

  return useQuery<BlockListResponse, AxiosError>({
    queryKey: blockListQueryKey(
      planId ?? "",
      params ?? { day: 0, page: 0, size: 20 },
    ),
    queryFn: () => getBlockList(planId!, params!),
    enabled: canFetch,
    ...queryOptions,
  });
};

export const useSetBlockListCache = () => {
  const queryClient = useQueryClient();

  return (
    planId: string,
    params: GetBlockListParams,
    next: BlockListResponse,
  ) => {
    queryClient.setQueryData<BlockListResponse>(
      blockListQueryKey(planId, params),
      next,
    );
  };
};
