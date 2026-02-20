"use client";

import { useState } from "react";
import Image from "next/image";
import { Ellipsis, MapPin, SquareX, Heart } from "lucide-react";
import HeaderBtn from "@/components/layout/HeaderBtn";
import { cn } from "@/lib/utils/utils";

interface PlaceCardProps {
  title: string;
  address?: string;
  imageSrc?: string;
  rejectCount?: number;
  likeCount?: number;
  myPreference?: "PICK" | "PASS" | "NOTHING";
  onClick?: () => void;
  onLikeClick?: () => void;
  onRejectClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

const PlaceCard = ({
  title,
  address,
  imageSrc,
  rejectCount = 0,
  likeCount = 0,
  myPreference,
  onClick,
  onLikeClick,
  onRejectClick,
  onMenuClick,
  className,
}: PlaceCardProps) => {
  const [isLiked, setIsLiked] = useState(myPreference === "PICK");
  const [isRejected, setIsRejected] = useState(myPreference === "PASS");

  return (
    <div
      className={cn(
        "w-full max-w-83.75 overflow-hidden rounded-3xl border border-[#E2E2E2] bg-white",
        "shadow-[0px_10px_15px_-3px_#0000001A,0px_4px_6px_-4px_#0000001A]",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Text Area */}
      <div className="pt-3.5 pr-5 pb-3 pl-5">
        <div className="flex flex-col gap-1">
          <span className="typography-title-lg-sb text-foreground">
            {title}
          </span>
          {address && (
            <span className="flex items-center gap-1 typography-body-sm-md text-neutral-600">
              <MapPin className="size-4.5 shrink-0" />
              {address}
            </span>
          )}
        </div>
      </div>

      {/* Image Area */}
      <div className="relative aspect-335/152 w-full bg-white">
        {imageSrc && (
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        )}
        {/* Overlay Bar */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-2.5 pl-3.5">
          <div className="flex gap-2">
            {/* Like Badge */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsLiked((prev) => !prev);
                onLikeClick?.();
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#FCFCFC99] px-4 py-2 backdrop-blur"
              aria-label="좋아요"
            >
              <Heart
                className="size-5 transition-colors"
                strokeWidth={isLiked ? 0 : 2}
                style={{
                  stroke: isLiked ? "none" : "var(--foreground, #1C2024)",
                  fill: isLiked ? "var(--red-500, #EF4444)" : "none",
                }}
              />
              <span className="typography-body-sm-reg text-foreground">
                {likeCount}
              </span>
            </button>
            {/* Reject Badge */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsRejected((prev) => !prev);
                onRejectClick?.();
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#FCFCFC99] px-4 py-2 backdrop-blur"
              aria-label="거절"
            >
              <SquareX
                className="size-5 transition-colors"
                strokeWidth={2}
                style={{
                  stroke: isRejected ? "#FFFFFF" : "var(--foreground, #1C2024)",
                  fill: isRejected ? "var(--purple-500, #A855F7)" : "none",
                }}
              />
              <span className="typography-body-sm-reg text-foreground">
                {rejectCount}
              </span>
            </button>
          </div>
          {/* Menu Button */}
          <div onClick={(event) => event.stopPropagation()}>
            <HeaderBtn
              bgVariant="glass"
              icon={Ellipsis}
              label="메뉴"
              onClick={onMenuClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
export type { PlaceCardProps };
