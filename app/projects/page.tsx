"use client";

import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Plus } from "lucide-react";
import ProjectEmptyIllust from "@/public/illust/project-empty.svg";
import { useRouter } from "next/navigation";
import PlanCard from "@/components/card/PlanCard";
import AppAlertDialog from "@/components/common/AppAlertDialog";

const ProjectPage = () => {
  const router = useRouter();

  // 프로젝트 추가하기 핸들러
  const handleProjectCreate = () => {
    router.push("/projects/create");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 헤더(알림) */}
      <Header
        showNotificationButton
        rightBtnBgVariant="glass"
        className="fixed top-0 z-10 inset-x-0"
      />

      <main
        className={cn(
          "flex flex-col flex-1 mt-15 px-5 pt-5 pb-36",
          //   "items-center justify-center gap-12",
        )}
      >
        {/* 타이틀 */}
        <h2 className="typography-display-2xl">
          우리의 여행 이야기를 <br />
          함께 그려요
        </h2>

        {/* 프로젝트가 없을 경우 */}
        {/* <div className="flex flex-col items-center gap-5">
          <div className="pt-2.75">
            <ProjectEmptyIllust />
          </div>
          <div className="flex flex-col gap-2 text-foreground text-center">
            <h2 className="typography-display-lg-bold">
              아직 여행 계획이 없어요
            </h2>
            <p>
              어디로 떠나고 싶으신가요? <br />
              우리만의 여행계획을 시작해보세요!
            </p>
          </div>
        </div>
        <Button onClick={handleProjectCreate} className="w-full">
          여행 계획 추가하기
        </Button> */}

        <div className="flex flex-col gap-8 pt-8 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          <div>
            <PlanCard
              title="제주도 여행"
              memberCount={4}
              dateRange="2025.12.30 ~ 2026.01.01"
              className="max-w-full"
            />
          </div>
          <div>
            <PlanCard
              title="제주도 여행"
              memberCount={4}
              dateRange="2025.12.30 ~ 2026.01.01"
              className="max-w-full"
            />
          </div>
          <div>
            <PlanCard
              title="제주도 여행"
              memberCount={4}
              dateRange="2025.12.30 ~ 2026.01.01"
              className="max-w-full"
            />
          </div>
          <div>
            <PlanCard
              title="제주도 여행"
              memberCount={4}
              dateRange="2025.12.30 ~ 2026.01.01"
              className="max-w-full"
            />
          </div>
          <div>
            <PlanCard
              title="제주도 여행"
              memberCount={4}
              dateRange="2025.12.30 ~ 2026.01.01"
              className="max-w-full"
            />
          </div>
          <div>
            <PlanCard
              title="제주도 여행"
              memberCount={4}
              dateRange="2025.12.30 ~ 2026.01.01"
              className="max-w-full"
            />
          </div>
          <div>
            <PlanCard
              title="제주도 여행"
              memberCount={4}
              dateRange="2025.12.30 ~ 2026.01.01"
              className="max-w-full"
            />
          </div>
          <div>
            <PlanCard
              title="제주도 여행"
              memberCount={4}
              dateRange="2025.12.30 ~ 2026.01.01"
              className="max-w-full"
            />
          </div>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-14 px-4 pb-9 w-full bg-gradient-bottom-fade z-50">
        <Button onClick={handleProjectCreate} className="w-full">
          <Plus className="text-foreground opacity-40" /> 여행 계획 추가하기
        </Button>
      </div>

      {/* 네비게이션 바 */}
      <NavigationBar className="fixed bottom-0 z-50 inset-x-0" />

      {/* 삭제 확인 다이얼로그 */}
      <AppAlertDialog
        title="정말 이 여행 계획을 삭제하시겠어요?"
        description="삭제한 여행 계획은 다시 복구가 불가능합니다.\n그래도 정말 여행 계획을 삭제하시겠어요?"
        cancelLabel="취소"
        actionLabel="삭제하기"
      />
    </div>
  );
};

export default ProjectPage;
