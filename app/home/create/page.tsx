"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";

const CollectionCreatePage = () => {
  const onCreateCollection = () => {
    console.log("생성");
  };
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {/* 헤더(뒤로가기) */}
      <Header
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed top-0 z-10 inset-x-0"
      />

      <main className="flex flex-col flex-1 justify-between px-5 py-18.75">
        <div className="flex flex-col gap-10 pt-4">
          <div className="flex flex-col gap-5 text-start">
            <h2 className="typography-display-2xl">
              어떤 여행을 꿈꾸고 계신가요?
            </h2>
            <p className="typography-body-base text-muted-foreground">
              보관함 이름을 입력하고,
              <br />
              가고 싶은 장소들을 우리만의 공간에 담아보세요!
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>보관함 이름</Label>
            <InputForm hideIcon />
          </div>
        </div>

        <Button onClick={onCreateCollection} className="w-full">
          보관함 만들기
        </Button>
      </main>
    </div>
  );
};

export default CollectionCreatePage;
