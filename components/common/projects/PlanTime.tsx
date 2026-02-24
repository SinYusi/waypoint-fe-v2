"use client";

import { cn } from "@/lib/utils/utils";
import Divider from "../Divider";

interface PlanTimeProps {
  startTime: string;
  address: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const PlanTime = ({
  startTime,
  address,
  isFirst = false,
  isLast = false,
}: PlanTimeProps) => {
  return (
    <div className="flex items-center gap-6">
      <div className="w-1.75 h-full flex flex-col items-center">
        <Divider
          className={cn(
            "rotate-180 h-3 w-px bg-[#D9D9D9]",
            isFirst && "opacity-0",
          )}
        />
        <div className="relative w-3 h-3">
          <div className="absolute inset-0 rounded-full bg-white/[0.002] scale-150" />
          <div className="relative w-3 h-3 rounded-full border-2 border-primary bg-white shadow-sm" />
        </div>
        <Divider
          className={cn(
            "rotate-180 h-3 w-px bg-[#D9D9D9]",
            isLast && "opacity-0",
          )}
        />
      </div>
      {/* 시작 시간 / 주소 */}
      <div className="flex items-center gap-2">
        <span className="typography-body-sm-sb">{startTime}</span>
        <Divider className="rotate-180 h-3 w-px bg-border" />
        <span className="typography-body-sm-reg text-muted-foreground">
          {address}
        </span>
      </div>
    </div>
  );
};

export default PlanTime;
