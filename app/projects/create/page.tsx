"use client";

import { Suspense } from "react";
import ProjectForm from "@/components/common/projects/ProjectForm";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useCreatePlan } from "@/lib/hooks/project/plan/use-create-plan";
import { useAddPlanCollections } from "@/lib/hooks/plan-collection/use-add-plan-collections";
import { useProjectForm } from "@/lib/hooks/project/use-project-form";
import { toApiDateRange } from "@/lib/utils/date";
import { useRouter, useSearchParams } from "next/navigation";

const ProjectCreateContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId");

  const form = useProjectForm();

  const { mutate: addCollections } = useAddPlanCollections({
    onSuccess: () => router.push("/projects"),
  });

  const { mutate, isPending } = useCreatePlan({
    onSuccess: (data) => {
      form.resetAll();
      if (collectionId) {
        addCollections({
          planId: data.plan_id,
          body: { collection_ids: [collectionId] },
        });
      } else {
        router.push("/projects");
      }
    },
    onError: (err) => {
      const message =
        err.response?.data?.errors?.[0]?.reason ??
        err.response?.data?.detail ??
        "여행 계획 생성에 실패했어요. 잠시 후 다시 시도해 주세요.";

      form.setDateErrorMessage(message);
    },
  });

  const handleCreate = () => {
    const result = form.validateForSubmit();
    if (!result.ok) return;

    const apiRange = toApiDateRange(result.value.range);
    if (!apiRange) return;

    if (isPending) return;

    mutate({
      title: result.value.title,
      ...apiRange,
    });
  };

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

      <form
        id="create-project-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        className="px-5 pt-7 pb-3.5 flex flex-col flex-1"
      >
        <main className="flex-1 flex flex-col gap-10 border-b border-border">
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
          {/* 프로젝트 입력 폼 (이름/날짜) */}
          <ProjectForm
            title={form.title}
            titleErrorMessage={form.titleErrorMessage}
            onTitleChange={form.onTitleChange}
            onTitleBlur={form.validateTitleOnBlur}
            dateText={form.dateText}
            dateErrorMessage={form.dateErrorMessage}
            isCalendarOpen={form.isCalendarOpen}
            calendarMonth={form.calendarMonth}
            draftRange={form.draftRange}
            onCalendarOpenChange={form.onCalendarOpenChange}
            onOpenCalendar={form.openCalendar}
            onDraftRangeChange={form.setDraftRange}
            onMonthChange={form.setCalendarMonth}
            onCompleteCalendar={form.completeCalendar}
          />
        </main>
      </form>

      {/* 하단 버튼 */}
      <footer className="w-full h-[91px] px-5 pt-4 pb-5">
        <Button
          variant="default"
          type="submit"
          form="create-project-form"
          disabled={
            isPending ||
            !form.title.trim() ||
            !form.range?.from ||
            !form.range?.to
          }
          className="w-full"
        >
          여행계획 만들기
        </Button>
      </footer>
    </div>
  );
};

const ProjectCreatePage = () => (
  <Suspense>
    <ProjectCreateContent />
  </Suspense>
);

export default ProjectCreatePage;
