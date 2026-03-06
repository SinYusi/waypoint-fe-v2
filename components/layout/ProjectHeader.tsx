"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import HeaderBtn, { HeaderBtnBgVariant } from "./HeaderBtn";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft, Calendar, Map } from "lucide-react";
import MemberSideDrawer from "@/components/common/MemberSideDrawer";

interface ProjectHeaderProps {
  // 헤더 레이아웃 타입
  variant?: "view" | "edit";
  // 타이틀 텍스트
  title?: string;
  // 우측 버튼
  isMapVisible?: boolean;
  isCalendarVisible?: boolean;
  showMapButton?: boolean;
  showCalendarButton?: boolean;
  showMenuButton?: boolean;
  drawerTitle?: string;
  dateRange?: string;
  mapDisabled?: boolean;
  calendarDisabled?: boolean;
  onMap?: () => void;
  onCalendar?: () => void;
  // 스타일
  leftBtnBgVariant?: HeaderBtnBgVariant;
  rightBtnBgVariant?: HeaderBtnBgVariant;
  className?: string;
}

const ProjectHeader = ({
  variant = "view",
  title,
  isMapVisible = false,
  isCalendarVisible = false,
  showMapButton = false,
  showCalendarButton = false,
  showMenuButton = false,
  drawerTitle,
  dateRange,
  mapDisabled = false,
  calendarDisabled = false,
  onMap,
  onCalendar,
  leftBtnBgVariant = "ghost",
  rightBtnBgVariant = "ghost",
  className,
}: ProjectHeaderProps) => {
  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const planId = params.planId;
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";

  // 보기모드 뒤로가기 핸들러
  const handleViewBack = () => router.push(`/projects`);

  // 편집모드 뒤로가기 핸들러
  const handleEditBack = () => router.replace(`/projects/${planId}${suffix}`);

  return (
    <header
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-center justify-between w-full gap-2 h-16 px-2.5 pt-3.5 pb-0.5 bg-white/10 backdrop-blur-md",
        className,
      )}
    >
      {/* 뒤로가기 버튼 */}
      <div className="flex items-center justify-start">
        {variant === "view" && (
          <HeaderBtn
            bgVariant={leftBtnBgVariant}
            icon={ArrowLeft}
            onClick={handleViewBack}
            label="뒤로가기"
          />
        )}
        {variant === "edit" && (
          <button
            aria-label="뒤로가기"
            onClick={handleEditBack}
            className="text-muted-foreground typography-action-sm-bold flex px-1.5 py-2.5 items-center justify-center gap-1 rounded-lg hover:bg-accent"
          >
            <ArrowLeft />
            편집종료
          </button>
        )}
      </div>

      {/* 중앙 타이틀 */}
      <div className="min-w-0">
        {title ? (
          <h1 className="text-center typography-display-xl text-foreground truncate">
            {title}
          </h1>
        ) : null}
      </div>

      {/* 우측 영역 */}
      <div className="flex items-center justify-end gap-1">
        {showMapButton && (
          <HeaderBtn
            bgVariant={rightBtnBgVariant}
            icon={Map}
            onClick={onMap}
            disabled={mapDisabled}
            label="지도"
            iconClassName={cn(
              isMapVisible && !mapDisabled ? "text-primary" : "",
            )}
          />
        )}

        {showCalendarButton && (
          <HeaderBtn
            bgVariant={rightBtnBgVariant}
            icon={Calendar}
            onClick={onCalendar}
            disabled={calendarDisabled}
            label="일차"
            iconClassName={cn(isCalendarVisible ? "text-primary" : "")}
          />
        )}

        {showMenuButton && (
          <MemberSideDrawer
            title={drawerTitle ?? ""}
            variant="PLAN"
            planId={planId}
            dateRange={dateRange}
            rightBtnBgVariant={rightBtnBgVariant}
          />
        )}
      </div>
    </header>
  );
};

export default ProjectHeader;
