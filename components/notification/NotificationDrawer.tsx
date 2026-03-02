"use client";

import { Drawer as DrawerPrimitive } from "vaul";
import Header from "@/components/layout/Header";
import NotificationItem from "./NotificationItem";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import NotiEmptyIllust from "@/public/illust/noti_empty_illust.svg";
import { useCallback, useState } from "react";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { useNotificationDrawer } from "@/lib/context/notification-drawer-context";
import {
  type NotificationCategory,
  getNotificationBadgeVariant,
} from "@/types/notification";

const PAGE_SIZE = 20;

// TODO: API 연동 후 제거
type MockNotification = {
  id: string;
  category: NotificationCategory;
  message: string;
  linkUrl: string;
};

const BASE_MESSAGES: Omit<MockNotification, "id">[] = [
  {
    category: "PLAN_PLACE",
    message: "제주도 여행에 '한라산 정상'이 추가되었어요",
    linkUrl: "/projects",
  },
  {
    category: "COLLECTION_ACTIVITY",
    message: "이영희님이 '스타벅스 강남R점'을 패스했어요",
    linkUrl: "/home",
  },
  {
    category: "BUDGET",
    message: "제주도 여행에 50,000원 지출이 추가되었어요",
    linkUrl: "/projects",
  },
  {
    category: "COLLECTION_PLACE",
    message: "맛집 컬렉션에 '광안리 수제버거'가 추가되었어요",
    linkUrl: "/home",
  },
  {
    category: "SYSTEM",
    message: "[점검] 3/15(토) 01:00~04:00 시스템 점검 예정입니다",
    linkUrl: "/home",
  },
  {
    category: "PLAN_ACTIVITY",
    message: "박지성님이 '한라산 등반'에 의견을 남겼어요",
    linkUrl: "/projects",
  },
  {
    category: "PLAN_ACTIVITY",
    message: "내가 추가한 '제주 흑돼지 맛집'이 3월 15일 점심 식사로 선택되었어요",
    linkUrl: "/projects",
  },
  {
    category: "AI",
    message: "AI 장소 추출이 완료되었어요. 15개의 장소를 확인해보세요!",
    linkUrl: "/projects",
  },
  {
    category: "SYSTEM",
    message: "[공지] 3월 15일 서버 점검 안내",
    linkUrl: "/home",
  },
  {
    category: "COLLECTION_ACTIVITY",
    message: "김철수님이 내가 추가한 '광안리 수제버거'를 찜했어요",
    linkUrl: "/home",
  },
];

const ALL_MOCK_NOTIFICATIONS: MockNotification[] = Array.from(
  { length: 40 },
  (_, i) => ({
    id: String(i + 1),
    ...BASE_MESSAGES[i % BASE_MESSAGES.length],
  }),
);

const NotificationDrawerContent = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const [allNotifications, setAllNotifications] = useState(
    ALL_MOCK_NOTIFICATIONS,
  );
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const visibleNotifications = allNotifications.slice(0, displayCount);
  const hasMore = displayCount < allNotifications.length;
  const isEmpty = allNotifications.length === 0;

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + PAGE_SIZE);
  }, []);

  const loadMoreRef = useIntersectionObserver({
    enabled: hasMore,
    onIntersect: handleLoadMore,
  });

  const handleDelete = (id: string) => {
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteAll = () => {
    setAllNotifications([]);
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-white">
      <Header
        variant="center"
        title="알림"
        showBackButton
        leftBtnBgVariant="ghost"
        onBack={onClose}
        rightContent={
          <button
            className="h-10 px-1.5 py-2.5 rounded-2xl text-sm font-bold leading-5 text-[#757575] cursor-pointer disabled:cursor-not-allowed disabled:text-[#c4c4c4]"
            onClick={() => setIsDeleteAllOpen(true)}
            disabled={isEmpty}
          >
            모두 비우기
          </button>
        }
      />

      <AppAlertDialog
        open={isDeleteAllOpen}
        onOpenChange={setIsDeleteAllOpen}
        title="알림을 전부 지울까요?"
        description={`지금까지 받은 알림들이 모두 사라져요.\n알림함을 깨끗하게 비워도 괜찮으신가요?`}
        cancelLabel="취소"
        actionLabel="전부 지우기"
        onCancel={() => setIsDeleteAllOpen(false)}
        onAction={handleDeleteAll}
      />

      {isEmpty ? (
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <NotiEmptyIllust width={165} height={160} />
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-bold leading-7 text-center text-[#1C2024]">
                아직 도착한 알림이 없어요
              </p>
              <p className="text-sm font-medium leading-5 text-center text-[#1C2024]">
                새로운 소식이 도착하면
                <br />
                알려드릴게요
              </p>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 relative overflow-hidden">
          <main className="h-full overflow-y-auto flex flex-col px-5 pt-3 pb-10 gap-4">
            {visibleNotifications.map((n) => (
              <NotificationItem
                key={n.id}
                badgeVariant={getNotificationBadgeVariant(n.category)}
                message={n.message}
                onDelete={() => handleDelete(n.id)}
              />
            ))}
            <div ref={loadMoreRef} className="h-10" />
          </main>

          {/* 하단 그라디언트 */}
          <div
            className="absolute bottom-0 inset-x-0 h-12 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(250, 250, 250, 0) 0%, #FAFAFA 90%)",
            }}
          />
        </div>
      )}
    </div>
  );
};

const NotificationDrawer = () => {
  const { isOpen, closeDrawer } = useNotificationDrawer();

  return (
    <DrawerPrimitive.Root
      direction="right"
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeDrawer();
      }}
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DrawerPrimitive.Content className="fixed inset-y-0 right-0 z-50 w-full bg-white flex flex-col">
          <DrawerPrimitive.Title className="sr-only">알림</DrawerPrimitive.Title>
          <NotificationDrawerContent onClose={closeDrawer} />
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
};

export default NotificationDrawer;
