"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";

const ProjectCreatePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background gap-2.5 pt-20">
      {/* 헤더(뒤로가기 + 타이틀) */}
      <Header
        variant="center"
        title="새 여행계획"
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed top-0 inset-x-0"
      />

      <main className="px-5 pt-7 pb-3.5 flex flex-col flex-1">
        <div className="flex-1 flex flex-col gap-10 border-b border-border">
          {/* 타이틀 + 설명 */}
          <div className="flex flex-col gap-4">
            <h2 className="typography-display-2xl text-foreground">
              새로운 여행을 준비해볼까요?
            </h2>
            <p className="typography-body-base text-muted-foreground">
              이름과 날짜를 정하면 여행 계획을 <br />
              시작할 수 있어요.
            </p>
          </div>
          <form id="create-project-form" className="flex flex-col gap-5">
            {/* 여행 이름 */}
            <div className="flex flex-col gap-2">
              <Label required labelClassName="typography-label-sm-sb">
                여행 이름
              </Label>
              <InputForm hideIcon placeholder="예) 제주도 첫 캠핑" />
            </div>
            {/* 여행 날짜 */}
            <div className="flex flex-col gap-2">
              <Label required labelClassName="typography-label-sm-sb">
                여행 날짜
              </Label>
              <InputForm
                icon={CalendarIcon}
                iconClassName="text-foreground"
                placeholder="여행 시작과 종료일을 입력해주세요"
              />
            </div>
          </form>
        </div>
      </main>

      {/* 하단 버튼 */}
      <footer className="w-full h-[91px] px-5 pt-4 pb-5">
        <Button
          variant="default"
          type="submit"
          form="create-project-form"
          className="w-full"
        >
          여행계획 만들기
        </Button>
      </footer>
    </div>
  );
};

export default ProjectCreatePage;
