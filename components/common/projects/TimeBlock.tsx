"use client";

import PlanTime from "./PlanTime";
import { EditCandidateItem } from "@/components/card/CandidateGroup";
import { PlaceType } from "@/components/card/PlaceTypeIcon";
import EditPlace from "./EditPlace";
import { Pencil, Trash2, Vote } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useUpdateBlock } from "@/lib/hooks/use-block-detail";
import { UpdateBlockRequest } from "@/lib/api/block";
import PlanEditBottomSheet from "../PlanEditBottomSheet";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProblemDetail } from "@/types/problem-detail";
import { AxiosError } from "axios";
import { blockListQueryKey } from "@/lib/hooks/use-block-list";
import { useDeleteTimeBlock } from "@/lib/hooks/use-delete-time-block";

interface TimeBlockProps {
  planId: string;
  day: number;
  timeBlockId: string;
  blockType: "PLACE" | "FREE";
  blockStatus: "FIXED" | "PENDING" | "DIRECT";
  startTime: string;
  endTime: string;
  address: string;
  isFirst?: boolean;
  isLast?: boolean;
  isFree?: boolean;

  singleCard: {
    blockId: string;
    placeType: PlaceType;
    placeName: string;
    writerNickname: string;
    writerProfileImageUrl: string;
    candidateCount?: number;
    memo?: string;
    onMenuClick?: () => void;
  };
  candidates: EditCandidateItem[];
}

const TimeBlock = ({
  planId,
  day,
  timeBlockId,
  blockType,
  blockStatus,
  startTime,
  endTime,
  address,
  isFirst,
  isLast,
  isFree,
  singleCard,
  candidates,
}: TimeBlockProps) => {
  const router = useRouter();
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [targetBlockId, setTargetBlockId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const openMenuSheetFor = (blockId: string) => {
    setTargetBlockId(blockId);
    setMenuSheetOpen(true);
  };

  // 블록 수정 훅
  const { mutate: updateBlock } = useUpdateBlock({
    planId,
    blockId: targetBlockId ?? undefined,
    mutationOptions: {
      onSuccess: (_data, variables) => {
        setEditSheetOpen(false);

        const oldDay = day;
        const newDay = variables.day ? Number(variables.day) : oldDay;

        // 수정 전 day 갱신
        queryClient.invalidateQueries({
          queryKey: blockListQueryKey(planId, {
            day: oldDay,
            page: 0,
            size: 20,
          }),
          exact: false,
          refetchType: "active",
        });

        // 수정 후 day 갱신 (day 이동 시)
        if (newDay !== oldDay) {
          queryClient.invalidateQueries({
            queryKey: blockListQueryKey(planId, {
              day: newDay,
              page: 0,
              size: 20,
            }),
            exact: false,
            refetchType: "active",
          });
        }
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<ProblemDetail>;
        const message =
          axiosErr.response?.data?.errors?.[0]?.reason ??
          axiosErr.response?.data?.detail ??
          "수정에 실패했어요.";

        toast.error(message);
      },
    },
  });

  const { mutate: deleteTimeBlockMutate } = useDeleteTimeBlock({
    mutationOptions: {
      onSuccess: () => {
        setMenuSheetOpen(false);
        setTargetBlockId(null);

        queryClient.invalidateQueries({
          queryKey: blockListQueryKey(planId, { day, page: 0, size: 20 }),
          exact: false,
          refetchType: "active",
        });

        toast("일정을 삭제했어요.");
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<ProblemDetail>;
        const message =
          axiosErr.response?.data?.errors?.[0]?.reason ??
          axiosErr.response?.data?.detail ??
          "삭제에 실패했어요.";

        toast.error(message);
      },
    },
  });

  const handleSubmitEdit = (payload: {
    day?: number;
    startTime?: string;
    endTime?: string;
  }) => {
    if (!targetBlockId) return;

    const req: UpdateBlockRequest = {};

    if (payload.day !== undefined) req.day = String(payload.day);
    if (payload.startTime) req.start_time = payload.startTime;
    if (payload.endTime) req.end_time = payload.endTime;

    updateBlock(req);
  };

  // 후보지 있는 블록 바텀시트 메뉴들
  const menuItems = [
    {
      id: "edit",
      label: "날짜/시간 수정",
      icon: <Pencil />,
      onSelect: () => {
        if (!targetBlockId) return;
        setMenuSheetOpen(false);
        setEditSheetOpen(true);
      },
    },
    {
      id: "add-candidate",
      label: "후보지 추가하기",
      icon: <Vote />,
      onSelect: () => {
        if (!timeBlockId) return;
        router.push(`/projects/${planId}/candidate-select/${timeBlockId}`);
      },
    },
    {
      id: "delete",
      label: "삭제",
      icon: <Trash2 />,
      onSelect: () => {
        deleteTimeBlockMutate({
          planId,
          timeBlockId,
          day,
          page: 0,
          size: 20,
        });
      },
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 타임라인(시간/주소) */}
      <PlanTime
        blockStatus={blockStatus}
        startTime={startTime}
        address={address}
        isFirst={isFirst}
        isLast={isLast}
        isFree={isFree}
        onMenuClick={() => {
          const blockId = candidates?.[0]?.blockId;
          if (!blockId) return;
          openMenuSheetFor(blockId);
        }}
      />

      {/* 오른쪽 카드 영역 */}
      <EditPlace
        planId={planId}
        day={day}
        blockStatus={blockStatus}
        blockType={blockType}
        timeBlockId={timeBlockId}
        singleCard={singleCard}
        candidates={candidates}
        onEditClick={(blockId) => {
          setTargetBlockId(blockId);
          setEditSheetOpen(true);
        }}
        isLast={isLast}
      />

      {/* 블록 메뉴 바텀시트 */}
      <BottomSheet
        open={menuSheetOpen}
        onOpenChange={setMenuSheetOpen}
        items={menuItems}
        cancelLabel="취소"
      />

      {/* 날짜/시간 수정 바텀시트 */}
      <PlanEditBottomSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        onSubmit={handleSubmitEdit}
        defaultDay={`${day}일차`}
        defaultStartTime={startTime}
        defaultEndTime={endTime}
      />
    </div>
  );
};

export default TimeBlock;
