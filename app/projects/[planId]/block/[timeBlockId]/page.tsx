"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import HeaderBtn from "@/components/layout/HeaderBtn";
import NavigationBar from "@/components/layout/NavigationBar";
import AISummarySection from "@/components/common/AISummarySection";
import OpinionCard from "@/components/common/OpinionCard";
import OpinionProfile from "@/components/common/OpinionProfile";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GoogleMap from "@/components/common/GoogleMap";
import { Calendar, MapPin, Sparkles, SquareArrowOutUpRight } from "lucide-react";
import { useParams } from "next/navigation";
import type { OpinionCategoryKey } from "@/lib/opinion-bottom-sheet";
import { useBlockDetail } from "@/lib/hooks/use-block-detail";

const MEMO_MAX_LENGTH = 300;

const resolveOpinionCategoryKey = (category: string): OpinionCategoryKey => {
  if (category.includes("식당") || category.includes("주점")) return "FNB";
  if (category.includes("카페") || category.includes("디저트")) return "DESSERT";
  if (category.includes("숙소")) return "STAY";
  if (category.includes("쇼핑")) return "SHOPPING";
  if (
    category.includes("관광") ||
    category.includes("문화") ||
    category.includes("공원") ||
    category.includes("자연")
  ) {
    return "TOUR";
  }

  return "GENERAL";
};

const BlockDetailPage = () => {
  const params = useParams<{ planId: string | string[]; timeBlockId: string | string[] }>();
  const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
  const blockId = Array.isArray(params.timeBlockId) ? params.timeBlockId[0] : params.timeBlockId;

  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoDraft, setMemoDraft] = useState("");

  const {
    data: blockDetail,
    isLoading,
    isError,
  } = useBlockDetail({
    planId,
    blockId,
    enabled: Boolean(planId && blockId),
  });

  const placeName = blockDetail?.placeName ?? "";
  const category = blockDetail?.category ?? "";
  const address = blockDetail?.address ?? "";
  const aiSummary = blockDetail?.aiSummary ?? "";
  const sourceTitle = blockDetail?.sourceTitle ?? "";
  const sourceUrl = blockDetail?.sourceUrl;
  const externalUrl = blockDetail?.googleMapsUri;
  const latitude = blockDetail?.latitude;
  const longitude = blockDetail?.longitude;
  const coverImageUrl = blockDetail?.photoUrls?.[0];
  const memo = blockDetail?.memo ?? "";
  const myPlanMemberId = blockDetail?.myPlanMemberId;
  const opinions = blockDetail?.opinions ?? [];
  const opinionCategoryKey = resolveOpinionCategoryKey(category);
  const dayText = `${blockDetail?.day ?? 0}일차`;
  const dateText = (() => {
    if (!blockDetail?.date) return "";
    const date = new Date(blockDetail.date);
    if (Number.isNaN(date.getTime())) return blockDetail.date;
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  })();
  const timeText =
    blockDetail?.startTime && blockDetail?.endTime
      ? `${blockDetail.startTime}~${blockDetail.endTime}`
      : "";

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEditMemo = () => {
    setMemoDraft(memo);
    setIsEditingMemo(true);
  };

  const handleSaveMemo = () => {
    setMemoDraft((prev) => prev.slice(0, MEMO_MAX_LENGTH));
    setIsEditingMemo(false);
  };

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-hidden pb-[calc(72px+env(safe-area-inset-bottom)+16px)]">
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
        <div className="flex flex-col gap-16 pt-7 px-5 rounded-t-2xl bg-background min-w-0">
          <div className="flex flex-col w-full min-w-0">
            <h2 className="flex justify-between items-center w-full h-8 py-0.5 px-1">
              <span className="typography-title-lg-sb text-foreground">
                {placeName}
              </span>
              <span className="typography-body-sm-bold text-muted-foreground">
                {category}
              </span>
            </h2>
            <div className="flex-1 flex flex-col w-full gap-5 pt-4">
              <div className="flex flex-col gap-1 w-full">
                <hr className="border-border" />
                <div className="flex justify-between items-center w-full h-11">
                  <div className="flex items-center gap-2.25">
                    <MapPin className="size-6 text-[#0EA5E9]" />
                    <span className="typography-body-sm-md text-foreground">
                      {address}
                    </span>
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
              <div className="flex flex-col gap-1 w-full">
                <div className="w-full h-9.5 flex flex-col gap-3.5">
                  <div className="w-full h-6 flex items-center justify-between">
                    <div className="h-6 flex items-center gap-1.75">
                      <Calendar className="size-6 text-[#0EA5E9]" />
                      <span className="typography-body-sm-sb text-black align-middle">
                        {dayText}
                      </span>
                      <span className="typography-body-sm-reg text-muted-foreground align-middle">
                        {dateText}
                      </span>
                    </div>
                    <div className="h-6 flex items-center gap-1.75">
                      <span className="typography-body-sm-reg text-muted-foreground align-middle">
                        {timeText}
                      </span>
                    </div>
                  </div>
                </div>
                <hr className="border-border" />
              </div>
              <div className="flex flex-col gap-0 w-full">
                <Label
                  isEditing={isEditingMemo}
                  onEdit={handleEditMemo}
                  onSave={handleSaveMemo}
                  className="w-full h-9"
                >
                  <span className="typography-label-sm-sb text-foreground align-middle">
                    메모
                  </span>
                </Label>
                <div className="w-full">
                  {isEditingMemo ? (
                    <Textarea
                      placeholder="텍스트를 입력해주세요."
                      value={memoDraft}
                      onChange={(e) => setMemoDraft(e.target.value.slice(0, MEMO_MAX_LENGTH))}
                      maxLength={MEMO_MAX_LENGTH}
                      className="typography-body-base! text-foreground!"
                    />
                  ) : (
                    <div className="flex items-start gap-2.5 py-2.5">
                      <p className="w-full whitespace-pre-wrap wrap-break-word align-middle typography-body-base text-foreground">
                        {memo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full h-57 rounded-xl overflow-hidden">
                {latitude !== undefined && longitude !== undefined ? (
                  <GoogleMap
                    center={{ lat: latitude, lng: longitude }}
                    zoom={15}
                    markerPosition={{ lat: latitude, lng: longitude }}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted typography-body-sm-reg text-muted-foreground">
                    지도를 불러오는 중...
                  </div>
                )}
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
              <div className="w-full flex flex-col gap-4">
                <div className="w-full h-6 flex items-center justify-between">
                  <div className="w-full h-6 flex items-center">
                    <span className="typography-label-base-sb text-black align-middle">
                      팀원들의 의견
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-6">
                  {opinions.length === 0 ? (
                    <div className="flex h-20 items-center justify-center rounded-xl bg-card typography-body-sm-reg text-muted-foreground">
                      아직 등록된 의견이 없어요.
                    </div>
                  ) : (
                    opinions.map((opinion) => (
                      <div
                        key={opinion.opinion_Id}
                        className="flex w-full flex-col gap-2.25"
                      >
                        <OpinionProfile
                          nickname={opinion.added_by.nickname}
                          picture={opinion.added_by.picture}
                          isOwn={myPlanMemberId === opinion.added_by.plan_member_id}
                          onEdit={() => {}}
                          onDelete={() => {}}
                        />
                        <OpinionCard
                          opinion={opinion}
                          categoryKey={opinionCategoryKey}
                          showDividerBetweenTagsAndComment
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {isError && (
              <p className="px-1 typography-caption-xs-reg text-destructive">
                블록 정보를 불러오지 못했습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      <NavigationBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default BlockDetailPage;
