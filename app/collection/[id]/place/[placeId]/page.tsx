"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import HeaderBtn from "@/components/layout/HeaderBtn";
import NavigationBar from "@/components/layout/NavigationBar";
import VoteBtn from "@/components/common/VoteBtn";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GoogleMap from "@/components/common/GoogleMap";
import { MapPin, SquareArrowOutUpRight, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import YoutubeIcon from "@/public/icons/youtube.svg";
import {
  usePlaceDetail,
  useUpdatePlaceMemo,
  useUpdatePlacePreference,
} from "@/lib/hooks/use-place-detail";

const PlaceDetailPage = () => {
  const params = useParams<{ id: string | string[]; placeId: string | string[] }>();
  const collectionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const collectionPlaceId = Array.isArray(params.placeId) ? params.placeId[0] : params.placeId;

  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memo, setMemo] = useState("");
  const [isPickActive, setIsPickActive] = useState(false);
  const [isPassActive, setIsPassActive] = useState(false);

  const { data: placeDetail } = usePlaceDetail({
    collectionId,
    collectionPlaceId,
    enabled: Boolean(collectionId && collectionPlaceId),
  });
  const updatePlaceMemoMutation = useUpdatePlaceMemo({
    collectionId,
    collectionPlaceId,
  });
  const updatePlacePreferenceMutation = useUpdatePlacePreference({
    collectionId,
    collectionPlaceId,
  });

  const placeName = placeDetail?.name ?? "헤이리 예술 마을";
  const category = placeDetail?.category ?? "관광지";
  const address = placeDetail?.address ?? "서울시 마포구 와우산로";
  const aiSummary =
    placeDetail?.aiSummary ??
    "이 컨텐츠는 유튜버 상인이 파주 맛집을 투어 한 내용입니다. 유튜버 상인은 헤이리 예술 마을을 뛰놀며 즐겁게 놀았습니다.";
  const sourceTitle = placeDetail?.sourceTitle ?? "상인 튜브 - 파주 팡팡 맛집 투어";
  const sourceUrl = placeDetail?.sourceUrl;
  const externalUrl = placeDetail?.externalUrl;
  const pickCount = placeDetail?.pickCount ?? 0;
  const passCount = placeDetail?.passCount ?? 0;
  const latitude = placeDetail?.latitude ?? 37.5665;
  const longitude = placeDetail?.longitude ?? 126.978;
  const coverImageUrl = placeDetail?.photoUrls?.[0];

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEditMemo = () => {
    setIsEditingMemo(true);
  };

  const handleSaveMemo = () => {
    if (!collectionId || !collectionPlaceId) return;

    updatePlaceMemoMutation.mutate(
      { memo },
      {
        onSuccess: () => {
          setIsEditingMemo(false);
        },
      },
    );
  };

  const handleVoteToggle = (type: "PICK" | "PASS") => {
    if (!collectionId || !collectionPlaceId || updatePlacePreferenceMutation.isPending) return;

    if (type === "PICK") {
      setIsPickActive(true);
      setIsPassActive(false);
    } else {
      setIsPassActive(true);
      setIsPickActive(false);
    }

    updatePlacePreferenceMutation.mutate({ type });
  };

  const handleVoteCountClick = (type: "PICK" | "PASS") => {
    // TODO: PICK/PASS 참여자 Bottom Sheet 연결 예정
    console.log(`${type} 참여자 목록 열기`);
  };

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-hidden pb-[calc(72px+env(safe-area-inset-bottom)+16px)]">
      {/* 이미지 영역 */}
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
        <div className="absolute top-0 left-0 right-0 z-10">
          <Header showBackButton leftBtnBgVariant="glass" />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
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
              {/* 주소 영역 */}
              <div className="flex flex-col gap-1 w-full">
                <hr className="border-border" />
                <div className="flex justify-between items-center w-full h-11">
                  <div className="flex items-center gap-2.25">
                    <MapPin className="size-6 text-muted-foreground" />
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
              {/* 투표 버튼 영역 */}
              <div className="flex gap-3 w-full pb-3.5">
                <VoteBtn
                  type="pick"
                  count={pickCount}
                  isActive={isPickActive}
                  onToggle={() => handleVoteToggle("PICK")}
                  onCountClick={() => handleVoteCountClick("PICK")}
                />
                <VoteBtn
                  type="pass"
                  count={passCount}
                  isActive={isPassActive}
                  onToggle={() => handleVoteToggle("PASS")}
                  onCountClick={() => handleVoteCountClick("PASS")}
                />
              </div>
              {/* 메모 영역 */}
              <div className="flex flex-col gap-2 w-full">
                <Label
                  isEditing={isEditingMemo}
                  onEdit={handleEditMemo}
                  onSave={handleSaveMemo}
                >
                  메모
                </Label>
                <Textarea
                  placeholder="텍스트를 입력해주세요."
                  value={isEditingMemo ? memo : (placeDetail?.memo ?? "")}
                  onChange={(e) => setMemo(e.target.value)}
                  disabled={!isEditingMemo || updatePlaceMemoMutation.isPending}
                />
              </div>
              {/* 지도 영역 */}
              <div className="w-full h-57 rounded-xl overflow-hidden">
                <GoogleMap
                  center={{ lat: latitude, lng: longitude }}
                  zoom={15}
                  markerPosition={{ lat: latitude, lng: longitude }}
                  className="w-full h-full"
                />
              </div>
              {/* AI 요약 영역 */}
              <div className="flex flex-col gap-3 w-full py-2">
                <div className="flex items-center gap-1 w-full h-6">
                  <Sparkles className="size-6 text-foreground" />
                  <span className="typography-label-base-bold text-foreground">
                    AI 요약
                  </span>
                </div>
                <div className="flex flex-col w-full p-4 rounded-xl bg-muted">
                  <p className="typography-body-sm-reg text-foreground">
                    {aiSummary}
                  </p>
                  <hr className="my-4 border-border" />
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center size-4 shrink-0">
                        <YoutubeIcon />
                      </div>
                      <span className="typography-caption-xs-reg text-muted-foreground">
                        {sourceTitle}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openInNewTab(sourceUrl)}
                      disabled={!sourceUrl}
                      className={sourceUrl ? "cursor-pointer" : "cursor-not-allowed"}
                      aria-label="소셜 원문 링크 열기"
                    >
                      <SquareArrowOutUpRight className="size-4.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavigationBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default PlaceDetailPage;
