"use client";

import Header from "@/components/layout/Header";

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

      <main className="flex-1 px-4 pb-10">
        {/* TODO: 알림 목록 UI */}
      </main>
    </div>
  );
};

export default NotificationPage;
