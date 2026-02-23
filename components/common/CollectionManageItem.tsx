"use client";

import { Trash2 } from "lucide-react";
import ProfileImage from "./ProfileImage";
import { cn } from "@/lib/utils/utils";

interface CollectionManageItemProps {
  title: string;
  nickname: string;
  src: string;
  onClick?: () => void;
  className?: string;
}

const CollectionManageItem = ({
  title,
  nickname,
  src,
  onClick,
  className,
}: CollectionManageItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-1.75 pl-5 pr-3.5 py-3 bg-checkbox rounded-4xl w-full",
        className,
      )}
    >
      <div className="flex flex-col flex-1 gap-1.75 min-w-0 w-full items-start text-start">
        <span className="typography-label-base-sb truncate w-full min-w-0 text-foreground">
          {title}
        </span>
        <div className="flex items-center min-w-0 w-full gap-1">
          <ProfileImage src={src} alt={nickname} className="size-4" />
          <span className="typography-body-sm-reg truncate w-full min-w-0 text-[#09090B]">
            {nickname}
          </span>
        </div>
      </div>
      <button type="button" onClick={onClick}>
        <Trash2 size={24} className="text-foreground shrink-0" />
      </button>
    </div>
  );
};

export default CollectionManageItem;
