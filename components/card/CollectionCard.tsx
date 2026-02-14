"use client";

import Image from "next/image";
import { Ellipsis, UsersRound } from "lucide-react";
import HeaderBtn from "@/components/layout/HeaderBtn";
import { cn } from "@/lib/utils/utils";

interface CollectionCardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  onClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

const CollectionCard = ({
  title,
  description,
  imageSrc,
  onClick,
  onMenuClick,
  className,
}: CollectionCardProps) => {
  return (
    <div className={cn("relative w-full max-w-[335px] pb-2", className)}>
      <div className="absolute inset-x-0 top-0 bottom-2 rounded-3xl bg-neutral-300 rotate-2" />
      <div className="absolute inset-x-0 top-0 bottom-2 rounded-3xl bg-neutral-200 -rotate-3" />

      {/* Main card */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-3xl border border-[#E2E2E2] bg-[#FAFAFA]",
          "shadow-[0px_10px_15px_-3px_#0000001A,0px_4px_6px_-4px_#0000001A]",
          onClick && "cursor-pointer",
        )}
        onClick={onClick}
      >
        {/* Image Area */}
        <div className="relative aspect-335/152 w-full bg-white">
          {imageSrc && (
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          )}
        </div>

        {/* Text Area */}
        <div className="flex items-center justify-between pt-2.5 pr-4 pb-4 pl-5">
          <div className="flex flex-col gap-1">
            <span className="typography-display-lg-bold text-foreground">
              {title}
            </span>
            {description && (
              <span className="flex items-center gap-1 typography-body-sm-reg text-muted-foreground">
                <UsersRound className="size-4" />
                {description}명 참여 중
              </span>
            )}
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

export default CollectionCard;
export type { CollectionCardProps };
