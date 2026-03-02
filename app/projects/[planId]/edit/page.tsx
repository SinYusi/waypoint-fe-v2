"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/components/common/projects/ProjectForm";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import { usePlan } from "@/lib/hooks/project/plan/use-plan";
import { useUpdatePlan } from "@/lib/hooks/project/plan/use-update-plan";
import { useProjectForm } from "@/lib/hooks/project/use-project-form";
import { fromApiDateRange, toApiDateRange } from "@/lib/utils/date";
import type { DateRange } from "react-day-picker";
import type { UpdatePlanRequest } from "@/types/plan";
import { ProblemDetail } from "@/types/problem-detail";
import { AxiosError } from "axios";

const ProjectEditPage = () => {
  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const planId = params.planId;

  // 플랜 조회
  const { data: plan, isLoading, isError, error } = usePlan(planId);

  // 로딩/에러 처리
  if (isLoading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        불러오는 중...
      </div>
    );
  if (isError || !plan) {
    const pd = (error as AxiosError<ProblemDetail> | null)?.response?.data;

    const message =
      pd?.errors?.[0]?.reason ??
      pd?.detail ??
      "여행 계획을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";

    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-destructive">
        {message}
      </div>
    );
  }

  return (
    <ProjectEditForm
      planId={planId}
      initialTitle={plan.title ?? ""}
      initialRange={fromApiDateRange(plan.start_date, plan.end_date)}
      onDone={() => router.push("/projects")}
    />
  );
};

type ProjectEditFormProps = {
  planId: string;
  initialTitle: string;
  initialRange: DateRange;
  onDone: () => void;
};

const ProjectEditForm = ({
  planId,
  initialTitle,
  initialRange,
  onDone,
}: ProjectEditFormProps) => {
  // 초기 여행 이름/날짜 주입
  const form = useProjectForm({ initialTitle, initialRange });

  // confirm 플로우 state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingBody, setPendingBody] = useState<UpdatePlanRequest | null>(
    null,
  );

  // 플랜 수정
  const { mutate, isPending } = useUpdatePlan({
    onSuccess: (res, variables) => {
      // 날짜 축소 -> 확인 필요
      if (res.requiresConfirmation) {
        setPendingBody(variables.body); // confirm 재요청용
        setIsConfirmOpen(true);
        return;
      }

      // 정상 완료
      form.resetAll();
      onDone();
    },
    onError: (err) => {
      const message =
        err.response?.data?.errors?.[0]?.reason ??
        err.response?.data?.detail ??
        "여행 계획 수정에 실패했어요. 잠시 후 다시 시도해 주세요.";

      form.setDateErrorMessage(message);
    },
  });

  const handleUpdate = () => {
    if (!form.isChange) return;

    const result = form.validateForSubmit();
    if (!result.ok) return;

    const apiRange = toApiDateRange(result.value.range);
    if (!apiRange) return;

    if (isPending) return;

    mutate({
      planId,
      body: {
        title: result.value.title,
        ...apiRange,
      },
    });
  };

  const handleConfirm = () => {
    if (!pendingBody || isPending) return;

    mutate({
      planId,
      body: { ...pendingBody, confirm: true },
    });

    setIsConfirmOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background gap-2.5 pt-20">
      {/* 헤더(뒤로가기 + 타이틀) */}
      <Header
        variant="center"
        title="여행계획 수정"
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed top-0 inset-x-0"
      />

      <form
        id="edit-project-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="px-5 pt-7 pb-3.5 flex flex-col flex-1"
      >
        <main className="flex-1 flex flex-col gap-10 border-b border-border">
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
      <footer className="w-full h-22.75 px-5 pt-4 pb-5">
        <Button
          variant="default"
          type="submit"
          form="edit-project-form"
          className="w-full"
          disabled={
            isPending ||
            !form.isChange ||
            !form.title.trim() ||
            !form.range?.from ||
            !form.range?.to
          }
        >
          수정완료
        </Button>
      </footer>

      {/* 여행 기간 축소 확인 다이얼로그 */}
      <AppAlertDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="여행 날짜가 줄어들어요"
        description="여행 날짜를 줄이면 일부 일차/일정이 삭제될 수 있어요. 계속 진행할까요?"
        actionLabel="수정하기"
        onAction={handleConfirm}
      />
    </div>
  );
};

export default ProjectEditPage;
