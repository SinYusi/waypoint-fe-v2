"use client";

import Image from "next/image";
import { Pencil, Trash2, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import MoreActionMenu from "../common/MoreActionMenu";

interface CollectionCardProps {
  title: string;
  memberCount?: number;
  imageSrc?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const CollectionCard = ({
  title,
  memberCount,
  imageSrc,
  onClick,
  onEdit,
  onDelete,
  className,
}: CollectionCardProps) => {
  return (
    <div className={cn("relative w-full max-w-83.75 pb-2", className)}>
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
            {memberCount && (
              <span className="flex items-center gap-1 typography-body-sm-reg text-muted-foreground">
                <UsersRound className="size-4" />
                {memberCount}명 참여 중
              </span>
            )}
          </div>
          {/* Menu button */}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <MoreActionMenu
              label="컬렉션 메뉴"
              headerBtnBgVariant="glass"
              sheetTitle="컬렉션 메뉴"
              items={[
                {
                  id: "edit",
                  label: "수정하기",
                  icon: <Pencil />,
                  onSelect: onEdit,
                },
                {
                  id: "delete",
                  label: "삭제하기",
                  icon: <Trash2 />,
                  onSelect: onDelete,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
export type { CollectionCardProps };
