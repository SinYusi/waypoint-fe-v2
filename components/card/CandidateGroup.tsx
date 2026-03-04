"use client";

import { useState } from "react";
import CandidateCard from "@/components/card/CandidateCard";
import { type PlaceType } from "@/components/card/PlaceTypeIcon";
import { type ReactionType } from "@/components/card/PlaceReactionItem";
import { Button } from "../ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

// ─── Item types ──────────────────────────────────────────────────────────────

interface Reactions {
  good: number;
  normal: number;
  bad: number;
}

export interface EditCandidateItem {
  id: string;
  placeType: PlaceType;
  placeName: string;
  blockId: string;
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
  onCardClick?: () => void;
}

// ─── Group props ─────────────────────────────────────────────────────────────

interface CandidateGroupEditProps {
  mode: "edit";
  candidates: EditCandidateItem[];
  onCandidateMenuClick?: (candidateBlockId: string) => void;
}

interface CandidateGroupViewProps {
  mode: "view";
  candidates: ViewCandidateItem[];
  onSelectCandidate?: () => void;
}

type CandidateGroupProps = CandidateGroupEditProps | CandidateGroupViewProps;

// ─── Constants ───────────────────────────────────────────────────────────────

const COLLAPSE_THRESHOLD = 4;
const COLLAPSED_SHOW_COUNT = 3;

// ─── Component ───────────────────────────────────────────────────────────────

const CandidateGroup = (props: CandidateGroupProps) => {
  const { mode, candidates } = props;
  const isCollapsible = candidates.length >= COLLAPSE_THRESHOLD;
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCandidates =
    isCollapsible && !isExpanded
      ? candidates.slice(0, COLLAPSED_SHOW_COUNT)
      : candidates;

  const hiddenCount = candidates.length - COLLAPSED_SHOW_COUNT;

  if (mode === "edit") {
    const { onCandidateMenuClick } = props as CandidateGroupEditProps;

    return (
      <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-border bg-card p-3">
        {(visibleCandidates as EditCandidateItem[]).map((item) => (
          <CandidateCard
            key={item.id}
            mode="edit"
            placeType={item.placeType}
            placeName={item.placeName}
            onMenuClick={() => onCandidateMenuClick?.(item.id)}
          />
        ))}
        {isCollapsible && (
          <button
            type="button"
            className="flex items-center justify-center gap-1 typography-action-sm-reg text-foreground py-2.5 px-2 w-full"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "접기" : `+ ${hiddenCount}개 더 보기`}
            {isExpanded ? (
              <ChevronUpIcon className="size-6 opacity-40" />
            ) : (
              <ChevronDownIcon className="size-6 opacity-40" />
            )}
          </button>
        )}
      </div>
    );
  }

  const { onSelectCandidate } = props as CandidateGroupViewProps;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-border bg-card p-3">
      {(visibleCandidates as ViewCandidateItem[]).map((item) => (
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
          onCardClick={item.onCardClick}
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

      {/* Bottom */}

      <div className="flex items-center justify-between">
        {isCollapsible && (
          <button
            type="button"
            className="flex items-center gap-1 typography-action-sm-reg text-foreground py-2.5 px-2"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "접기" : `+ ${hiddenCount}개 더 보기`}
            {isExpanded ? (
              <ChevronUpIcon className="size-6 opacity-40" />
            ) : (
              <ChevronDownIcon className="size-6 opacity-40" />
            )}
          </button>
        )}
        <Button
          variant="outline"
          size="M"
          className={cn(
            "h-10 rounded-xl border border-border bg-background typography-action-sm-bold text-foreground",
            !isCollapsible ? "w-full" : "",
          )}
          onClick={onSelectCandidate}
        >
          후보지 선택하기
        </Button>
      </div>
    </div>
  );
};

export default CandidateGroup;
