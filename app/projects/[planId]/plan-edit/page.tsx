"use client";

import { useState } from "react";
import DayNav from "@/components/common/DayNav";
import GoogleMap from "@/components/common/GoogleMap";
import { DayHeader } from "@/components/layout/DayHeader";
import NavigationBar from "@/components/layout/NavigationBar";
import PlanHeader from "@/components/layout/PlanHeader";
import ProjectHeader from "@/components/layout/ProjectHeader";
import { useParams, useRouter } from "next/navigation";
import useQueryTab from "@/lib/hooks/use-query-tab";
import { formatDayInfoText } from "@/lib/utils/date";
import DayTimeBlocks from "@/components/common/projects/DayTimeBlocks";
import { usePlanBlockData } from "@/lib/hooks/use-plan-block-data";

const PlanEditPage = () => {
  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const planId = params.planId;

  const { tab: mode, setTab: setMode } = useQueryTab({
    defaultValue: "planMode",
    allowedValues: ["planMode", "budget"] as const,
    removeWhenDefault: true,
  });
  const activeMode = mode;

  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(true);

  const {
    planTitle,
    totalDays,
    days,
    items,
    setActiveDay,
    safeActiveDay,
    dayQueries,
    openByDay,
    setOpenByDay,
    isAllDaysSettled,
    isAllDaysEmpty,
    isInitialLoading,
  } = usePlanBlockData({
    planId,
  });

  // 지도 실제 표시 여부 (settled 전에는 무조건 false)
  const shouldShowMap =
    isAllDaysSettled &&
    activeMode === "planMode" &&
    isMapVisible &&
    !isAllDaysEmpty;

  // 초기 데이터 로딩 상태
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="typography-body-body-reg text-muted-foreground">
          일정을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 - sticky */}
      <div className="sticky top-0 z-20">
        {activeMode === "budget" ? (
          <ProjectHeader
            variant="edit"
            title="편집모드"
            showCalendarButton
            isCalendarVisible={isCalendarVisible}
            onCalendar={() => setIsCalendarVisible((prev) => !prev)}
            className="backdrop-blur-md bg-background/60"
          />
        ) : (
          <ProjectHeader
            variant="edit"
            title="편집모드"
            showMapButton
            isMapVisible={isMapVisible}
            onMap={() => setIsMapVisible((prev) => !prev)}
            mapDisabled={isAllDaysSettled && isAllDaysEmpty}
            showCalendarButton
            isCalendarVisible={isCalendarVisible}
            onCalendar={() => setIsCalendarVisible((prev) => !prev)}
            className="backdrop-blur-md bg-background/60"
          />
        )}
      </div>

      {/* 지도 - sticky */}
      {shouldShowMap && (
        <div className="sticky top-16 z-10">
          <GoogleMap
            showZoomControls
            center={{ lat: 37.566535, lng: 126.977969 }}
            zoom={15}
            markerPosition={{ lat: 37.566535, lng: 126.977969 }}
            className="w-full h-45 rounded-none"
          />
        </div>
      )}

      {/* PlanHeader - 스크롤 */}
      <div className="px-5 py-4">
        <PlanHeader
          title={planTitle}
          day={totalDays || 0}
          href={`/projects/${planId}/edit`}
          isEditing
          isEditBudget={activeMode === "budget" ? true : false}
        />
      </div>

      {/* DayNav - sticky (지도 아래) */}
      {isCalendarVisible && (
        <div
          className="sticky z-10 bg-background overflow-hidden"
          style={{
            top: `${64 + (shouldShowMap ? 180 : 0)}px`,
          }}
        >
          <div className="relative">
            <DayNav
              items={items}
              value={safeActiveDay}
              onValueChange={(value) => {
                setActiveDay(value);

                const el = document.getElementById(`day-section-${value}`);
                if (!el) return;
                const mapHeight = shouldShowMap ? 180 : 0;
                const offset = 64 + mapHeight + 56; // header + map + DayNav(h-14)
                const top =
                  el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
              }}
              className="gap-2.25 py-3 h-14"
              itemClassName="h-8 py-1.5"
            />
            <div className="pointer-events-none absolute top-0 -right-1.25 w-14 h-14 bg-[linear-gradient(90deg,rgba(252,252,252,0)_0%,rgba(252,252,252,1)_100%)]" />
          </div>
        </div>
      )}

      <main className="flex flex-col pb-32">
        {days.map((day, idx) => {
          const q = dayQueries[idx];
          const isEmpty = !!q?.data && (q.data.contents?.length ?? 0) === 0;
          const isOpen = openByDay[day] ?? !isEmpty;
          const dateText = q?.data
            ? formatDayInfoText(q.data.date, q.data.dayOfWeek)
            : "";

          return (
            <div key={day} id={`day-section-${day}`}>
              <div id={`day-sentinel-${day}`} data-day={day} className="h-px" />
              <DayHeader
                day={day}
                date={dateText}
                open={isOpen}
                onOpenChange={(next) =>
                  setOpenByDay((prev) => ({ ...prev, [day]: next }))
                }
                disabled={q?.data ? isEmpty : false}
              >
                {activeMode === "planMode" ? (
                  // Plan
                  <DayTimeBlocks
                    planId={planId}
                    day={day}
                    data={q?.data}
                    isEdit
                  />
                ) : (
                  // Budget
                  <></>
                )}
              </DayHeader>
            </div>
          );
        })}
      </main>

      <div className="fixed bottom-0 left-0 w-full">
        <NavigationBar
          variant={activeMode === "budget" ? "variant3" : "variant2"}
          activeMode={activeMode}
          onPlanModeClick={() => setMode("planMode")}
          onBudgetClick={() => setMode("budget")}
          onAddPlaceClick={() => router.push(`/projects/${planId}/add-place`)}
        />
      </div>
    </div>
  );
};

export default PlanEditPage;
