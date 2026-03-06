"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import GoogleMap, {
  type OverlayMarkerItem,
} from "@/components/common/GoogleMap";
import CandidatePin from "@/components/card/CandidatePin";
import CandidateSelectCard from "@/components/card/CandidateSelectCard";
import { useCandidates } from "@/lib/hooks/plan/use-candidates";
import { useSelectCandidate } from "@/lib/hooks/plan/use-select-candidate";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import type {
  OpinionCategoryKey,
  BlockOpinion,
} from "@/lib/opinion-bottom-sheet";

const toCategoryKey = (level2Name?: string): OpinionCategoryKey => {
  switch (level2Name) {
    case "식당":
    case "주점":
    case "유흥":
      return "FNB";
    case "카페":
    case "디저트":
      return "DESSERT";
    case "숙소":
      return "STAY";
    case "쇼핑":
      return "SHOPPING";
    case "관광명소":
    case "문화예술":
    case "관람":
    case "공원":
    case "자연":
    case "테마파크":
    case "액티비티":
      return "TOUR";
    default:
      return "GENERAL";
  }
};

// opinion_summary distribution → BlockOpinion[] 로 변환 (카운트 기반)
const toOpinions = (distribution: {
  positive: number;
  neutral: number;
  negative: number;
}): BlockOpinion[] => [
  ...Array(distribution.positive).fill({
    opinion_Id: "",
    type: "POSITIVE",
    comment: "",
    tag_ids: [],
    added_by: { plan_member_id: "", nickname: "", picture: "" },
  }),
  ...Array(distribution.neutral).fill({
    opinion_Id: "",
    type: "NEUTRAL",
    comment: "",
    tag_ids: [],
    added_by: { plan_member_id: "", nickname: "", picture: "" },
  }),
  ...Array(distribution.negative).fill({
    opinion_Id: "",
    type: "NEGATIVE",
    comment: "",
    tag_ids: [],
    added_by: { plan_member_id: "", nickname: "", picture: "" },
  }),
];

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
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: selectCandidateMutate, isPending } = useSelectCandidate({
    onSuccess: () => router.replace(`/projects/${planId}`),
  });

  const rootsRef = useRef<Root[]>([]);
  const [overlayMarkers, setOverlayMarkers] = useState<OverlayMarkerItem[]>([]);

  useEffect(() => {
    const prevRoots = rootsRef.current;
    rootsRef.current = [];
    setTimeout(() => prevRoots.forEach((r) => r.unmount()), 0);

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
      const roots = rootsRef.current;
      rootsRef.current = [];
      setTimeout(() => roots.forEach((r) => r.unmount()), 0);
    };
  }, [data]);

  const mapCenter = overlayMarkers[0]?.position ?? {
    lat: 37.5665,
    lng: 126.978,
  };
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
      <div className="fixed top-15 z-10 left-0 right-0">
        <GoogleMap
          center={mapCenter}
          zoom={14}
          overlayMarkers={overlayMarkers}
          fitPositions={fitPositions}
          className="w-full h-52 rounded-none"
          showZoomControls
        />
      </div>

      <main className="flex flex-1 flex-col px-5 pt-72">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="typography-body-sm-reg text-muted-foreground">
              불러오는 중...
            </p>
          </div>
        )}
        {data && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col py-0.5 border-b-2 gap-3">
              <div className="flex gap-1.5 items-center">
                <p className="typography-display-lg-bold">{data.title}</p>
                <p className="typography-body-sm-sb">·</p>
                <p className="typography-body-sm-sb">
                  후보지 {data.candidate_count}개
                </p>
              </div>
              <div className="flex pb-3 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <CalendarIcon color="#0ea5e9" className="size-6" />
                  <p className="typography-body-sm-sb">
                    {data.day_info.day}일차
                  </p>
                  <p className="typography-body-sm-reg">
                    {data.day_info.date.replace(
                      /^(\d{4})-(\d{2})-(\d{2})$/,
                      (_, y, m, d) =>
                        `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`,
                    )}
                  </p>
                </div>
                <p className="typography-body-sm-reg text-muted-foreground">
                  {data.start_time}~{data.end_time}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 pb-16">
              {data.candidates.map((c, i) => (
                <CandidateSelectCard
                  key={c.block_id}
                  index={i + 1}
                  placeName={c.place.name}
                  writerNickname={c.added_by.nickname}
                  writerProfileImageUrl={c.added_by.picture}
                  categoryKey={toCategoryKey(c.place.category.level2?.name)}
                  imageUrl={c.place.photos?.[0]}
                  memo={c.memo}
                  amount={
                    c.expense_items.reduce((sum, item) => sum + item.cost, 0) ||
                    undefined
                  }
                  opinions={toOpinions(c.opinion_summary.distribution)}
                  isSelected={selectedBlockId === c.block_id}
                  onSelect={() =>
                    setSelectedBlockId((prev) =>
                      prev === c.block_id ? null : c.block_id,
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 inset-x-0 px-5 bg-background py-3">
        <Button
          className="w-full h-11 rounded-2xl typography-action-sm-bold"
          disabled={!selectedBlockId}
          onClick={() => setConfirmOpen(true)}
        >
          후보지 선택하기
        </Button>
      </div>

      <AppAlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="후보지를 선택하시겠습니까?"
        description="후보지를 선택한 이후에도 언제든지 다시 변경할 수 있어요."
        cancelLabel="취소하기"
        actionLabel="선택하기"
        actionClassName="bg-primary hover:bg-primary/90"
        actionDisabled={isPending}
        onAction={() => {
          if (!selectedBlockId) return;
          selectCandidateMutate({ planId, timeBlockId, blockId: selectedBlockId });
        }}
      />
    </div>
  );
};

export default SelectCandidatePage;
