/**
 * Notification API
 * --------------------------------------------------
 *
 * - 알림 조회 (GET | `/notifications`)
 * - 알림 읽음 (PATCH | `/notifications/{notificationId}`)
 * - 알림 전체 읽음 (PATCH | `/notifications`)
 */

import {
  GetNotificationsParams,
  NotificationListResponse,
} from "@/types/notification";
import { apiClient } from "./client";

/**
 * 알림 목록 조회 API
 *
 * @param params - 페이지네이션 파라미터 (page, size)
 * @returns 알림 목록 및 페이지 정보
 */
export const getNotifications = async (params?: GetNotificationsParams) => {
  const res = await apiClient.get<NotificationListResponse>("/notifications", {
    params,
  });
  return res.data;
};

/**
 * 알림 읽음 처리 API
 *
 * @param notificationId - 읽음 처리할 알림 ID
 */
export const readNotification = async (notificationId: string) => {
  await apiClient.patch(`/notifications/${notificationId}`);
};

/**
 * 알림 전체 읽음 처리 API
 */
export const readAllNotifications = async () => {
  await apiClient.patch("/notifications");
};
