"use client";

import AISummarySection from "@/components/common/AISummarySection";
import Header from "@/components/layout/Header";
import HeaderBtn from "@/components/layout/HeaderBtn";
import { usePlanCollectionPlaceDetail } from "@/lib/hooks/plan/use-plan-collection-place-detail";
import { MapPin, Sparkles, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";

const ProjectPlaceAddPage = () => {
  const params = useParams<{ planId: string | string[] }>();
  const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId") ?? "";
  const collectionPlaceId = searchParams.get("placeId") ?? "";

  const { data: placeDetail, isLoading, isError } = usePlanCollectionPlaceDetail({
    planId,
    collectionId,
    collectionPlaceId,
    enabled: Boolean(planId && collectionId && collectionPlaceId),
  });

  const placeName = placeDetail?.name ?? "";
  const category = placeDetail?.category ?? "";
  const address = placeDetail?.address ?? "";
  const aiSummary = placeDetail?.aiSummary ?? "";
  const sourceTitle = placeDetail?.sourceTitle ?? "";
  const sourceUrl = placeDetail?.sourceUrl;
  const externalUrl = placeDetail?.externalUrl;
  const coverImageUrl = placeDetail?.photoUrls?.[0];

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-hidden bg-background">
      <Header
        showBackButton
        leftBtnBgVariant="glass"
        className="fixed top-0 inset-x-0 z-50"
      />

      <div className="fixed top-0 left-0 right-0 w-full aspect-5/3 bg-muted z-0">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={placeName}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="relative pt-[calc(60%-17px)]">
        <div className="flex flex-col gap-8 pt-7 px-5 pb-10 rounded-t-2xl bg-background min-w-0">
          <div className="flex flex-col w-full min-w-0">
            <h2 className="flex justify-between items-center w-full h-8 py-0.5 px-1">
              <span className="typography-title-lg-sb text-foreground">{placeName}</span>
              <span className="typography-body-sm-bold text-muted-foreground">{category}</span>
            </h2>

            <div className="flex flex-col gap-5 pt-4">
              <div className="flex flex-col gap-1 w-full">
                <hr className="border-border" />
                <div className="flex justify-between items-center w-full h-11">
                  <div className="flex items-center gap-2.25">
                    <MapPin className="size-6 text-muted-foreground" />
                    <span className="typography-body-sm-md text-foreground">{address}</span>
                  </div>
                  <HeaderBtn
                    bgVariant="ghost"
                    icon={SquareArrowOutUpRight}
                    label="외부 링크"
                    onClick={externalUrl ? () => openInNewTab(externalUrl) : undefined}
                  />
                </div>
                <hr className="border-border" />
              </div>

              <AISummarySection
                isLoading={isLoading}
                headerIcon={<Sparkles className="size-6 text-foreground" />}
                title="AI 요약"
                summary={aiSummary}
                sourceTitle={sourceTitle}
                sourceUrl={sourceUrl}
                onOpenLink={openInNewTab}
              />

              {isError && (
                <p className="px-1 typography-caption-xs-reg text-destructive">
                  장소 정보를 불러오지 못했습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlaceAddPage;
