"use client";

import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";
import { Button } from "@/components/ui/button";
import CollectionEmptyIllust from "@/public/illust/collection-empty.svg";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const handleCreateCollection = () => {
    router.push("/home/create");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {/* 헤더(알림) */}
      <Header
        showNotificationButton
        rightBtnBgVariant="glass"
        className="fixed top-0 z-10 inset-x-0"
      />

      <main className="flex flex-col flex-1 items-center justify-center mt-15 px-5 pt-5 pb-36 gap-12">
        <div className="flex flex-col gap-5 items-center">
          <CollectionEmptyIllust />
          <div className="flex flex-col text-center gap-2">
            <h2 className="typography-display-xl">
              우리만의 장소 보관함 만들기
            </h2>
            <p className="typography-body-sm-md">
              함께 꿈꾸는 여행지들을 보관함에 담고,
              <br />
              서로 가고 싶은 곳들을 자유롭게 나눠볼까요?
            </p>
          </div>
        </div>
        <Button onClick={handleCreateCollection} className="w-full">
          새 보관함 만들기
        </Button>
      </main>

      {/* 네비게이션 바 */}
      <NavigationBar className="fixed bottom-0 z-10 inset-x-0" />
    </div>
  );
};

export default HomePage;
