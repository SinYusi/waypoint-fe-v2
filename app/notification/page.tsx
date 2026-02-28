"use client";

import Header from "@/components/layout/Header";
import NotificationItem from "@/components/notification/NotificationItem";
import NotiEmptyIllust from "@/public/illust/noti_empty_illust.svg";
import { useState } from "react";
import { type NotificationBadgeVariant } from "@/components/notification/NotificationBadge";

// TODO: API 연동 후 제거
type MockNotification = {
  id: string;
  badgeVariant: NotificationBadgeVariant;
  message: string;
  linkUrl: string;
};

const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "1",
    badgeVariant: "default",
    message: "제주도 여행에 '한라산 정상'이 추가되었어요",
    linkUrl: "/projects",
  },
  {
    id: "2",
    badgeVariant: "default",
    message: "이영희님이 '스타벅스 강남R점'을 패스했어요",
    linkUrl: "/home",
  },
  {
    id: "3",
    badgeVariant: "default",
    message: "제주도 여행에 50,000원 지출이 추가되었어요",
    linkUrl: "/projects",
  },
  {
    id: "4",
    badgeVariant: "default",
    message: "맛집 컬렉션에 '광안리 수제버거'가 추가되었어요",
    linkUrl: "/home",
  },
  {
    id: "5",
    badgeVariant: "announcement",
    message: "[점검] 3/15(토) 01:00~04:00 시스템 점검 예정입니다",
    linkUrl: "/home",
  },
];

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  const isEmpty = notifications.length === 0;

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
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              badgeVariant={n.badgeVariant}
              message={n.message}
              onDelete={() => handleDelete(n.id)}
            />
          ))}
        </main>
      )}
    </div>
  );
};

export default NotificationPage;
