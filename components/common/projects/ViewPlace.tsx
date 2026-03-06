"use client";

import CandidateGroup, {
  ViewCandidateItem,
} from "@/components/card/CandidateGroup";
import { ReactionType } from "@/components/card/PlaceReactionItem";
import { PlaceType } from "@/components/card/PlaceTypeIcon";
import PlanPlaceCard from "@/components/card/PlanPlaceCard";
import { BlockStatus, TimeBlockType } from "@/lib/api/block";
import { OpinionCategoryKey } from "@/lib/opinion-bottom-sheet";
import { cn } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PlaceOpinionBottomSheet from "../PlaceOpinionBottomSheet";
import { useBlockDetail } from "@/lib/hooks/use-block-detail";

const resolveOpinionCategoryKey = (
  placeType: PlaceType,
): OpinionCategoryKey => {
  switch (placeType) {
    case "식당":
    case "주점":
    case "유흥":
      return "FNB";

    case "카페":
    case "디저트":
      return "DESSERT";

    case "숙소":
      return "STAY";

    case "쇼핑":
      return "SHOPPING";

    case "관광명소":
    case "문화예술":
    case "관람":
    case "공원":
    case "자연":
    case "종교시설":
    case "테마파크":
    case "액티비티":
      return "TOUR";

    case "교통":
    case "스파":
    case "편의시설":
    case "기타":
    case "자유시간":
    default:
      return "GENERAL";
  }
};

type SingleCandidateCard = {
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

interface ViewPlaceProps {
  planId: string;
  timeBlockId: string;
  blockStatus: BlockStatus;
  /** 이 블록이 PLACE인지 FREE인지 */
  blockType: TimeBlockType;
  /** FREE 블록이거나, PLACE 블록에서 단일 후보 카드 */
  singleCard: SingleCandidateCard;
  /** 후보지 목록(PLACE 블록에서만) */
  candidates: ViewCandidateItem[];
  isLast?: boolean;
  className?: string;
}

const ViewPlace = ({
  planId,
  timeBlockId,
  blockStatus,
  blockType,
  singleCard,
  candidates,
  isLast = false,
  className,
}: ViewPlaceProps) => {
  const router = useRouter();

  const [opinionOpen, setOpinionOpen] = useState(false);
  const [opinionBlockId, setOpinionBlockId] = useState<string | undefined>(
    undefined,
  );
  const [opinionCategoryKey, setOpinionCategoryKey] = useState<
    OpinionCategoryKey | undefined
  >(undefined);

  const { data: blockDetail } = useBlockDetail({
    planId,
    blockId: opinionBlockId ?? "",
    enabled: Boolean(planId && opinionBlockId),
  });

  const opinions = blockDetail?.opinions ?? [];
  const myMemberId = blockDetail?.myPlanMemberId;

  const isMultiCandidate = blockType === "PLACE" && candidates.length >= 2;

  const openOpinions = (blockId: string, placeType: PlaceType) => {
    setOpinionBlockId(blockId);
    setOpinionCategoryKey(resolveOpinionCategoryKey(placeType));
    setOpinionOpen(true);
  };

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
          // 후보지 확정 상태 카드
          <PlanPlaceCard
            placeType={singleCard.placeType}
            placeName={singleCard.placeName}
            writerNickname={singleCard.writerNickname}
            writerProfileImageUrl={singleCard.writerProfileImageUrl}
            memo={singleCard.memo}
            imageUrl={singleCard.imageUrl}
            reactions={singleCard.reactions}
            opinionCount={singleCard.opinionCount}
            activeReaction={singleCard.activeReaction}
            isView
            isFixedCandidate
            candidateCount={singleCard.candidateCount}
            onReselectCandidate={() => {
              // TODO: 추후 후보지 변경 페이지로 이동
            }}
            onOpinionClick={() =>
              openOpinions(singleCard.blockId, singleCard.placeType)
            }
            onDetailClick={() =>
              router.push(`/projects/${planId}/block/${singleCard.blockId}`)
            }
          />
        ) : isMultiCandidate ? (
          // 후보 2개 이상이면 CandidateGroup
          <CandidateGroup
            mode="view"
            candidates={candidates.map((c) => ({
              ...c,
              onOpinionClick: () => openOpinions(c.id, c.placeType),
              onCardClick: () =>
                router.push(`/projects/${planId}/block/${c.id}`),
            }))}
            onSelectCandidate={() =>
              router.push(
                `/projects/${planId}/select-candidate/${timeBlockId}`,
              )
            }
          />
        ) : blockType === "FREE" ? (
          // 자유시간
          <PlanPlaceCard
            placeType={singleCard.placeType}
            placeName={singleCard.placeName}
            writerNickname={singleCard.writerNickname}
            writerProfileImageUrl={singleCard.writerProfileImageUrl}
            memo={singleCard.memo}
            isView={false}
            isFree
            onFreeClick={() =>
              router.push(
                `/projects/${planId}/block/${singleCard.blockId}/free`,
              )
            }
          />
        ) : (
          // 후보 1개일 경우
          <PlanPlaceCard
            placeType={singleCard.placeType}
            placeName={singleCard.placeName}
            writerNickname={singleCard.writerNickname}
            writerProfileImageUrl={singleCard.writerProfileImageUrl}
            memo={singleCard.memo}
            imageUrl={singleCard.imageUrl}
            reactions={singleCard.reactions}
            opinionCount={singleCard.opinionCount}
            activeReaction={singleCard.activeReaction}
            onOpinionClick={() =>
              openOpinions(singleCard.blockId, singleCard.placeType)
            }
            onDetailClick={() =>
              router.push(`/projects/${planId}/block/${singleCard.blockId}`)
            }
            isView
          />
        )}
      </div>
      <PlaceOpinionBottomSheet
        open={opinionOpen}
        onOpenChange={setOpinionOpen}
        planId={planId}
        blockId={opinionBlockId}
        myMemberId={myMemberId}
        opinions={opinions}
        categoryKey={opinionCategoryKey ?? "GENERAL"}
      />
    </div>
  );
};

export default ViewPlace;
