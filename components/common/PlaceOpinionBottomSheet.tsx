"use client";

import { useState } from "react";

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
  onEdit,
}: {
  opinion: BlockOpinion;
  myMemberId?: string;
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
      <OpinionCard opinion={opinion} />
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

  const handleEdit = (opinion: BlockOpinion) => {
    setEditingOpinion(opinion);
  };

  // 기존 의견 → OpinionBottomSheet 초기값 변환
  const editState = editingOpinion?.type as OpinionState | undefined;
  const editSelectedReasonIds = editingOpinion
    ? [
        ...editingOpinion.tag_ids.map(Number),
        ...(editingOpinion.comment ? [CUSTOM_INPUT_REASON_ID] : []),
      ]
    : [];
  const editCustomInputText = editingOpinion?.comment ?? "";
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
        state={editState}
        selectedReasonIds={editSelectedReasonIds}
        customInputText={editCustomInputText}
        cancelLabel="의견 삭제"
        confirmLabel="수정 완료"
      />
    )}
    </>
  );
}

export default PlaceOpinionBottomSheet;
export type { PlaceOpinionBottomSheetProps };
