"use client";

import CandidateCard from "@/components/card/CandidateCard";
import { type PlaceType } from "@/components/card/PlaceTypeIcon";
import { type ReactionType } from "@/components/card/PlaceReactionItem";
import { Button } from "../ui/button";

// ─── Item types ──────────────────────────────────────────────────────────────

interface Reactions {
  good: number;
  normal: number;
  bad: number;
}

export interface ViewCandidateItem {
  id: string;
  placeType: PlaceType;
  placeName: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  memo?: string;
  reactions: Reactions;
  activeReaction?: ReactionType;
  opinionCount: number;
  onReactionClick?: (type: ReactionType) => void;
  onOpinionClick?: () => void;
}

// ─── Group props ─────────────────────────────────────────────────────────────

interface CandidateGroupProps {
  mode: "view";
  candidates: ViewCandidateItem[];
  onSelectCandidate?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const CandidateGroup = ({
  candidates,
  onSelectCandidate,
}: CandidateGroupProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-[#e2e2e2] bg-[#f0f0f0] p-3">
      {candidates.map((item) => (
        <CandidateCard
          key={item.id}
          mode="view"
          placeType={item.placeType}
          placeName={item.placeName}
          writerNickname={item.writerNickname}
          writerProfileImageUrl={item.writerProfileImageUrl}
          memo={item.memo}
          reactions={item.reactions}
          activeReaction={item.activeReaction}
          opinionCount={item.opinionCount}
          onReactionClick={item.onReactionClick}
          onOpinionClick={item.onOpinionClick}
        />
      ))}

      {/* Divider */}
      <div
        style={{
          height: 1,
          background:
            "repeating-linear-gradient(to right, #e2e2e2 0, #e2e2e2 2px, transparent 2px, transparent 4px)",
        }}
      />

      {/* 후보지 선택하기 */}
      <Button
        variant="outline"
        className="w-full rounded-xl border border-[#e2e2e2] bg-[#fafafa] py-2.5 px-4 typography-action-sm-bold text-foreground"
        onClick={onSelectCandidate}
      >
        후보지 선택하기
      </Button>
    </div>
  );
};

export default CandidateGroup;
