"use client";

import { cn } from "@/lib/utils/utils";
import Divider from "../Divider";

interface PlanTimeProps {
  startTime: string;
  address: string;
  isFirst?: boolean;
  isLast?: boolean;
  isFree?: boolean;
}

const PlanTime = ({
  startTime,
  address,
  isFirst = false,
  isLast = false,
  isFree = false,
}: PlanTimeProps) => {
  return (
    <div className="flex items-center gap-6">
      {/* 타임라인 원 */}
      <div className="w-1.75 h-full flex flex-col items-center">
        {/* 첫 일정은 윗 선 안보이게 처리 */}
        <Divider
          className={cn(
            "rotate-180 h-3 w-px bg-[#D9D9D9]",
            isFirst && "opacity-0",
          )}
        />
        {/* 원 */}
        <div className="relative w-3 h-3">
          <div className="absolute inset-0 rounded-full bg-white/[0.002] scale-150" />
          <div className="relative w-3 h-3 rounded-full border-2 border-primary bg-white shadow-sm" />
        </div>
        {/* 마지막 일정은 아랫 선 안보이게 처리 */}
        <Divider
          className={cn(
            "rotate-180 h-3 w-px bg-[#D9D9D9]",
            isLast && "opacity-0",
          )}
        />
      </div>
      {/* 시작 시간 / 주소 */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="typography-body-sm-sb">{startTime}</span>
        {!isFree && (
          <>
            <Divider className="rotate-180 h-3 w-px bg-border" />
            <span className="typography-body-sm-reg text-muted-foreground truncate">
              {address}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default PlanTime;
