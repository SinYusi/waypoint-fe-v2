"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import OpinionCard from "@/components/common/OpinionCard";
import OpinionProfile from "@/components/common/OpinionProfile";
import { type BlockOpinion } from "@/lib/opinion-bottom-sheet";
import { cn } from "@/lib/utils/utils";

/* --------------------------------------------------------
   의견 아이템
-------------------------------------------------------- */
function OpinionItem({ opinion }: { opinion: BlockOpinion }) {
  return (
    <div className="flex w-full flex-col gap-2.25">
      <OpinionProfile
        nickname={opinion.added_by.nickname}
        picture={opinion.added_by.picture}
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
  className?: string;
};

function PlaceOpinionBottomSheet({
  open,
  onOpenChange,
  opinions = [],
  className,
}: PlaceOpinionBottomSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      cancelLabel="닫기"
      cancelVariant="default"
      showDivider={false}
      className={cn("h-165.5 w-full rounded-t-3xl", className)}
      content={
        <div className="flex flex-col gap-4">
          {opinions.length === 0 ? (
            <div className="flex h-32 items-center justify-center typography-body-sm-reg text-muted-foreground">
              의견이 없어요
            </div>
          ) : (
            opinions.map((opinion) => (
              <OpinionItem key={opinion.opinion_Id} opinion={opinion} />
            ))
          )}
        </div>
      }
    />
  );
}

export default PlaceOpinionBottomSheet;
export type { PlaceOpinionBottomSheetProps };
