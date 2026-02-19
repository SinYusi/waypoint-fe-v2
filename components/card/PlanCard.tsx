"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import MoreActionMenu from "../common/MoreActionMenu";

const BASE_WIDTH = 335;

interface PlanCardProps {
  title: string;
  memberCount?: number;
  dateRange?: string;
  imageSrc?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const PlanCard = ({
  title,
  memberCount,
  dateRange,
  imageSrc,
  onClick,
  onEdit,
  onDelete,
  className,
}: PlanCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / BASE_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-83.75",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <div style={{ zoom: scale }}>
        <div
          className={cn(
            "w-83.75 overflow-hidden",
            "rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-xl",
            "border border-slate-200 bg-[#E7E7E7]",
            "shadow-[0px_10px_15px_-3px_#0000001A,0px_4px_6px_-4px_#0000001A]",
          )}
        >
          {/* Image Area – 16:9, extends behind info section */}
          <div className="relative aspect-video w-full bg-white">
            {imageSrc && (
              <Image src={imageSrc} alt={title} fill className="object-cover" />
            )}
            {dateRange && (
              <span className="absolute bottom-[calc(6.25%+1.25rem)] left-4 rounded-full bg-[#1C202466] px-2.75 py-0.75 text-center typography-caption-xs-reg text-white backdrop-blur-lg">
                {dateRange}
              </span>
            )}
          </div>

          {/* Info + Progress – pulled up to overlap image */}
          <div className="relative z-10 -mt-[6.25%]">
            {/* Info Section */}
            <div className="flex items-center justify-between rounded-tl-xl rounded-br-3xl bg-[#FAFAFA] pt-2.5 pr-4 pb-3.5 pl-5">
              <div className="flex flex-col gap-1">
                <span className="typography-display-lg-bold text-foreground">
                  {title}
                </span>
                {memberCount !== undefined && (
                  <span className="flex items-center gap-1 typography-body-sm-reg text-muted-foreground">
                    <UsersRound className="size-4" />
                    {memberCount}명 참여 중
                  </span>
                )}
              </div>

              {/* Menu Button */}
              <div
                onClick={(event) => event.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <MoreActionMenu
                  label="프로젝트 메뉴"
                  headerBtnBgVariant="glass"
                  sheetTitle="프로젝트 메뉴"
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

            {/* Progress Bar */}
            <div className="h-6 bg-[#FAFAFA] pl-px">
              <div className="h-full rounded-tl-xl bg-[#F0F0F0] py-1 pl-1 shadow-[inset_0px_4px_16px_0px_#E7E7E7]">
                <div
                  className="flex h-4 flex-col justify-between rounded-tl-lg rounded-bl-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #E3E3E3 0%, rgba(220, 220, 220, 0) 100%)",
                  }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-px w-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(217,217,217,0) 0%, #D9D9D9 35.58%, rgba(217,217,217,0) 83.17%)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
export type { PlanCardProps };
