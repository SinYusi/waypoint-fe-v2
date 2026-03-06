"use client";

import { PlaceType } from "@/components/card/PlaceTypeIcon";
import TimeBlock from "./TimeBlock";
import {
  EditCandidateItem,
  ViewCandidateItem,
} from "@/components/card/CandidateGroup";
import { BlockListResponse, BlockOpinionType } from "@/lib/api/block";
import { useBlockListInfinite } from "@/lib/hooks/use-block-list-infinite";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { ReactionType } from "@/components/card/PlaceReactionItem";
import ViewTimeBlock from "./ViewTimeBlock";

const toPlaceType = (
  blockType: "PLACE" | "FREE",
  categoryName?: string,
): PlaceType => {
  if (blockType === "FREE") return "자유시간";
  return (categoryName ?? "기타") as PlaceType;
};

const toReactionType = (
  t: BlockOpinionType | null,
): ReactionType | undefined => {
  if (!t) return undefined;
  if (t === "POSITIVE") return "good";
  if (t === "NEUTRAL") return "normal";
  return "bad";
};

interface DayTimeBlocksProps {
  planId: string;
  day: number;
  data?: BlockListResponse;
  enabled?: boolean;
  isEdit?: boolean;
}

const DayTimeBlocks = ({
  planId,
  day,
  data: prefetched,
  enabled = true,
  isEdit = false,
}: DayTimeBlocksProps) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBlockListInfinite({
    planId,
    params: { day, size: 10 },
    enabled,
    queryOptions: {
      initialData: prefetched,
    },
  });

  // 모든 페이지 contents 합치기
  const blocks = data?.pages.flatMap((p) => p.contents ?? []) ?? [];

  // 무한스크롤 sentinel
  const sentinelRef = useIntersectionObserver({
    enabled: enabled && Boolean(hasNextPage) && !isFetchingNextPage,
    onIntersect: () => {
      if (!hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    },
    rootMargin: "200px",
    threshold: 0,
  });

  if (blocks.length === 0 && isLoading) {
    return <div className="px-5 py-4 flex items-center">로딩중...</div>;
  }
  if (isError) {
    return (
      <div className="px-5 py-4 text-destructive flex items-center">
        불러오기 실패
      </div>
    );
  }

  return (
    <div className="relative flex flex-col rounded-t-2xl px-5 pt-4 pb-6">
      {blocks.map((block, index) => {
        const isFirst = index === 0;
        const isLast = index === blocks.length - 1;

        const selected = block.selectedBlock;
        const single = selected ?? block.candidates[0] ?? null;

        const address =
          block.blockStatus === "PENDING"
            ? `${block.candidateCount}개의 후보지`
            : (single?.address ?? "");

        const placeName =
          block.type === "FREE" ? "자유시간" : (single?.placeName ?? "");

        const candidatesEdit: EditCandidateItem[] = block.candidates.map(
          (c) => ({
            id: c.blockId,
            blockId: c.blockId,
            placeType: toPlaceType(block.type, c.category),
            placeName: c.placeName,
          }),
        );

        const candidatesView: ViewCandidateItem[] = block.candidates.map(
          (c) => ({
            id: c.blockId,
            placeType: toPlaceType(block.type, c.category),
            placeName: c.placeName,
            writerNickname: c.addedBy?.nickname ?? "",
            writerProfileImageUrl: c.addedBy?.picture ?? "",
            memo: c.memo || "메모가 없습니다.",
            reactions: {
              good: c.opinionSummary?.positive ?? 0,
              normal: c.opinionSummary?.neutral ?? 0,
              bad: c.opinionSummary?.negative ?? 0,
            },
            activeReaction: toReactionType(
              c.opinionSummary?.myOpinionType ?? null,
            ),
            opinionCount: c.opinionSummary?.totalCount ?? 0,
          }),
        );

        return isEdit ? (
          <TimeBlock
            key={block.timeBlockId}
            planId={planId}
            day={day}
            timeBlockId={block.timeBlockId}
            blockStatus={block.blockStatus}
            blockType={block.type}
            startTime={block.startTime}
            endTime={block.endTime}
            address={address}
            isFirst={isFirst}
            isLast={isLast}
            isFree={block.type === "FREE"}
            singleCard={{
              blockId: single?.blockId ?? "",
              placeType: toPlaceType(block.type, single?.category),
              placeName: placeName,
              writerNickname: single?.addedBy?.nickname ?? "",
              candidateCount: block.candidateCount,
              writerProfileImageUrl: single?.addedBy?.picture ?? "",
              memo: single?.memo || "메모가 없습니다.",
            }}
            isEdit={isEdit}
            candidates={candidatesEdit}
          />
        ) : (
          <ViewTimeBlock
            key={block.timeBlockId}
            planId={planId}
            timeBlockId={block.timeBlockId}
            blockStatus={block.blockStatus}
            blockType={block.type}
            startTime={block.startTime}
            address={address}
            isFirst={isFirst}
            isLast={isLast}
            isFree={block.type === "FREE"}
            singleCard={{
              blockId: single?.blockId ?? "",
              placeType: toPlaceType(block.type, single?.category),
              placeName: placeName,
              writerNickname: single?.addedBy?.nickname ?? "",
              candidateCount: block.candidateCount,
              writerProfileImageUrl: single?.addedBy?.picture ?? "",
              memo: single?.memo || "메모가 없습니다.",
              imageUrl: single?.photoUrls?.[0] ?? "",
              opinionCount: single?.opinionSummary?.totalCount ?? 0,
              reactions: {
                good: single?.opinionSummary?.positive ?? 0,
                normal: single?.opinionSummary?.neutral ?? 0,
                bad: single?.opinionSummary?.negative ?? 0,
              },
              activeReaction: toReactionType(
                single?.opinionSummary?.myOpinionType ?? null,
              ),
            }}
            candidates={candidatesView}
          />
        );
      })}

      {/* sentinel(바닥 감지) */}
      {hasNextPage && (
        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      )}

      {/* 다음 페이지 로딩 표시 */}
      {isFetchingNextPage && (
        <div className="pt-3 text-sm text-muted-foreground">
          더 불러오는 중...
        </div>
      )}
    </div>
  );
};

export default DayTimeBlocks;
