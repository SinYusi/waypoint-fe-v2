"use client";

import DayNav from "@/components/common/DayNav";
import GoogleMap from "@/components/common/GoogleMap";
import { DayHeader } from "@/components/layout/DayHeader";
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
      <ProjectHeader
        showMapButton
        showCalendarButton
        showMenuButton
        className="backdrop-blur-md"
      />

      <div className="flex flex-col">
        <GoogleMap
          showZoomControls
          center={{ lat: 37.566535, lng: 126.977969 }}
          zoom={15}
          markerPosition={{ lat: 37.566535, lng: 126.977969 }}
          className="w-full h-45 rounded-none"
        />
        <div className="px-5 py-4">
          <PlanHeader title="제주도 여행" day={15} href="" />
        </div>
        <DayNav
          items={items}
          className="gap-2.25 py-3 h-14"
          itemClassName="h-8 py-1.5"
        />
      </div>
      <main className="flex flex-col">
        {items.map((item) => (
          <DayHeader
            key={item.value}
            day={Number(item.value)}
            date={formatDayDate(startDate, Number(item.value) - 1)}
            defaultOpen
          />
        ))}
      </main>
    </div>
  );
};

export default PlanPage;