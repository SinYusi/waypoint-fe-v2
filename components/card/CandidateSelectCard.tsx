"use client";

import { useState } from "react";
import Image from "next/image";
import CandidateCardPrice from "@/components/card/CandidateCardPrice";
import Writer from "@/components/card/Writer";
import CheckBox from "@/components/common/CheckBox";
import PlaceReactionItem, {
  type ReactionType,
} from "@/components/card/PlaceReactionItem";
import OpinionBtn from "@/components/card/OpinionBtn";
import PlaceOpinionBottomSheet from "@/components/common/PlaceOpinionBottomSheet";
import {
  type BlockOpinion,
  type OpinionCategoryKey,
} from "@/lib/opinion-bottom-sheet";

interface CandidateSelectCardProps {
  index: number;
  placeName: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  categoryKey: OpinionCategoryKey;
  imageUrl?: string;
  memo?: string;
  amount?: number;
  opinions?: BlockOpinion[];
  isSelected?: boolean;
  onOpinionClick?: () => void;
  onSelect?: () => void;
}

const REACTION_TYPES: ReactionType[] = ["good", "normal", "bad"];

const REACTION_TO_OPINION_STATE: Record<ReactionType, BlockOpinion["type"]> = {
  good: "POSITIVE",
  normal: "NEUTRAL",
  bad: "NEGATIVE",
};

const CandidateSelectCard = ({
  index,
  placeName,
  writerNickname,
  writerProfileImageUrl,
  categoryKey,
  imageUrl,
  memo,
  amount,
  opinions = [],
  isSelected = false,
  onOpinionClick,
  onSelect,
}: CandidateSelectCardProps) => {
  const [isOpinionOpen, setIsOpinionOpen] = useState(false);

  const reactionCounts: Record<ReactionType, number> = {
    good: opinions.filter((o) => o.type === "POSITIVE").length,
    normal: opinions.filter((o) => o.type === "NEUTRAL").length,
    bad: opinions.filter((o) => o.type === "NEGATIVE").length,
  };

  return (
    <div className="flex flex-col">
      {/* Card */}
      <div
        className={`flex flex-col rounded-2xl border bg-white overflow-hidden transition-colors ${isSelected ? "border-sky-500" : "border-[#e2e2e2]"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-4">
          <div className="flex items-start gap-2 pr-1.5">
            <div className="shrink-0 mt-0.5 size-6 rounded-full flex items-center justify-center bg-border">
              <span className="typography-body-sm-bold text-muted-foreground leading-none">
                {index}
              </span>
            </div>
            <span className="typography-action-base-bold line-clamp-2 text-foreground">
              {placeName}
            </span>
          </div>
          <div className="shrink-0">
            <Writer
              nickname={writerNickname}
              profileImageUrl={writerProfileImageUrl}
            />
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[8/5] bg-[#f0f0f0]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={placeName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground typography-body-sm-reg">
              사진 없음
            </div>
          )}
        </div>

        {/* Memo + Price */}
        <div className="flex flex-col gap-2 px-4 pt-3 pb-3.5">
          {memo && (
            <p className="typography-body-sm-reg text-muted-foreground">
              {memo}
            </p>
          )}
          <CandidateCardPrice amount={amount} />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-dashed border-[#e2e2e2]">
          <div
            onClick={onSelect}
            className={`w-full relative flex items-center justify-center rounded-[20px] px-5 py-3 typography-action-base-bold transition-colors ${
              isSelected
                ? "bg-primary text-background"
                : "bg-checkbox text-foreground"
            }`}
          >
            <CheckBox
              checked={isSelected}
              className="absolute left-5 pointer-events-none data-[state=checked]:bg-[#f0f0f0] data-[state=checked]:text-primary"
            />
            선택하기
          </div>
        </div>
      </div>

      {/* Reactions - 카드 밖 하단 */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center">
          {REACTION_TYPES.map((type) => (
            <PlaceReactionItem
              key={type}
              type={type}
              count={reactionCounts[type]}
              variant="ghost"
              onClick={() => setIsOpinionOpen(true)}
            />
          ))}
        </div>
        <OpinionBtn count={opinions.length} onClick={onOpinionClick} />
      </div>

      <PlaceOpinionBottomSheet
        open={isOpinionOpen}
        onOpenChange={setIsOpinionOpen}
        categoryKey={categoryKey}
        opinions={opinions}
      />
    </div>
  );
};

export default CandidateSelectCard;
