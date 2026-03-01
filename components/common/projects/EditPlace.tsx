"use client";

import CandidateGroup, {
  EditCandidateItem,
} from "@/components/card/CandidateGroup";
import { PlaceType } from "@/components/card/PlaceTypeIcon";
import PlanPlaceCard from "@/components/card/PlanPlaceCard";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useDeleteCandidate } from "@/lib/hooks/use-delete-candidate";
import { useDeleteTimeBlock } from "@/lib/hooks/use-delete-time-block";
import { cn } from "@/lib/utils/utils";
import { ProblemDetail } from "@/types/problem-detail";
import { AxiosError } from "axios";
import { Pencil, Trash2, Vote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SingleCandidateCard = {
  blockId: string;
  placeType: PlaceType;
  placeName: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  candidateCount?: number;
  memo?: string;
};

interface EditPlaceProps {
  planId: string;
  timeBlockId: string;
  day: number;
  blockStatus: "FIXED" | "PENDING" | "DIRECT";
  /** 이 블록이 PLACE인지 FREE인지 */
  blockType: "PLACE" | "FREE";
  /** FREE 블록이거나, PLACE 블록에서 단일 후보 카드 */
  singleCard: SingleCandidateCard;
  /** 후보지 목록(PLACE 블록에서만) */
  candidates: EditCandidateItem[];
  /** 날짜/시간 수정 메뉴 핸들러 */
  onEditClick?: (blockId: string) => void;
  isLast?: boolean;
  className?: string;
}

const EditPlace = ({
  planId,
  timeBlockId,
  day,
  blockStatus,
  blockType,
  singleCard,
  candidates,
  onEditClick,
  isLast = false,
  className,
}: EditPlaceProps) => {
  const router = useRouter();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [targetBlockId, setTargetBlockId] = useState<string | null>(null);

  const isMultiCandidate = blockType === "PLACE" && candidates.length >= 2;

  const openSheetFor = (blockId: string) => {
    setTargetBlockId(blockId);
    setSheetOpen(true);
  };

  const onApiError = (err: unknown, fallback: string) => {
    const axiosErr = err as AxiosError<ProblemDetail>;
    const message =
      axiosErr.response?.data?.errors?.[0]?.reason ??
      axiosErr.response?.data?.detail ??
      fallback;
    toast.error(message);
  };

  // blockStatus === PENDING일 때 후보지 삭제
  const { mutate: deleteCandidate, isPending: isDeletingCandidate } =
    useDeleteCandidate({
      mutationOptions: {
        onSuccess: () => {
          setSheetOpen(false);
          setTargetBlockId(null);
          toast("후보지를 삭제했어요.");
        },
        onError: (e) => onApiError(e, "후보지 삭제에 실패했어요."),
      },
    });

  // 그 외에는 타임블록 삭제
  const { mutate: deleteTimeBlock, isPending: isDeletingTimeBlock } =
    useDeleteTimeBlock({
      mutationOptions: {
        onSuccess: () => {
          setSheetOpen(false);
          setTargetBlockId(null);
          toast("일정을 삭제했어요.");
        },
        onError: (e) => onApiError(e, "블록 삭제에 실패했어요."),
      },
    });

  const isDeleting = isDeletingCandidate || isDeletingTimeBlock;

  const handleDelete = () => {
    if (isDeleting) return;

    if (blockStatus === "PENDING") {
      if (!targetBlockId) return;
      deleteCandidate({
        planId,
        timeBlockId,
        blockId: targetBlockId,
        day,
      });
      return;
    }

    // FIXED / DIRECT
    deleteTimeBlock({
      planId,
      timeBlockId,
      day,
    });
  };

  // 바텀시트 메뉴들
  const menuItems = [
    ...(blockStatus !== "PENDING"
      ? [
          {
            id: "edit",
            label: "날짜/시간 수정",
            icon: <Pencil />,
            onSelect: () => {
              if (!targetBlockId) return;
              setSheetOpen(false);
              onEditClick?.(targetBlockId);
            },
          },
        ]
      : []),
    ...(blockType === "PLACE" &&
    (blockStatus === "DIRECT" || blockStatus === "FIXED")
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
      onSelect: handleDelete,
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
        {blockStatus === "FIXED" ? (
          // 후보지 확정 상태 전용 카드
          <PlanPlaceCard
            placeType={singleCard.placeType}
            placeName={singleCard.placeName}
            writerNickname={singleCard.writerNickname}
            writerProfileImageUrl={singleCard.writerProfileImageUrl}
            memo={singleCard.memo}
            isView={false}
            isFixedCandidate
            candidateCount={singleCard.candidateCount}
            onReselectCandidate={() => {
              // TODO: 추후 후보지 변경 페이지로 이동
            }}
            onMenuClick={() => openSheetFor(singleCard.blockId)}
          />
        ) : isMultiCandidate ? (
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
