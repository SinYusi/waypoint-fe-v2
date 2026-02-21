import Image from "next/image";
import PlaceTypeIcon, { type PlaceType } from "@/components/card/PlaceTypeIcon";
import Writer from "@/components/card/Writer";
import PlaceReactionItem, {
  type ReactionType,
} from "@/components/card/PlaceReactionItem";
import OpinionBtn from "@/components/card/OpinionBtn";

interface Reactions {
  good: number;
  normal: number;
  bad: number;
}

interface PlanPlaceCardProps {
  placeType: PlaceType;
  placeName: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  imageUrl?: string;
  memo?: string;
  reactions: Reactions;
  activeReaction?: ReactionType;
  opinionCount: number;
  onReactionClick?: (type: ReactionType) => void;
  onOpinionClick?: () => void;
}

const REACTION_TYPES: ReactionType[] = ["good", "normal", "bad"];

const PlanPlaceCard = ({
  placeType,
  placeName,
  writerNickname,
  writerProfileImageUrl,
  imageUrl,
  memo,
  reactions,
  activeReaction,
  opinionCount,
  onReactionClick,
  onOpinionClick,
}: PlanPlaceCardProps) => {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e2e2e2] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-4">
        <div className="flex items-start gap-2 pr-1.5">
          <div className="shrink-0 mt-0.5">
            <PlaceTypeIcon type={placeType} />
          </div>
          <span className="typography-display-lg-bold line-clamp-2 text-foreground">
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
          <Image src={imageUrl} alt={placeName} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground typography-body-sm-reg">
            사진 없음
          </div>
        )}
      </div>

      {/* Memo */}
      {memo && (
        <p className="px-5 pt-3 pb-3 typography-body-sm-reg text-muted-foreground">
          {memo}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e2e2]">
        <div className="flex items-center">
          {REACTION_TYPES.map((type) => (
            <PlaceReactionItem
              key={type}
              type={type}
              count={reactions[type]}
              active={activeReaction === type}
              onClick={() => onReactionClick?.(type)}
            />
          ))}
        </div>
        <OpinionBtn count={opinionCount} onClick={onOpinionClick} />
      </div>
    </div>
  );
};

export default PlanPlaceCard;
