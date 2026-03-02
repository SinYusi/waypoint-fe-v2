"use client";

import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  NotificationListResponse,
  GetNotificationsParams,
} from "@/types/notification";
import { getNotifications } from "@/lib/api/notification";
import { ProblemDetail } from "@/types/problem-detail";

type NotificationsQueryKey = readonly ["notifications", { size: number }];

type Options = Omit<
  UseInfiniteQueryOptions<
    NotificationListResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<NotificationListResponse, number>,
    NotificationsQueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const useNotifications = (
  params?: Omit<GetNotificationsParams, "page">,
  options?: Options,
) => {
  const size = params?.size ?? 10;

  return useInfiniteQuery<
    NotificationListResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<NotificationListResponse, number>,
    NotificationsQueryKey,
    number
  >({
    queryKey: ["notifications", { size }] as const,
    queryFn: ({ pageParam = 0 }) =>
      getNotifications({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    ...options,
  });
};
