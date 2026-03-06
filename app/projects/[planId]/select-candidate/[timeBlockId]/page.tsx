"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import GoogleMap, { type OverlayMarkerItem } from "@/components/common/GoogleMap";
import CandidatePin from "@/components/card/CandidatePin";
import { useCandidates } from "@/lib/hooks/plan/use-candidates";

const SelectCandidatePage = () => {
  const params = useParams<{ planId: string; timeBlockId: string }>();
  const router = useRouter();

  const planId = Array.isArray(params.planId)
    ? params.planId[0]
    : params.planId;
  const timeBlockId = Array.isArray(params.timeBlockId)
    ? params.timeBlockId[0]
    : params.timeBlockId;

  const { data, isLoading } = useCandidates(planId, timeBlockId);

  const rootsRef = useRef<Root[]>([]);
  const [overlayMarkers, setOverlayMarkers] = useState<OverlayMarkerItem[]>([]);

  useEffect(() => {
    rootsRef.current.forEach((r) => r.unmount());
    rootsRef.current = [];

    if (!data) {
      setOverlayMarkers([]);
      return;
    }

    const items: OverlayMarkerItem[] = data.candidates.map((c, i) => {
      const el = document.createElement("div");
      const root = createRoot(el);
      root.render(<CandidatePin index={i + 1} />);
      rootsRef.current.push(root);
      return {
        position: {
          lat: Number(c.place.point.latitude),
          lng: Number(c.place.point.longitude),
        },
        element: el,
      };
    });

    setOverlayMarkers(items);

    return () => {
      rootsRef.current.forEach((r) => r.unmount());
      rootsRef.current = [];
    };
  }, [data]);

  const mapCenter = overlayMarkers[0]?.position ?? { lat: 37.5665, lng: 126.978 };
  const fitPositions = overlayMarkers.map((m) => m.position);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="center"
        title="후보지 선택"
        showBackButton
        onBack={() => router.back()}
        className="fixed inset-x-0 top-0 z-10 bg-background"
      />

      {/* 지도 영역 - 헤더 바로 아래 */}
      <div className="sticky top-16 z-10">
        <GoogleMap
          center={mapCenter}
          zoom={14}
          overlayMarkers={overlayMarkers}
          fitPositions={fitPositions}
          className="w-full h-52 rounded-none"
          showZoomControls
        />
      </div>

      <main className="flex flex-1 flex-col px-5">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="typography-body-sm-reg text-muted-foreground">
              불러오는 중...
            </p>
          </div>
        )}
        {data && (
          <div className="py-4 flex flex-col gap-4">
            <p className="typography-display-xl">{data.title}</p>
            <p className="typography-body-sm-reg text-muted-foreground">
              Day {data.day_info.day} · {data.day_info.date} · {data.start_time} ~ {data.end_time}
            </p>
            <p className="typography-action-sm-bold">
              후보지 {data.candidate_count}개
            </p>
            {/* TODO: 후보지 선택 UI */}
          </div>
        )}
      </main>
    </div>
  );
};

export default SelectCandidatePage;
