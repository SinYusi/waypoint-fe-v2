"use client";

import Header from "@/components/layout/Header";
import NotiEmptyIllust from "@/public/illust/noti_empty_illust.svg";

const NotificationPage = () => {
  const handleReadAll = () => {};

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
            onClick={handleReadAll}
          >
            모두 비우기
          </button>
        }
      />

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
    </div>
  );
};

export default NotificationPage;
