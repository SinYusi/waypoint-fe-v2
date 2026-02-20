"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { CollectionMembersResponse } from "@/types/member";
import { getCollectionMembers } from "@/lib/api/collection";
import type { ProblemDetail } from "@/types/problem-detail";

type CollectionMembersQueryKey = readonly [
  "collectionMembers",
  { collectionId: string },
];

type Options = Omit<
  UseQueryOptions<
    CollectionMembersResponse,
    AxiosError<ProblemDetail>,
    CollectionMembersResponse,
    CollectionMembersQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const useCollectionMembers = (
  collectionId: string,
  options?: Options,
) => {
  return useQuery<
    CollectionMembersResponse,
    AxiosError<ProblemDetail>,
    CollectionMembersResponse,
    CollectionMembersQueryKey
  >({
    queryKey: ["collectionMembers", { collectionId }] as const,
    queryFn: () => getCollectionMembers(collectionId),
    enabled: !!collectionId,
    ...options,
  });
};
