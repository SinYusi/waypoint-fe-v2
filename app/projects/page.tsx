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
import { usePlans } from "@/lib/hooks/project/plan/use-plans";
import { useCallback, useMemo, useState } from "react";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { formatDateRange } from "@/lib/utils/date";
import { useDeletePlan } from "@/lib/hooks/project/plan/use-delete-plan";
import { toast } from "sonner";

const ProjectPage = () => {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePlans({ size: 10 });

  const plans = useMemo(() => {
    return data?.pages.flatMap((p) => p.contents) ?? [];
  }, [data]);

  const errorMessage =
    error?.response?.data?.detail ?? "여행 계획을 불러오지 못했어요.";

  const isEmpty = !isLoading && !isError && plans.length === 0;

  const handleProjectCreate = () => router.push("/projects/create");

  const handleFetchNext = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const loadMoreRef = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage && !isLoading && !isError,
    onIntersect: handleFetchNext,
  });

  const openDeleteDialog = (planId: string) => {
    setDeleteTargetId(planId);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const { mutate: deleteMutate, isPending: isDeleting } = useDeletePlan({
    onSuccess: () => {
      closeDeleteDialog();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.detail ?? err?.message ?? "삭제에 실패했어요.",
      );
    },
  });

  const handleConfirmDelete = () => {
    if (!deleteTargetId || isDeleting) return;

    deleteMutate({ planId: deleteTargetId });
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
          isEmpty && "items-center justify-center gap-12",
        )}
      >
        {/* 타이틀 */}
        {!isLoading && !isError && !isEmpty && (
          <h2 className="typography-display-2xl">
            우리의 여행 이야기를 <br />
            함께 그려요
          </h2>
        )}

        {/* 로딩 */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center typography-display-lg-reg text-muted-foreground">
            여행 계획을 불러오는 중...
          </div>
        )}

        {/* 에러 */}
        {isError && (
          <div className="flex flex-col flex-1 gap-3 items-center justify-center typography-display-lg-reg">
            <p className="typography-body-base text-destructive">
              {errorMessage}
            </p>
            <Button onClick={() => refetch()}>다시 시도</Button>
          </div>
        )}

        {isEmpty ? (
          <>
            {/* 프로젝트가 없을 경우 */}
            <div className="flex flex-col items-center gap-5">
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
            </Button>
          </>
        ) : (
          <>
            {/* 프로젝트 목록 */}
            {!isLoading && !isError && plans.length > 0 && (
              <>
                <div className="flex flex-col gap-8 pt-8 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                  {plans.map((p) => (
                    <div key={p.plan_id}>
                      <PlanCard
                        title={p.title ?? ""}
                        memberCount={p.member_count}
                        dateRange={formatDateRange(p.start_date, p.end_date)}
                        imageSrc={p.thumbnail}
                        onClick={() => router.push(`/projects/${p.plan_id}`)}
                        onEdit={() =>
                          router.push(`/projects/${p.plan_id}/edit`)
                        }
                        onDelete={() => openDeleteDialog(p.plan_id)}
                      />
                    </div>
                  ))}
                </div>
                <div ref={loadMoreRef} className="h-10" />
              </>
            )}
          </>
        )}
      </main>

      {/* 하단 고정 버튼 */}
      {!isLoading && !isError && !isEmpty && (
        <div className="fixed bottom-14 px-4 pb-9 w-full bg-gradient-bottom-fade z-50">
          <Button onClick={handleProjectCreate} className="w-full">
            <Plus className="text-foreground opacity-40" /> 여행 계획 추가하기
          </Button>
        </div>
      )}

      {/* 네비게이션 바 */}
      <NavigationBar className="fixed bottom-0 z-50 inset-x-0" />

      {/* 삭제 확인 다이얼로그 */}
      <AppAlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setDeleteTargetId(null);
        }}
        title="정말 이 여행 계획을 삭제하시겠어요?"
        description={
          "삭제한 여행 계획은 다시 복구가 불가능합니다.\n그래도 정말 여행 계획을 삭제하시겠어요?"
        }
        cancelLabel="취소"
        actionLabel="삭제하기"
        onCancel={closeDeleteDialog}
        onAction={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectPage;
