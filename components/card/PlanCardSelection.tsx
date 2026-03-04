"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Heart, MapPin, SquareX } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import Radio from "@/components/common/Radio";
import CheckBox from "../common/CheckBox";

const BASE_WIDTH = 335;
const SCALE_EPSILON = 0.01;

interface PlanCardSelectionProps {
  title: string;
  address?: string;
  imageSrc?: string;
  imageAlt?: string;
  pickCount?: number;
  passCount?: number;
  name?: string;
  isSelected?: boolean;
  onSelected?: (selected: boolean) => void;
  selectionType?: "radio" | "check";
  className?: string;
}

const PlanCardSelection = ({
  title,
  address,
  imageSrc,
  imageAlt,
  pickCount = 0,
  passCount = 0,
  name,
  isSelected = false,
  onSelected,
  selectionType = "radio",
  className,
}: PlanCardSelectionProps) => {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const rawScale = entry.contentRect.width / BASE_WIDTH;
      const nextScale = Number(rawScale.toFixed(3));
      setScale((prevScale) =>
        Math.abs(prevScale - nextScale) > SCALE_EPSILON ? nextScale : prevScale,
      );
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <div style={{ zoom: scale }}>
        <div
          className={cn(
            "w-83.75 overflow-hidden rounded-3xl",
            "border bg-white",
            isSelected ? "border-sky-500" : "border-[#E2E2E2]",
            "shadow-[0px_10px_15px_-3px_#0000001A,0px_4px_6px_-4px_#0000001A]",
            onSelected && "cursor-pointer",
          )}
          onClick={() => onSelected?.(!isSelected)}
          role={selectionType === "check" ? "checkbox" : "radio"}
          aria-checked={isSelected}
        >
          {/* 이미지 영역 */}
          <div className="relative h-[152.27px] w-full overflow-hidden bg-white">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt ?? title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-neutral-100" />
            )}

            {/* Pick / Pass 투표 현황 - 이미지 좌하단 */}
            <div className="absolute bottom-0 left-0 flex w-full items-end justify-between pb-2.5 pr-2.5 pl-3.5">
              {/* 투표 수 pill — w:122 h:36 px:16 py:8 gap:10 */}
              <div
                className="flex h-9 w-30.5 items-center justify-between rounded-full px-4 py-2 gap-2.5 backdrop-blur"
                style={{ background: "rgba(252, 252, 252, 0.6)" }}
              >
                {/* Pick 버튼 — w:35 h:20 gap:6 */}
                <div className="flex h-5 w-8.75 shrink-0 cursor-pointer items-center gap-1.5">
                  <Heart
                    className="h-5 w-5 shrink-0 transition-colors"
                    strokeWidth={2}
                    style={{
                      stroke: "#757575",
                      fill: "none",
                    }}
                  />
                  <span
                    className="typography-body-sm-reg leading-5"
                    style={{ color: "#757575" }}
                  >
                    {pickCount}
                  </span>
                </div>

                {/* 구분선 — h:17 */}
                <div className="h-4.25 w-px shrink-0 bg-[#A3A3A3]" />

                {/* Pass 버튼 — w:35 h:20 gap:6 */}
                <div className="flex h-5 w-8.75 shrink-0 cursor-pointer items-center gap-1.5">
                  <SquareX
                    className="h-5 w-5 shrink-0 transition-colors"
                    strokeWidth={2}
                    style={{
                      stroke: "#757575",
                      fill: "none",
                    }}
                  />
                  <span
                    className="typography-body-sm-reg leading-5"
                    style={{ color: "#757575" }}
                  >
                    {passCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 선택 영역 */}
          <div className="flex items-start gap-2.5 rounded-br-3xl pt-3.5 pr-5 pb-5 pl-5">
            {/* Radio */}
            <div
              className="shrink-0 pt-0.75"
              onClick={(e) => e.stopPropagation()}
            >
              {selectionType === "radio" ? (
                <Radio
                  id={id}
                  name={name}
                  selected={isSelected}
                  onSelected={onSelected}
                />
              ) : (
                <CheckBox
                  id={id}
                  name={name}
                  checked={isSelected}
                  onCheckedChange={onSelected}
                />
              )}
            </div>

            {/* 장소 정보 */}
            <div className="flex min-w-0 flex-col gap-1">
              <span className="typography-display-lg-bold block truncate text-[#1C2024]">
                {title}
              </span>
              {address && (
                <div className="flex items-center gap-1">
                  <MapPin
                    className="h-4.5 w-4.5 shrink-0"
                    strokeWidth={2}
                    style={{ stroke: "#525252" }}
                  />
                  <span className="typography-body-sm-reg truncate text-[#525252]">
                    {address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCardSelection;
export type { PlanCardSelectionProps };
