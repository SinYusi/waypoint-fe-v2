"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { usePlanCollections } from "@/lib/hooks/plan-collection/use-plan-collections";
import { Download } from "lucide-react";
import CollectionEmptyIllust from "@/public/illust/collection-empty.svg";
import { useParams, useRouter } from "next/navigation";
import CollectionManageItem from "@/components/common/CollectionManageItem";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import { useState } from "react";
import { useDeletePlanCollection } from "@/lib/hooks/plan-collection/use-delete-plan-collection";
import { toast } from "sonner";

const CollectionManagePage = () => {
  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const planId = params.planId;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 플랜에 연결된 컬렉션 조회
  const { data, isLoading, isError, error } = usePlanCollections(planId);

  // 플랜에 연결된 컬렉션 삭제
  const { mutate: deleteMutate, isPending: isDeleting } =
    useDeletePlanCollection({
      onSuccess: () => {
        closeDeleteDialog();
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.detail ?? err?.message ?? "삭제에 실패했어요.",
        );
      },
    });

  const openDeleteDialog = (collectionId: string) => {
    setDeleteTargetId(collectionId);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId || isDeleting) return;

    deleteMutate({ planId: planId, collectionId: deleteTargetId });
  };

  return (
    <div className="flex flex-col pt-20 gap-2.5">
      <Header
        variant="center"
        title="보관함 관리"
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed top-0 inset-x-0 bg-background z-50"
      />

      <main className="flex flex-1 flex-col px-5 pt-3 pb-3.5 gap-3.5 mb-3">
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center text-muted-foreground">
            보관함 불러오는 중...
          </div>
        ) : isError ? (
          <div className="fixed inset-0 flex items-center justify-center text-destructive">
            {error.response?.data.detail ?? "알 수 없는 오류"}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="fixed top-15 inset-0 flex flex-col gap-5 items-center justify-center -mt-15">
            <CollectionEmptyIllust />
            <div className="flex flex-col gap-2 items-center justify-center">
              <h2 className="typography-display-lg-bold">
                연결된 보관함이 없어요
              </h2>
              <span className="typography-body-sm-md">
                보관함을 연결해서 미리 담아둔 장소를 불러올 수 있어요
              </span>
            </div>
          </div>
        ) : (
          <>
            {data.map((c) => (
              <CollectionManageItem
                key={c.collection_id}
                title={c.title}
                nickname={c.added_by.nickname}
                src={c.added_by.picture}
                onClick={() => openDeleteDialog(c.collection_id)}
              />
            ))}
          </>
        )}
      </main>

      {/* 하단 고정 버튼 */}
      <footer className="fixed bottom-0 inset-x-0 flex flex-col">
        <div className="w-full h-12 bg-[linear-gradient(180deg,rgba(252,252,252,0)_0%,rgba(252,252,252,1)_100%)] -mb-px" />
        <div className="w-full h-22.75 px-5 pt-4 pb-5 bg-background drop-shadow-[0px_-0.75px_0px_0px_#DEDEDE]">
          <Button
            variant="default"
            onClick={() =>
              router.push(
                `/projects/${planId}/collection-manage/add-collections`,
              )
            }
            className="w-full"
          >
            <Download className="text-foreground opacity-40" />
            보관함 불러오기
          </Button>
        </div>
      </footer>

      {/* 삭제 확인 다이얼로그 */}
      <AppAlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setDeleteTargetId(null);
          }
        }}
        title="보관함을 삭제하시겠어요?"
        description={
          "보관함에서 추가한 장소들이 사라질 수 있어요.\n그래도 정말 삭제하시겠어요?"
        }
        cancelLabel="취소"
        actionLabel="삭제"
        onCancel={closeDeleteDialog}
        onAction={handleConfirmDelete}
      />
    </div>
  );
};

export default CollectionManagePage;
