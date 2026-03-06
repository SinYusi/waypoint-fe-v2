"use client";

import { BlockStatus, TimeBlockType } from "@/lib/api/block";
import PlanTime from "./PlanTime";
import { PlaceType } from "@/components/card/PlaceTypeIcon";
import { ViewCandidateItem } from "@/components/card/CandidateGroup";
import ViewPlace from "./ViewPlace";
import { ReactionType } from "@/components/card/PlaceReactionItem";

interface ViewTimeBlockProps {
  planId: string;
  timeBlockId: string;
  blockType: TimeBlockType;
  blockStatus: BlockStatus;
  startTime: string;
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
    imageUrl?: string;
    opinionCount: number;
    reactions: {
      good: number;
      normal: number;
      bad: number;
    };
    activeReaction?: ReactionType;
  };
  candidates: ViewCandidateItem[];
}

const ViewTimeBlock = ({
  planId,
  timeBlockId,
  blockType,
  blockStatus,
  startTime,
  address,
  isFirst,
  isLast,
  isFree,
  singleCard,
  candidates,
}: ViewTimeBlockProps) => {
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
      />

      {/* 오른쪽 카드 영역 */}
      <ViewPlace
        planId={planId}
        timeBlockId={timeBlockId}
        blockStatus={blockStatus}
        blockType={blockType}
        singleCard={singleCard}
        candidates={candidates}
        isLast={isLast}
      />
    </div>
  );
};

export default ViewTimeBlock;
