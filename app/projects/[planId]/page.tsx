"use client";

import { useState } from "react";
import DayNav from "@/components/common/DayNav";
import GoogleMap from "@/components/common/GoogleMap";
import { DayHeader } from "@/components/layout/DayHeader";
import NavigationBar from "@/components/layout/NavigationBar";
import PlanHeader from "@/components/layout/PlanHeader";
import ProjectHeader from "@/components/layout/ProjectHeader";

const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

const formatDayDate = (startDate: string, dayIndex: number) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + dayIndex);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dow = DAYS_KO[date.getDay()];
  return `${date.getFullYear()}.${mm}.${dd} (${dow})`;
};

const PlanPage = () => {
  const [activeMode, setActiveMode] = useState<"planMode" | "budget">("planMode");
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const startDate = "2026-02-24";
  const items = [
    {
      value: "1",
      label: "Day 1",
    },
    {
      value: "2",
      label: "Day 2",
    },
    {
      value: "3",
      label: "Day 3",
    },
    {
      value: "4",
      label: "Day 4",
    },
    {
      value: "5",
      label: "Day 5",
    },
    {
      value: "6",
      label: "Day 6",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen">
      {activeMode === "budget" ? (
        <ProjectHeader
          variant="view"
          showCalendarButton
          isCalendarVisible={isCalendarVisible}
          onCalendar={() => setIsCalendarVisible((prev) => !prev)}
          showMenuButton
          className="backdrop-blur-md"
        />
      ) : (
        <ProjectHeader
          showMapButton
          isMapVisible={isMapVisible}
          onMap={() => setIsMapVisible((prev) => !prev)}
          showCalendarButton
          isCalendarVisible={isCalendarVisible}
          onCalendar={() => setIsCalendarVisible((prev) => !prev)}
          showMenuButton
          className="backdrop-blur-md"
        />
      )}

      <div className="flex flex-col">
        {activeMode === "planMode" && isMapVisible && (
          <GoogleMap
            showZoomControls
            center={{ lat: 37.566535, lng: 126.977969 }}
            zoom={15}
            markerPosition={{ lat: 37.566535, lng: 126.977969 }}
            className="w-full h-45 rounded-none"
          />
        )}
        <div className="px-5 py-4">
          <PlanHeader title="제주도 여행" day={15} href="" />
        </div>
        {isCalendarVisible && (
          <DayNav
            items={items}
            className="gap-2.25 py-3 h-14"
            itemClassName="h-8 py-1.5"
            onValueChange={(value) => {
              document.getElementById(`day-section-${value}`)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          />
        )}
      </div>
      <main className="flex flex-col">
        {items.map((item) => (
          <div key={item.value} id={`day-section-${item.value}`}>
            <DayHeader
              day={Number(item.value)}
              date={formatDayDate(startDate, Number(item.value) - 1)}
              defaultOpen
            />
          </div>
        ))}
      </main>
      <div className="fixed bottom-0 left-0 w-full">
        <NavigationBar
          variant="variant3"
          onPlanModeClick={() => setActiveMode("planMode")}
          onBudgetClick={() => setActiveMode("budget")}
        />
      </div>
    </div>
  );
};

export default PlanPage;