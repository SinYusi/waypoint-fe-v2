export type NotificationCategory =
  | "PLAN_PLACE"
  | "COLLECTION_PLACE"
  | "BUDGET"
  | "COLLECTION_ACTIVITY"
  | "PLAN_ACTIVITY"
  | "AI"
  | "SYSTEM";

export type NotificationEventType =
  | "PLACE_ADDED_TO_PLAN"
  | "PLACE_REMOVED_FROM_PLAN"
  | "PLACE_ADDED_TO_COLLECTION"
  | "PLACE_REMOVED_FROM_COLLECTION"
  | "BUDGET_ITEM_ADDED"
  | "COLLECTION_MY_PLACE_PICKED"
  | "COLLECTION_PLACE_PASSED"
  | "PLAN_BLOCK_OPINION_ADDED"
  | "PLAN_BLOCK_SELECTED"
  | "AI_PLACE_EXTRACTION_SUCCESS"
  | "AI_PLACE_EXTRACTION_FAILED"
  | "SYSTEM_ANNOUNCEMENT"
  | "SYSTEM_MAINTENANCE";

export interface NotificationResponse {
  notification_id: string;
  category: NotificationCategory;
  event_type: NotificationEventType;
  message: string;
  link_url: string;
  send_at: string;
}

export interface NotificationListResponse {
  contents: NotificationResponse[];
  has_next: boolean;
  page: number;
  size: number;
}

export interface GetNotificationsParams {
  page?: number;
  size?: number;
}

/**
 * SYSTEM 카테고리만 "공지" 배지, 나머지는 "알림" 배지
 */
export function getNotificationBadgeVariant(
  category: NotificationCategory,
): "default" | "announcement" {
  return category === "SYSTEM" ? "announcement" : "default";
}
