"use client";

import DayNav from "@/components/common/DayNav";
import GoogleMap from "@/components/common/GoogleMap";
import PlanHeader from "@/components/layout/PlanHeader";
import ProjectHeader from "@/components/layout/ProjectHeader";

const PlanPage = () => {
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
      <main className="flex flex-col"></main>
    </div>
  );
};

export default PlanPage;