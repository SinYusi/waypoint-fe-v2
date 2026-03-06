"use client";

import { useState } from "react";

import AppAlertDialog from "@/components/common/AppAlertDialog";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import OpinionBottomSheet from "@/components/common/OpinionBottomSheet";
import OpinionCard from "@/components/common/OpinionCard";
import OpinionProfile from "@/components/common/OpinionProfile";
import {
  type BlockOpinion,
  type OpinionCategoryKey,
  type OpinionState,
} from "@/lib/opinion-bottom-sheet";
import {
  useUpdateBlockOpinion,
  useDeleteBlockOpinion,
} from "@/lib/hooks/use-block-opinion";
import { cn } from "@/lib/utils/utils";

const CUSTOM_INPUT_REASON_ID = 0;
const EMPTY_REASON_IDS: number[] = [];

/* --------------------------------------------------------
   의견 아이템
-------------------------------------------------------- */
function OpinionItem({
  opinion,
  myMemberId,
  categoryKey,
  onEdit,
  onDelete,
}: {
  opinion: BlockOpinion;
  myMemberId?: string;
  categoryKey: OpinionCategoryKey;
  onEdit?: (opinion: BlockOpinion) => void;
  onDelete?: (opinion: BlockOpinion) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2.25">
      <OpinionProfile
        nickname={opinion.added_by.nickname}
        picture={opinion.added_by.picture}
        isOwn={myMemberId === opinion.added_by.plan_member_id}
        onEdit={() => onEdit?.(opinion)}
        onDelete={() => onDelete?.(opinion)}
      />
      <OpinionCard opinion={opinion} categoryKey={categoryKey} />
    </div>
  );
}

/* --------------------------------------------------------
   PlaceOpinionBottomSheet
-------------------------------------------------------- */
type PlaceOpinionBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId?: string;
  blockId?: string;
  myMemberId?: string;
  opinions?: BlockOpinion[];
  categoryKey: OpinionCategoryKey;
  className?: string;
};

