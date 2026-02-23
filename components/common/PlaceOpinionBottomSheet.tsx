"use client";

import { useState } from "react";

import AppAlertDialog from "@/components/common/AppAlertDialog";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import OpinionBottomSheet from "@/components/common/OpinionBottomSheet";
import OpinionCard from "@/components/common/OpinionCard";
import OpinionProfile from "@/components/common/OpinionProfile";
import { type BlockOpinion, type OpinionCategoryKey, type OpinionState } from "@/lib/opinion-bottom-sheet";
import { cn } from "@/lib/utils/utils";

const CUSTOM_INPUT_REASON_ID = 0;

/* --------------------------------------------------------
   의견 아이템
-------------------------------------------------------- */
function OpinionItem({
  opinion,
  myMemberId,
  categoryKey,
  onEdit,
}: {
  opinion: BlockOpinion;
  myMemberId?: string;
  categoryKey: OpinionCategoryKey;
  onEdit?: (opinion: BlockOpinion) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2.25">
      <OpinionProfile
        nickname={opinion.added_by.nickname}
        picture={opinion.added_by.picture}
        isOwn={myMemberId === opinion.added_by.plan_member_id}
        onEdit={() => onEdit?.(opinion)}
        onDelete={() => onEdit?.(opinion)}
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
  opinions?: BlockOpinion[];
  myMemberId?: string;
  categoryKey: OpinionCategoryKey;
  className?: string;
};

function PlaceOpinionBottomSheet({
  open,
  onOpenChange,
  opinions = [],
  myMemberId,
  categoryKey,
  className,
}: PlaceOpinionBottomSheetProps) {
  const [editingOpinion, setEditingOpinion] = useState<BlockOpinion | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // 편집 중인 현재 값 (변경 감지용)
  const [editCurrentState, setEditCurrentState] = useState<OpinionState>("POSITIVE");
  const [editCurrentReasonIds, setEditCurrentReasonIds] = useState<number[]>([]);
  const [editCurrentCustomText, setEditCurrentCustomText] = useState("");

  // 원본과 비교해 변경 여부 판단
  const hasChanged = editingOpinion
    ? editCurrentState !== editingOpinion.type ||
      editCurrentCustomText !== (editingOpinion.comment ?? "") ||
      JSON.stringify(
        [...editCurrentReasonIds.filter((id) => id !== CUSTOM_INPUT_REASON_ID)].sort((a, b) => a - b),
      ) !==
        JSON.stringify(
          [...editingOpinion.tag_ids.map(Number)].sort((a, b) => a - b),
        )
    : false;

  const handleEdit = (opinion: BlockOpinion) => {
    // 클릭 시 현재 편집 값을 원본으로 초기화
    setEditCurrentState(opinion.type);
    setEditCurrentReasonIds([
      ...opinion.tag_ids.map(Number),
      ...(opinion.comment ? [CUSTOM_INPUT_REASON_ID] : []),
    ]);
    setEditCurrentCustomText(opinion.comment ?? "");
    setEditingOpinion(opinion);
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
      className={cn("h-165.5 w-full rounded-t-3xl", className)}
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
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      }
    />

    {editingOpinion && (
      <OpinionBottomSheet
        open={!!editingOpinion}
        onOpenChange={(o) => { if (!o) setEditingOpinion(null); }}
        categoryKey={categoryKey}
        state={editCurrentState}
        selectedReasonIds={editCurrentReasonIds}
        customInputText={editCurrentCustomText}
        onStateChange={(s) => {
            setEditCurrentState(s);
            if (editingOpinion && s === editingOpinion.type) {
              // 원본 타입으로 돌아오면 원본 선택 복원
              setEditCurrentReasonIds([
                ...editingOpinion.tag_ids.map(Number),
                ...(editingOpinion.comment ? [CUSTOM_INPUT_REASON_ID] : []),
              ]);
              setEditCurrentCustomText(editingOpinion.comment ?? "");
            } else {
              // 다른 타입으로 이동하면 리셋
              setEditCurrentReasonIds([]);
              setEditCurrentCustomText("");
            }
          }}
        onSelectedReasonIdsChange={setEditCurrentReasonIds}
        onCustomInputTextChange={setEditCurrentCustomText}
        cancelLabel="의견 삭제"
        confirmLabel="수정 완료"
        closeOnCancel={false}
        onCancel={() => setDeleteConfirmOpen(true)}
        confirmDisabled={!hasChanged}
      />
    )}

    <AppAlertDialog
      open={deleteConfirmOpen}
      onOpenChange={setDeleteConfirmOpen}
      title="의견을 삭제하시겠습니까?"
      description={`의견 삭제 후엔 남겼던 의견 데이터를 되돌릴 수 없어요.`}
      cancelLabel="취소"
      onCancel={() => setDeleteConfirmOpen(false)}
      actionLabel="삭제하기"
      onAction={() => {
        setDeleteConfirmOpen(false);
        setEditingOpinion(null);
      }}
    />
    </>
  );
}

export default PlaceOpinionBottomSheet;
export type { PlaceOpinionBottomSheetProps };
