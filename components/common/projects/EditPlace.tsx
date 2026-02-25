"use client";

import CandidateGroup, {
  EditCandidateItem,
} from "@/components/card/CandidateGroup";
import { PlaceType } from "@/components/card/PlaceTypeIcon";
import PlanPlaceCard from "@/components/card/PlanPlaceCard";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils/utils";
import { Pencil, Trash2, Vote } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type SingleCandidateCard = {
  blockId: string;
  placeType: PlaceType;
  placeName: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  memo?: string;
};

interface EditPlaceProps {
  timeBlockId: string;
  /** 이 블록이 PLACE인지 FREE인지 */
  blockType: "PLACE" | "FREE";
  /** FREE 블록이거나, PLACE 블록에서 단일 후보 카드 */
  singleCard: SingleCandidateCard;
  /** 후보지 목록(PLACE 블록에서만) */
  candidates: EditCandidateItem[];
  isLast?: boolean;
  className?: string;
}

const EditPlace = ({
  timeBlockId,
  blockType,
  singleCard,
  candidates,
  isLast = false,
  className,
}: EditPlaceProps) => {
  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const planId = params.planId;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [targetBlockId, setTargetBlockId] = useState<string | null>(null);

  const isMultiCandidate = blockType === "PLACE" && candidates.length >= 2;

  const openSheetFor = (blockId: string) => {
    setTargetBlockId(blockId);
    setSheetOpen(true);
  };

  // 바텀시트 메뉴들
  const menuItems = [
    {
      id: "edit",
      label: "날짜/시간 수정",
      icon: <Pencil />,
      onSelect: () => {
        if (!targetBlockId) return;
        console.log("날짜/시간 수정", targetBlockId);
      },
    },
    ...(blockType === "PLACE"
      ? [
          {
            id: "add-candidate",
            label: "후보지 추가하기",
            icon: <Vote />,
            onSelect: () => {
              if (!timeBlockId) return;
              router.push(
                `/projects/${planId}/candidate-select/${timeBlockId}`,
              );
            },
          },
        ]
      : []),
    {
      id: "delete",
      label: "삭제",
      icon: <Trash2 />,
      onSelect: () => {
        if (!targetBlockId) return;
        console.log("삭제", targetBlockId);
      },
    },
  ];

  return (
    <div
      className={cn(
        "flex items-center ml-0.75 border-l",
        isLast ? "border-transparent" : "border-[#D9D9D9]",
        className,
      )}
    >
      <div className="pl-6 pt-2 pb-4 flex-1 min-w-0">
        {isMultiCandidate ? (
          // 후보 2개 이상이면 CandidateGroup
          <CandidateGroup
            mode="edit"
            candidates={candidates}
            onCandidateMenuClick={openSheetFor}
          />
        ) : (
          // 후보 1개, 혹은 자유시간이면 PlanPlaceCard
          <PlanPlaceCard
            placeType={singleCard.placeType}
            placeName={singleCard.placeName}
            writerNickname={singleCard.writerNickname}
            writerProfileImageUrl={singleCard.writerProfileImageUrl}
            memo={singleCard.memo}
            onMenuClick={() => openSheetFor(singleCard.blockId)}
            isView={false}
          />
        )}
      </div>
      {/* 블록 메뉴 바텀시트 */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        items={menuItems}
        cancelLabel="취소"
      />
    </div>
  );
};

export default EditPlace;