function PlaceOpinionBottomSheet({
  open,
  onOpenChange,
  planId,
  blockId,
  myMemberId,
  opinions = [],
  categoryKey,
  className,
}: PlaceOpinionBottomSheetProps) {
  const closeListSheet = () => onOpenChange(false);

  // 수정
  const [editingOpinion, setEditingOpinion] = useState<BlockOpinion | null>(
    null,
  );
  const [editCurrentState, setEditCurrentState] =
    useState<OpinionState>("POSITIVE");
  const [editCurrentReasonIds, setEditCurrentReasonIds] =
    useState<number[]>(EMPTY_REASON_IDS);
  const [editCurrentCustomText, setEditCurrentCustomText] = useState("");

  // 삭제
  const [deletingOpinion, setDeletingOpinion] = useState<BlockOpinion | null>(
    null,
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const updateMutation = useUpdateBlockOpinion({ planId, blockId });
  const deleteMutation = useDeleteBlockOpinion({ planId, blockId });

  const editEffectiveCustomText = editCurrentReasonIds.includes(
    CUSTOM_INPUT_REASON_ID,
  )
    ? editCurrentCustomText
    : "";

  const hasChanged = editingOpinion
    ? editCurrentState !== editingOpinion.type ||
      editEffectiveCustomText !== (editingOpinion.comment ?? "") ||
      JSON.stringify(
        [
          ...editCurrentReasonIds.filter((id) => id !== CUSTOM_INPUT_REASON_ID),
        ].sort((a, b) => a - b),
      ) !==
        JSON.stringify(
          [...editingOpinion.tag_ids.map(Number)].sort((a, b) => a - b),
        )
    : false;

  const handleOpenEditor = (opinion: BlockOpinion) => {
    closeListSheet();

    setEditCurrentState(opinion.type);
    setEditCurrentReasonIds([
      ...opinion.tag_ids.map(Number),
      ...(opinion.comment ? [CUSTOM_INPUT_REASON_ID] : []),
    ]);
    setEditCurrentCustomText(opinion.comment ?? "");
    setEditingOpinion(opinion);
  };

  const handleOpenDeleteConfirm = (opinion: BlockOpinion) => {
    setDeletingOpinion(opinion);
    setDeleteConfirmOpen(true);
  };

  const closeEditor = () => {
    setEditingOpinion(null);
    setDeletingOpinion(null);
    setDeleteConfirmOpen(false);
  };

  const handleConfirmUpdate = () => {
    if (!editingOpinion || updateMutation.isPending || !hasChanged) return;

    const hasCustomInput = editCurrentReasonIds.includes(
      CUSTOM_INPUT_REASON_ID,
    );
    const tagIds = editCurrentReasonIds
      .filter((id) => id !== CUSTOM_INPUT_REASON_ID)
      .map(String);

    updateMutation.mutate(
      {
        opinionId: editingOpinion.opinion_Id,
        payload: {
          type: editCurrentState,
          tag_ids: tagIds,
          ...(hasCustomInput
            ? { comment: editCurrentCustomText.trim() }
            : { comment: "" }),
        },
      },
      { onSuccess: closeEditor },
    );
  };

  return (
    <>
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        cancelLabel="닫기"
        cancelVariant="default"
        showDivider={false}
        showBottomGradient
        className={cn("max-h-165.5 w-full rounded-t-3xl", className)}
        content={
          <div className="flex flex-col gap-4">
            {opinions.length === 0 ? (
              <div className="flex h-32 items-center justify-center typography-body-sm-reg text-muted-foreground">
                의견이 없어요
              </div>
            ) : (
              opinions.map((opinion) => (
                <OpinionItem
                  key={opinion.opinion_Id}
                  opinion={opinion}
                  myMemberId={myMemberId}
                  categoryKey={categoryKey}
                  onEdit={handleOpenEditor}
                  onDelete={handleOpenDeleteConfirm}
                />
              ))
            )}
          </div>
        }
      />

      {/* 의견 수정 바텀시트 */}
      {editingOpinion && (
        <OpinionBottomSheet
          open={!!editingOpinion}
          onOpenChange={(o) => {
            if (!o) setEditingOpinion(null);
          }}
          categoryKey={categoryKey}
          state={editCurrentState}
          selectedReasonIds={editCurrentReasonIds}
          customInputText={editCurrentCustomText}
          onStateChange={(s) => {
            setEditCurrentState(s);
            if (editingOpinion && s === editingOpinion.type) {
              setEditCurrentReasonIds([
                ...editingOpinion.tag_ids.map(Number),
                ...(editingOpinion.comment ? [CUSTOM_INPUT_REASON_ID] : []),
              ]);
              setEditCurrentCustomText(editingOpinion.comment ?? "");
            } else {
              setEditCurrentReasonIds([]);
              setEditCurrentCustomText("");
            }
          }}
          onSelectedReasonIdsChange={setEditCurrentReasonIds}
          onCustomInputTextChange={setEditCurrentCustomText}
          cancelLabel="의견 삭제"
          confirmLabel="수정 완료"
          closeOnCancel={false}
          confirmDisabled={!hasChanged || updateMutation.isPending}
          onCancel={() => setDeleteConfirmOpen(true)}
          onConfirm={handleConfirmUpdate}
        />
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AppAlertDialog
        open={deleteConfirmOpen}
        onOpenChange={(o) => {
          if (!o) closeEditor();
        }}
        title="의견을 삭제하시겠습니까?"
        description="의견 삭제 후엔 남겼던 의견 데이터를 되돌릴 수 없어요."
        cancelLabel="취소"
        onCancel={closeEditor}
        actionLabel="삭제하기"
        actionDisabled={deleteMutation.isPending}
        onAction={() => {
          const target = deletingOpinion ?? editingOpinion;
          if (!target || deleteMutation.isPending) return;
          closeListSheet();
          deleteMutation.mutate(
            { opinionId: target.opinion_Id },
            { onSuccess: closeEditor },
          );
        }}
      />
    </>
  );
}

export default PlaceOpinionBottomSheet;
export type { PlaceOpinionBottomSheetProps };
