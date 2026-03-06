"use client";

import AISummarySection from "@/components/common/AISummarySection";
import Header from "@/components/layout/Header";
import HeaderBtn from "@/components/layout/HeaderBtn";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field-description";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePlanBlock,
  useCreatePlanBlockByPlace,
} from "@/lib/hooks/plan/use-create-plan-block";
import { usePlanCollectionPlaceDetail } from "@/lib/hooks/plan/use-plan-collection-place-detail";
import { MapPin, Sparkles, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import type { KeyboardEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const DEFAULT_TIME = "00:00";

const toDigitIndex = (cursor: number) => {
  if (cursor <= 1) return cursor;
  if (cursor === 2) return 2;
  return Math.min(cursor - 1, 3);
};

const toCursorPosition = (digitIndex: number) => {
  if (digitIndex <= 1) return digitIndex;
  return digitIndex + 1;
};

const replaceTimeDigit = (
  value: string,
  digitIndex: number,
  nextDigit: string,
) => {
  const chars = value.split("");
  const valueIndex = digitIndex >= 2 ? digitIndex + 1 : digitIndex;
  chars[valueIndex] = nextDigit;
  return chars.join("");
};

const setCaret = (input: HTMLInputElement, digitIndex: number) => {
  const pos = toCursorPosition(Math.max(0, Math.min(4, digitIndex)));
  requestAnimationFrame(() => input.setSelectionRange(pos, pos));
};

const isValidTime = (value: string) => {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hour, minute] = value.split(":").map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

const toMinutes = (value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
};

const MEMO_POLICY_REGEX =
  /^[\p{Script=Hangul}\p{L}\p{N}\p{Extended_Pictographic}\p{Emoji_Modifier}\u200D\uFE0F !@#$%^&*()\-_+=\[\]{}.,?\/\n]*$/u;

const normalizeMemo = (value: string) =>
  value
    .normalize("NFC")
    .replace(/\u00A0/g, " ")
    .replace(/\r\n?/g, "\n");

const ProjectPlaceAddPage = () => {
  const router = useRouter();
  const params = useParams<{ planId: string | string[] }>();
  const planId = Array.isArray(params.planId)
    ? params.planId[0]
    : params.planId;
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId") ?? "";
  const collectionPlaceId = searchParams.get("placeId") ?? "";
  const source = searchParams.get("source") ?? "";
  const isSearchSource = source === "search";
  const isManualSource = source === "manual";
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState(DEFAULT_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_TIME);
  const [memo, setMemo] = useState("");
  const [submitError, setSubmitError] = useState("");

  const searchPlace = useMemo(() => {
    if (!isSearchSource || typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("project:selected-search-place");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as {
        place_id: string;
        name: string;
        address: string;
        category?: { level2?: { name?: string } };
        google_maps_uri?: string;
        photos?: string[];
      };
    } catch {
      return null;
    }
  }, [isSearchSource]);

  const manualPlace = useMemo(() => {
    if (!isManualSource || typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("project:selected-manual-place");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as {
        name: string;
        address: string;
        tag?: string;
        memo?: string;
        google_maps_uri?: string;
      };
    } catch {
      return null;
    }
  }, [isManualSource]);

  const {
    data: placeDetail,
    isLoading,
    isError,
  } = usePlanCollectionPlaceDetail({
    planId,
    collectionId,
    collectionPlaceId,
    enabled: Boolean(
      !isSearchSource && planId && collectionId && collectionPlaceId,
    ),
  });

  const placeName =
    placeDetail?.name ?? searchPlace?.name ?? manualPlace?.name ?? "";
  const category =
    placeDetail?.category ??
    searchPlace?.category?.level2?.name ??
    manualPlace?.tag ??
    "";
  const address =
    placeDetail?.address ?? searchPlace?.address ?? manualPlace?.address ?? "";
  const aiSummary = placeDetail?.aiSummary ?? "";
  const sourceTitle = placeDetail?.sourceTitle ?? "";
  const sourceUrl = placeDetail?.sourceUrl;
  const externalUrl =
    placeDetail?.externalUrl ??
    searchPlace?.google_maps_uri ??
    manualPlace?.google_maps_uri;
  const coverImageUrl = placeDetail?.photoUrls?.[0] ?? searchPlace?.photos?.[0];
  const dayNumber = useMemo(() => Number(day.replace(/[^\d]/g, "")), [day]);
  const normalizedMemo = useMemo(() => normalizeMemo(memo), [memo]);
  const isStartTimeValid = isValidTime(startTime);
  const isEndTimeValid = isValidTime(endTime);
  const isStartNotAfterEnd =
    isStartTimeValid && isEndTimeValid
      ? toMinutes(startTime) <= toMinutes(endTime)
      : false;
  const isMemoPolicyValid = MEMO_POLICY_REGEX.test(normalizedMemo);
  const canSubmit =
    !!planId &&
    (!!collectionPlaceId || !!searchPlace?.place_id || isManualSource) &&
    Number.isInteger(dayNumber) &&
    dayNumber > 0 &&
    isStartTimeValid &&
    isEndTimeValid &&
    isStartNotAfterEnd &&
    isMemoPolicyValid;

  const { mutate: createBlock, isPending: isCreatingBlock } =
    useCreatePlanBlock({
      onSuccess: () => {
        setSubmitError("");
        router.push(`/projects/${planId}/plan-edit`);
      },
      onError: (err) => {
        const message =
          err.response?.data?.errors?.[0]?.reason ??
          err.response?.data?.detail ??
          "블록 추가에 실패했어요. 잠시 후 다시 시도해 주세요.";

        setSubmitError(message);
      },
    });
  const { mutate: createBlockByPlace, isPending: isCreatingBlockByPlace } =
    useCreatePlanBlockByPlace({
      onSuccess: () => {
        setSubmitError("");
        router.push(`/projects/${planId}/plan-edit`);
      },
      onError: (err) => {
        const message =
          err.response?.data?.errors?.[0]?.reason ??
          err.response?.data?.detail ??
          "블록 추가에 실패했어요. 잠시 후 다시 시도해 주세요.";

        setSubmitError(message);
      },
    });

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleTimeKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
    setValue: (next: string) => void,
  ) => {
    const input = e.currentTarget;
    const key = e.key;

    if (
      key === "Tab" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Home" ||
      key === "End"
    ) {
      return;
    }

    const cursor = input.selectionStart ?? 0;
    const digitIndex = toDigitIndex(cursor);

    if (/^\d$/.test(key)) {
      e.preventDefault();
      const next = replaceTimeDigit(value, digitIndex, key);
      setValue(next);
      setCaret(input, digitIndex + 1);
      return;
    }

    if (key === "Backspace") {
      e.preventDefault();
      const prevDigitIndex = Math.max(0, digitIndex - (cursor > 0 ? 1 : 0));
      const next = replaceTimeDigit(value, prevDigitIndex, "0");
      setValue(next);
      setCaret(input, prevDigitIndex);
      return;
    }

    if (key === "Delete") {
      e.preventDefault();
      const next = replaceTimeDigit(value, digitIndex, "0");
      setValue(next);
      setCaret(input, digitIndex);
      return;
    }

    if (key === ":") {
      e.preventDefault();
      setCaret(input, 2);
      return;
    }

    e.preventDefault();
  };

  const handleComplete = () => {
    if (!canSubmit || !planId) return;
    setSubmitError("");

    if (isSearchSource || isManualSource) {
      createBlockByPlace({
        planId,
        body: {
          place_id: searchPlace?.place_id,
          day: dayNumber,
          start_time: startTime,
          end_time: endTime,
          memo: normalizedMemo.trim() || undefined,
        },
      });
      return;
    }

    if (!collectionPlaceId) return;

    createBlock({
      planId,
      body: {
        type: "PLACE",
        collection_place_id: collectionPlaceId,
        day: dayNumber,
        start_time: startTime,
        end_time: endTime,
        memo: normalizedMemo.trim() || undefined,
      },
    });
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
        <div className="flex flex-col gap-8 pt-7 px-5 pb-30 rounded-t-2xl bg-background min-w-0">
          <div className="flex flex-col w-full min-w-0">
            <h2 className="flex justify-between items-center w-full h-8 py-0.5 px-1">
              <span className="typography-title-lg-sb text-foreground">
                {placeName}
              </span>
              <span className="typography-body-sm-bold text-muted-foreground">
                {category}
              </span>
            </h2>

            <div className="flex flex-col gap-5 pt-4">
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
                    onClick={
                      externalUrl ? () => openInNewTab(externalUrl) : undefined
                    }
                  />
                </div>
                <hr className="border-border" />
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="day" required>
                    <span className="typography-label-sm-sb text-foreground">
                      날짜
                    </span>
                  </Label>
                  <InputForm
                    id="day"
                    hideIcon
                    placeholder="예) 1일차"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="start-time" required>
                    <span className="typography-label-sm-sb text-foreground">
                      시작 시간
                    </span>
                  </Label>
                  <InputForm
                    id="start-time"
                    hideIcon
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={startTime}
                    onKeyDown={(e) =>
                      handleTimeKeyDown(e, startTime, setStartTime)
                    }
                    onFocus={(e) => setCaret(e.currentTarget, 0)}
                    onChange={() => {}}
                    error={!isStartTimeValid || !isStartNotAfterEnd}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="end-time" required>
                    <span className="typography-label-sm-sb text-foreground">
                      종료 시간
                    </span>
                  </Label>
                  <InputForm
                    id="end-time"
                    hideIcon
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={endTime}
                    onKeyDown={(e) => handleTimeKeyDown(e, endTime, setEndTime)}
                    onFocus={(e) => setCaret(e.currentTarget, 0)}
                    onChange={() => {}}
                    error={!isEndTimeValid || !isStartNotAfterEnd}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="memo">
                    <span className="typography-label-sm-sb text-foreground">
                      메모
                    </span>
                  </Label>
                  <Textarea
                    id="memo"
                    placeholder="메모를 입력해 주세요"
                    value={memo}
                    onChange={(e) => {
                      setMemo(e.target.value);
                      if (submitError) setSubmitError("");
                    }}
                    error={memo.length > 0 && !isMemoPolicyValid}
                    className="min-w-0 bg-muted"
                  />
                  {memo.length > 0 && !isMemoPolicyValid && (
                    <FieldDescription error>
                      한글, 영문, 숫자, 이모지, 특수문자(!@#$%^&*()-_+=[]{}{" "}
                      ,.?/) 및 줄바꿈만 사용할 수 있습니다.
                    </FieldDescription>
                  )}
                </div>
              </div>

              <AISummarySection
                isLoading={isLoading}
                headerIcon={<Sparkles className="size-6 text-foreground" />}
                title="AI 요약"
                summary={
                  aiSummary ||
                  (isSearchSource ? "AI 요약 정보가 아직 없습니다." : "")
                }
                sourceTitle={sourceTitle}
                sourceUrl={sourceUrl}
                onOpenLink={openInNewTab}
              />

              {isError && (
                <p className="px-1 typography-caption-xs-reg text-destructive">
                  장소 정보를 불러오지 못했습니다.
                </p>
              )}
              {submitError && (
                <p className="px-1 typography-caption-xs-reg text-destructive">
                  {submitError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 h-22.75 border-t border-border bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 inset-x-0 h-12 bg-gradient-bottom-fade"
        />
        <div className="px-5 pt-4">
          <Button
            className="h-11 w-full rounded-2xl bg-primary px-8 py-0 text-primary-foreground"
            onClick={handleComplete}
            disabled={!canSubmit || isCreatingBlock || isCreatingBlockByPlace}
          >
            작성완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlaceAddPage;
