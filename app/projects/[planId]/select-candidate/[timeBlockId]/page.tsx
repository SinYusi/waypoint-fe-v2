"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="center"
        title="후보지 선택"
        showBackButton
        onBack={() => router.back()}
        className="fixed inset-x-0 top-0 z-10 bg-background"
      />
      <main className="flex flex-1 flex-col pt-16 px-5">
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
