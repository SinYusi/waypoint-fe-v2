"use client";

import Header from "@/components/layout/Header";
import NotificationItem from "@/components/notification/NotificationItem";
import NotiEmptyIllust from "@/public/illust/noti_empty_illust.svg";
import { useCallback, useState } from "react";
import { type NotificationBadgeVariant } from "@/components/notification/NotificationBadge";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";

const PAGE_SIZE = 20;

// TODO: API 연동 후 제거
type MockNotification = {
  id: string;
  badgeVariant: NotificationBadgeVariant;
  message: string;
  linkUrl: string;
};

const BASE_MESSAGES: Omit<MockNotification, "id">[] = [
  {
    badgeVariant: "default",
    message: "제주도 여행에 '한라산 정상'이 추가되었어요",
    linkUrl: "/projects",
  },
  {
    badgeVariant: "default",
    message: "이영희님이 '스타벅스 강남R점'을 패스했어요",
    linkUrl: "/home",
  },
  {
    badgeVariant: "default",
    message: "제주도 여행에 50,000원 지출이 추가되었어요",
    linkUrl: "/projects",
  },
  {
    badgeVariant: "default",
    message: "맛집 컬렉션에 '광안리 수제버거'가 추가되었어요",
    linkUrl: "/home",
  },
  {
    badgeVariant: "announcement",
    message: "[점검] 3/15(토) 01:00~04:00 시스템 점검 예정입니다",
    linkUrl: "/home",
  },
  {
    badgeVariant: "default",
    message: "박지성님이 '한라산 등반'에 의견을 남겼어요",
    linkUrl: "/projects",
  },
  {
    badgeVariant: "default",
    message: "내가 추가한 '제주 흑돼지 맛집'이 3월 15일 점심 식사로 선택되었어요",
    linkUrl: "/projects",
  },
  {
    badgeVariant: "default",
    message: "AI 장소 추출이 완료되었어요. 15개의 장소를 확인해보세요!",
    linkUrl: "/projects",
  },
  {
    badgeVariant: "announcement",
    message: "[공지] 3월 15일 서버 점검 안내",
    linkUrl: "/home",
  },
  {
    badgeVariant: "default",
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

const NotificationPage = () => {
  const [allNotifications, setAllNotifications] = useState(
    ALL_MOCK_NOTIFICATIONS,
  );
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

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
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        variant="center"
        title="알림"
        showBackButton
        leftBtnBgVariant="ghost"
        rightContent={
          <button
            className="h-10 px-1.5 py-2.5 rounded-2xl text-sm font-bold leading-5 text-[#757575]"
            onClick={handleDeleteAll}
          >
            모두 비우기
          </button>
        }
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
        <main className="flex-1 flex flex-col px-5 pt-3 pb-10 gap-4">
          {visibleNotifications.map((n) => (
            <NotificationItem
              key={n.id}
              badgeVariant={n.badgeVariant}
              message={n.message}
              onDelete={() => handleDelete(n.id)}
            />
          ))}
          <div ref={loadMoreRef} className="h-10" />
        </main>
      )}
    </div>
  );
};

export default NotificationPage;
