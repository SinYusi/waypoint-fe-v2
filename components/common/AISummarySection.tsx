"use client";

import type { ReactNode } from "react";
import YoutubeIcon from "@/public/icons/youtube.svg";
import { SquareArrowOutUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AISummarySectionProps = {
  isLoading: boolean;
  summary: string;
  sourceTitle: string;
  sourceUrl?: string;
  onOpenLink: (url?: string) => void;
  headerIcon?: ReactNode;
  title: ReactNode;
};

const AISummarySection = ({
  isLoading,
  summary,
  sourceTitle,
  sourceUrl,
  onOpenLink,
  headerIcon,
  title,
}: AISummarySectionProps) => {
  return (
    <div className="flex flex-col gap-3 w-full py-2">
      <div className="flex items-center gap-1 w-full h-6">
        {headerIcon}
        <span className="typography-label-base-bold text-foreground">{title}</span>
        <div className="flex-1" />
        <Badge
          className="w-11.75 h-5.5 rounded-full py-0.75 px-2.75 text-white text-xs border-none"
          style={{ background: "var(--semantic-accent-foreground, #1C2024)" }}
        >
          Beta
        </Badge>
      </div>
      <div className="flex flex-col w-full p-4 rounded-xl bg-muted">
        <p className="typography-body-sm-reg text-foreground">
          {isLoading ? "불러오는 중..." : summary || "요약 정보가 없습니다."}
        </p>
        <hr className="my-4 border-border" />
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-4 shrink-0">
              <YoutubeIcon />
            </div>
            <span className="typography-caption-xs-reg text-muted-foreground">
              {sourceTitle || "출처 정보가 없습니다."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenLink(sourceUrl)}
            disabled={!sourceUrl}
            className={sourceUrl ? "cursor-pointer" : "cursor-not-allowed"}
            aria-label="소셜 원문 링크 열기"
          >
            <SquareArrowOutUpRight className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISummarySection;
