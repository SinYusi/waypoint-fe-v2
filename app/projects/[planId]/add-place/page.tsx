"use client";

import Header from "@/components/layout/Header";
import DayNav from "@/components/common/DayNav";
import PlanCardSelection from "@/components/card/PlanCardSelection";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field-description";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { usePlaceSearch } from "@/lib/hooks/use-place-search";
import { useCreatePlanBlock } from "@/lib/hooks/plan/use-create-plan-block";
import { usePlanCollectionPlaces } from "@/lib/hooks/plan/use-plan-collection-places";
import { usePlanCollections } from "@/lib/hooks/plan/use-plan-collections";
import PlaceEmptyIllust from "@/public/illust/place-empty_new.svg";
import CollectionEmptyIllust from "@/public/illust/collection-empty.svg";
import SearchPlaceEmptyIllust from "@/public/illust/search-place-empty.svg";
import { MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

const AddPlanPage = () => {
  const params = useParams<{ planId: string | string[] }>();
  const router = useRouter();
  const planId = Array.isArray(params.planId)
    ? params.planId[0]
    : params.planId;
  const { data: planCollectionsData, isLoading: isPlanCollectionsLoading } =
    usePlanCollections(planId ?? "", {
      staleTime: 60_000,
    });
  const planCollections = useMemo(
    () => planCollectionsData ?? [],
    [planCollectionsData],
  );
  const isPlanCollectionsReady = !isPlanCollectionsLoading;
  const isPlanCollectionsEmpty =
    isPlanCollectionsReady && planCollections.length === 0;
  const hasPlanCollections =
    isPlanCollectionsReady && planCollections.length > 0;

  const dayItems = useMemo(
    () =>
      planCollections.map((collection) => ({
        value: collection.collection_id,
        label: collection.title,
      })),
    [planCollections],
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState<"saved" | "search" | "free">(
    "saved",
  );
  const [selectedPlaceByCollection, setSelectedPlaceByCollection] = useState<
    Record<string, string | null>
  >({});
  const [query, setQuery] = useState("");
  const [selectedSearchPlaceId, setSelectedSearchPlaceId] = useState<
    string | null
  >(null);
  const [freeDay, setFreeDay] = useState("");
  const [freeStartTime, setFreeStartTime] = useState(DEFAULT_TIME);
  const [freeEndTime, setFreeEndTime] = useState(DEFAULT_TIME);
  const [freeMemo, setFreeMemo] = useState("");
  const [freeSubmitError, setFreeSubmitError] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const selectedDay =
    selectedCollectionId &&
    dayItems.some((item) => item.value === selectedCollectionId)
      ? selectedCollectionId
      : (dayItems[0]?.value ?? "");
  const selectedPlaceId = selectedPlaceByCollection[selectedDay] ?? null;
  const freeDayNumber = useMemo(
    () => Number(freeDay.replace(/[^\d]/g, "")),
    [freeDay],
  );
  const normalizedFreeMemo = useMemo(() => normalizeMemo(freeMemo), [freeMemo]);
  const isFreeStartTimeValid = isValidTime(freeStartTime);
  const isFreeEndTimeValid = isValidTime(freeEndTime);
  const isFreeStartNotAfterEnd =
    isFreeStartTimeValid && isFreeEndTimeValid
      ? toMinutes(freeStartTime) <= toMinutes(freeEndTime)
      : false;
  const isFreeMemoPolicyValid = MEMO_POLICY_REGEX.test(normalizedFreeMemo);
  const canSubmitFree =
    !!planId &&
    Number.isInteger(freeDayNumber) &&
    freeDayNumber > 0 &&
    isFreeStartTimeValid &&
    isFreeEndTimeValid &&
    isFreeStartNotAfterEnd &&
    isFreeMemoPolicyValid;
  const searchableQuery = activeTab === "search" ? debouncedQuery : "";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  const handlePlaceSelected = (
    collectionPlaceId: string,
    selected: boolean,
  ) => {
    if (!selectedDay) return;

    setSelectedPlaceByCollection((prev) => {
      return {
        ...prev,
        [selectedDay]: selected ? collectionPlaceId : null,
      };
    });
  };
  const {
    data: placesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPlacesLoading,
  } = usePlanCollectionPlaces(
    planId ?? "",
    selectedDay,
    {
      size: 20,
    },
    {
      staleTime: 60_000,
    },
  );
  const places = placesData?.pages.flatMap((page) => page.contents) ?? [];
  const {
    data: searchedPlaces = [],
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = usePlaceSearch(searchableQuery, {
    staleTime: 60_000,
  });
  const { mutate: createBlock, isPending: isCreatingBlock } =
    useCreatePlanBlock({
      onSuccess: () => {
        setFreeSubmitError("");
        setActiveTab("saved");
        setSelectedCollectionId(null);
        setFreeDay("");
        setFreeStartTime(DEFAULT_TIME);
        setFreeEndTime(DEFAULT_TIME);
        setFreeMemo("");
        router.push(`/projects/${planId}/plan-edit`);
      },
      onError: (err) => {
        const message =
          err.response?.data?.errors?.[0]?.reason ??
          err.response?.data?.detail ??
          "자유 시간 추가에 실패했어요. 잠시 후 다시 시도해 주세요.";
        setFreeSubmitError(message);
      },
    });
  const handleIntersect = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  const loadMoreRef = useIntersectionObserver({
    onIntersect: handleIntersect,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  const handleAddToPlan = () => {
    if (!planId || !selectedDay || !selectedPlaceId) return;
    router.push(
      `/projects/${planId}/place-add?collectionId=${selectedDay}&placeId=${selectedPlaceId}`,
    );
  };

  const handleOpenPlaceAddFromSearch = () => {
    if (!planId || !selectedSearchPlaceId) return;
    const selectedPlace = searchedPlaces.find(
      (place) => place.place_id === selectedSearchPlaceId,
    );
    if (!selectedPlace) return;
    window.sessionStorage.setItem(
      "project:selected-search-place",
      JSON.stringify(selectedPlace),
    );
    router.push(
      `/projects/${planId}/place-add?collectionId=${selectedDay}&source=search`,
    );
  };

  //   const handleOpenManualAdd = () => {
  //     if (!planId) return;
  //     router.push(`/projects/${planId}/add-place/manual`);
  //   };

  const handleFreeTimeKeyDown = (
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

  const handleAddFreeTimeToPlan = () => {
    if (!canSubmitFree || !planId) return;
    setFreeSubmitError("");

    createBlock({
      planId,
      body: {
        type: "FREE",
        day: freeDayNumber,
        start_time: freeStartTime,
        end_time: freeEndTime,
        memo: normalizedFreeMemo.trim() || undefined,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        variant="center"
        title="일정 추가"
        showBackButton
        rightBtnBgVariant="glass"
        className="fixed inset-x-0 top-0 z-10 bg-background"
      />

      <main className="flex flex-1 flex-col pt-16 pb-24">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "saved" | "search" | "free")
          }
          className="flex flex-1 flex-col"
        >
          <TabsList style="underline" fullWidth className="w-full px-5">
            <TabsTrigger value="saved" style="underline" fullWidth>
              보관함
            </TabsTrigger>
            <TabsTrigger value="search" style="underline" fullWidth>
              장소 검색
            </TabsTrigger>
            <TabsTrigger value="free" style="underline" fullWidth>
              자유 시간
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="flex flex-1 flex-col">
            {isPlanCollectionsLoading ? (
              <div className="flex flex-1 w-full items-center justify-center px-5 typography-body-sm-md text-muted-foreground">
                보관함을 불러오는 중...
              </div>
            ) : isPlanCollectionsEmpty ? (
              <div className="flex flex-1 w-full flex-col items-center justify-center px-5">
                <div className="flex w-full flex-col items-center gap-5">
                  <div className="flex w-full flex-col items-center gap-5">
                    <CollectionEmptyIllust />
                    <div className="flex flex-col items-center gap-2 text-center">
                      <h2 className="typography-display-lg-bold text-foreground">
                        연결된 보관함이 없어요
                      </h2>
                      <p className="typography-body-sm-md text-foreground">
                        보관함을 연결해서 미리 담아둔 장소를 불러올 수 있어요
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      router.push(`/projects/${planId}/collection-manage`)
                    }
                    size="M"
                    className="typography-action-sm-bold"
                  >
                    보관함 연결하러 가기
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 w-full flex-col items-center px-5">
                {dayItems.length > 0 && (
                  <DayNav
                    items={dayItems}
                    value={selectedDay}
                    onValueChange={setSelectedCollectionId}
                    className="w-full px-0"
                    ariaLabel="컬렉션 선택"
                  />
                )}

                <div
                  className={`flex flex-1 w-full flex-col gap-4 ${!isPlacesLoading && places.length === 0 ? "items-center justify-center" : "pt-5"}`}
                >
                  {!isPlacesLoading && places.length === 0 ? (
                    <div className="flex w-full flex-col items-center gap-5">
                      <div className="flex w-full flex-col items-center gap-5">
                        <PlaceEmptyIllust />
                        <div className="flex flex-col items-center gap-2 text-center">
                          <h2 className="typography-display-lg-bold text-foreground">
                            이 보관함은 아직 비어있어요!
                          </h2>
                          <p className="typography-body-sm-md text-foreground">
                            장소를 보관함에 저장하고,
                            <br />
                            여행 계획을 시작해보세요
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col gap-4">
                      {places.map((item) => (
                        <PlanCardSelection
                          key={item.collection_place_id}
                          isSelected={
                            selectedPlaceId === item.collection_place_id
                          }
                          onSelected={(selected) =>
                            handlePlaceSelected(
                              item.collection_place_id,
                              selected,
                            )
                          }
                          title={item.place.name}
                          address={item.place.address}
                          imageSrc={item.place.photos[0]}
                          pickCount={item.pick_pass.picked.count}
                          passCount={item.pick_pass.passed.count}
                        />
                      ))}
                      <div ref={loadMoreRef} className="h-10" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="search" className="px-5 flex flex-col flex-1">
            <div className="flex flex-1 flex-col gap-4 py-5">
              <InputForm
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedSearchPlaceId(null);
                }}
                placeholder="장소를 검색해 주세요"
              />
              <div className="flex flex-1 flex-col gap-4">
                {/* 1) 검색어 없을 때 */}
                {query.trim().length === 0 ? (
                  <></>
                ) : isSearchLoading || isSearchFetching ? (
                  /* 2) 로딩 중 */
                  <div className="flex flex-1 items-center justify-center py-10 text-center typography-body-sm-md text-muted-foreground">
                    검색 중...
                  </div>
                ) : isSearchError ? (
                  /* 3) 에러 */
                  <div className="flex flex-1 items-center justify-center py-10 text-center typography-body-sm-md text-destructive">
                    검색에 실패했어요. 잠시 후 다시 시도해 주세요.
                  </div>
                ) : searchedPlaces.length === 0 ? (
                  /* 4) 결과 없음 */
                  <div className="flex flex-1 flex-col items-center justify-center gap-5">
                    <div className="py-3">
                      <SearchPlaceEmptyIllust />
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <span className="typography-display-lg-bold">
                        검색 결과가 없습니다.
                      </span>
                      <p className="typography-body-sm-reg">
                        검색어를 다시 한 번 확인하고
                        <br />
                        검색어를 시도해보세요
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 5) 결과 있음 */
                  searchedPlaces.map((place) => {
                    const isSelected = selectedSearchPlaceId === place.place_id;
                    return (
                      <button
                        key={place.place_id}
                        type="button"
                        className={`w-full rounded-2xl px-5 py-4 text-left ${
                          isSelected
                            ? "border-2 border-primary bg-muted"
                            : "border-2 border-transparent bg-muted"
                        }`}
                        onClick={() =>
                          setSelectedSearchPlaceId(
                            isSelected ? null : place.place_id,
                          )
                        }
                      >
                        <p className="typography-action-base-bold text-foreground">
                          {place.name}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          <MapPin
                            className="size-4.5 shrink-0 text-[#737373]"
                            strokeWidth={2}
                          />
                          <p className="typography-body-sm-reg text-muted-foreground">
                            {place.address}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}

                {/* {query.length > 0 && (
                  <Button
                    variant="ghost"
                    className="w-full typography-action-sm-reg text-muted-foreground"
                    onClick={handleOpenManualAdd}
                  >
                    장소를 찾지 못하시겠나요?
                  </Button>
                )} */}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="free" className="px-5">
            <div className="flex flex-col gap-8 py-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="free-day" required>
                  <span className="typography-label-sm-sb text-foreground">
                    날짜
                  </span>
                </Label>
                <InputForm
                  id="free-day"
                  hideIcon
                  placeholder="예) 1일차"
                  value={freeDay}
                  onChange={(e) => setFreeDay(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="free-start-time" required>
                  <span className="typography-label-sm-sb text-foreground">
                    시작 시간
                  </span>
                </Label>
                <InputForm
                  id="free-start-time"
                  hideIcon
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={freeStartTime}
                  onKeyDown={(e) =>
                    handleFreeTimeKeyDown(e, freeStartTime, setFreeStartTime)
                  }
                  onFocus={(e) => setCaret(e.currentTarget, 0)}
                  onChange={() => {}}
                  error={!isFreeStartTimeValid || !isFreeStartNotAfterEnd}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="free-end-time" required>
                  <span className="typography-label-sm-sb text-foreground">
                    종료 시간
                  </span>
                </Label>
                <InputForm
                  id="free-end-time"
                  hideIcon
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={freeEndTime}
                  onKeyDown={(e) =>
                    handleFreeTimeKeyDown(e, freeEndTime, setFreeEndTime)
                  }
                  onFocus={(e) => setCaret(e.currentTarget, 0)}
                  onChange={() => {}}
                  error={!isFreeEndTimeValid || !isFreeStartNotAfterEnd}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="free-memo">
                  <span className="typography-label-sm-sb text-foreground">
                    메모
                  </span>
                </Label>
                <Textarea
                  id="free-memo"
                  placeholder="메모를 입력해 주세요"
                  value={freeMemo}
                  onChange={(e) => {
                    setFreeMemo(e.target.value);
                    if (freeSubmitError) setFreeSubmitError("");
                  }}
                  error={freeMemo.length > 0 && !isFreeMemoPolicyValid}
                  className="bg-muted"
                />
                {freeMemo.length > 0 && !isFreeMemoPolicyValid && (
                  <FieldDescription error>
                    한글, 영문, 숫자, 이모지, 특수문자(!@#$%^&*()-_+=[]{} ,.?/)
                    및 줄바꿈만 사용할 수 있습니다.
                  </FieldDescription>
                )}
                {freeSubmitError && (
                  <p className="px-1 typography-caption-xs-reg text-destructive">
                    {freeSubmitError}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 h-22.75 border-t border-border bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 inset-x-0 h-12 bg-gradient-bottom-fade"
        />
        <div className="px-5 pt-4">
          <Button
            onClick={
              activeTab === "saved"
                ? handleAddToPlan
                : activeTab === "search"
                  ? handleOpenPlaceAddFromSearch
                  : handleAddFreeTimeToPlan
            }
            className="h-11 w-full rounded-2xl bg-primary px-8 py-0 text-primary-foreground"
            disabled={
              (activeTab === "saved" &&
                (!hasPlanCollections || !selectedPlaceId)) ||
              (activeTab === "search" && !selectedSearchPlaceId) ||
              (activeTab === "free" && (!canSubmitFree || isCreatingBlock))
            }
          >
            여행 계획에 추가하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPlanPage;
