import Image from "next/image";
import { CircleCheck, ChevronRight, Ellipsis } from "lucide-react";
import PlaceTypeIcon, { type PlaceType } from "@/components/card/PlaceTypeIcon";
import Writer from "@/components/card/Writer";
import PlaceReactionItem, {
  type ReactionType,
} from "@/components/card/PlaceReactionItem";
import OpinionBtn from "@/components/card/OpinionBtn";
import HeaderBtn from "../layout/HeaderBtn";

interface Reactions {
  good: number;
  normal: number;
  bad: number;
}

interface CandidateCardFixedProps {
  mode: "fixed";
  placeType: PlaceType;
  placeName: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  imageUrl?: string;
  memo?: string;
  reactions: Reactions;
  activeReaction?: ReactionType;
  opinionCount: number;
  candidateCount: number;
  onReactionClick?: (type: ReactionType) => void;
  onOpinionClick?: () => void;
  onReselect?: () => void;
}

interface CandidateCardEditProps {
  mode: "edit";
  placeType: PlaceType;
  placeName: string;
  onMenuClick?: () => void;
}

interface CandidateCardViewProps {
  mode: "view";
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

type CandidateCardProps =
  | CandidateCardEditProps
  | CandidateCardViewProps
  | CandidateCardFixedProps;

const REACTION_TYPES: ReactionType[] = ["good", "normal", "bad"];

const CandidateCard = (props: CandidateCardProps) => {
  if (props.mode === "edit") {
    const { placeType, placeName, onMenuClick } = props;
    return (
      <div className="w-full flex items-center justify-between gap-2 px-4 pt-3.5 pb-3 rounded-2xl border border-border bg-background shadow-xs">
        <div className="flex items-start gap-2 pr-1.5">
          <div className="shrink-0">
            <PlaceTypeIcon type={placeType} />
          </div>
          <span
            className="typography-display-base-bold text-foreground"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {placeName}
          </span>
        </div>
        <HeaderBtn
          icon={Ellipsis}
          label="일정 메뉴"
          bgVariant="ghost"
          onClick={onMenuClick}
        />
      </div>
    );
  }

  if (props.mode === "view") {
    const {
      placeType,
      placeName,
      writerNickname,
      writerProfileImageUrl,
      memo,
      reactions,
      activeReaction,
      opinionCount,
      onReactionClick,
      onOpinionClick,
      onCardClick,
    } = props;
    return (
      <div className="w-full flex flex-col rounded-2xl border border-border bg-background shadow-xs">
        <div onClick={onCardClick} className="cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-4">
            <div className="flex items-start gap-2 pr-1.5">
              <div className="shrink-0">
                <PlaceTypeIcon type={placeType} />
              </div>
              <span
                className="typography-display-base-bold text-foreground"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
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

          {/* Memo */}
          {memo && (
            <div className="px-5 pt-0 pb-3">
              <p className="typography-body-sm-reg text-muted-foreground min-w-0 break-all">
                {memo}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pl-3 pr-4 pt-3 pb-3.5 border-t border-dashed border-border">
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
  }

  if (props.mode === "fixed") {
    const {
      placeType,
      placeName,
      writerNickname,
      writerProfileImageUrl,
      imageUrl,
      memo,
      reactions,
      activeReaction,
      opinionCount,
      candidateCount,
      onReactionClick,
      onOpinionClick,
      onReselect,
    } = props;
    return (
      <div className="w-full flex flex-col rounded-2xl border border-[#e2e2e2] bg-white overflow-hidden">
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
        <div className="relative w-full aspect-8/5 bg-[#f0f0f0]">
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

        {/* Memo */}
        {memo && (
          <p className="px-5 pt-3 pb-3 typography-body-sm-reg text-muted-foreground">
            {memo}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-dashed border-[#e2e2e2]">
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

        {/* Reselect */}
        <button
          type="button"
          className="flex items-center gap-1 bg-[#f0f0f0] py-2 px-2.5 mb-3.5 mx-4 rounded-lg typography-nav-xl-reg text-muted-foreground justify-center"
          onClick={onReselect}
        >
          <CircleCheck className="size-4 shrink-0 text-sky-500" />
          <span className="text-foreground">
            총 {candidateCount}개의 후보지 중 다시 선택하기
          </span>
          <ChevronRight className="size-4 shrink-0 opacity-40 stroke-3" />
        </button>
      </div>
    );
  }
};

export default CandidateCard;
