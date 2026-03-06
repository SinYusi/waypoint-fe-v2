"use client";

import Header from "@/components/layout/Header";
import DayNav from "@/components/common/DayNav";
import PlanCardSelection from "@/components/card/PlanCardSelection";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { usePlaceSearch } from "@/lib/hooks/use-place-search";
import { useAddPlanBlockCandidates } from "@/lib/hooks/plan/use-create-plan-block";
import { usePlanCollectionPlaces } from "@/lib/hooks/plan/use-plan-collection-places";
import { usePlanCollections } from "@/lib/hooks/plan/use-plan-collections";
import PlaceEmptyIllust from "@/public/illust/place-empty_new.svg";
import CollectionEmptyIllust from "@/public/illust/collection-empty.svg";
import SearchPlaceEmptyIllust from "@/public/illust/search-place-empty.svg";
import { MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const AddPlanPage = () => {
  const params = useParams<{
    planId: string | string[];
    timeBlockId: string | string[];
  }>();
  const router = useRouter();
  const planId = Array.isArray(params.planId)
    ? params.planId[0]
    : params.planId;
  const timeBlockId = Array.isArray(params.timeBlockId)
    ? params.timeBlockId[0]
    : params.timeBlockId;
  const { data: planCollectionsData, isLoading: isPlanCollectionsLoading } =
    usePlanCollections(planId ?? "");
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
  const [activeTab, setActiveTab] = useState<"saved" | "search">("saved");
  // 보관함 탭
  const [selectedPlaceIdsByCollection, setSelectedPlaceIdsByCollection] =
    useState<Record<string, string[]>>({});
  // 검색 탭
  const [query, setQuery] = useState("");
  const [selectedSearchPlaceId, setSelectedSearchPlaceId] = useState<
    string | null
  >(null);
  const selectedDay =
    selectedCollectionId &&
    dayItems.some((item) => item.value === selectedCollectionId)
      ? selectedCollectionId
      : (dayItems[0]?.value ?? "");
  const selectedPlaceIds = selectedPlaceIdsByCollection[selectedDay] ?? [];

  const handlePlaceSelected = (
    collectionPlaceId: string,
    selected: boolean,
  ) => {
    if (!selectedDay) return;

    setSelectedPlaceIdsByCollection((prev) => {
      const prevIds = prev[selectedDay] ?? [];
      const nextIds = selected
        ? Array.from(new Set([...prevIds, collectionPlaceId]))
        : prevIds.filter((id) => id !== collectionPlaceId);

      return { ...prev, [selectedDay]: nextIds };
    });
  };
  const {
    data: placesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPlacesLoading,
  } = usePlanCollectionPlaces(planId ?? "", selectedDay, {
    size: 20,
  });
  const places = placesData?.pages.flatMap((page) => page.contents) ?? [];
  const {
    data: searchedPlaces = [],
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = usePlaceSearch(query);

  // 후보지 추가 훅
  const { mutate: addCandidatesToBlock, isPending: isAddingCandidates } =
    useAddPlanBlockCandidates({
      onSuccess: () => {
        router.push(`/projects/${planId}/plan-edit`);
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

  // 보관함 탭: collection_place_ids 배열로 추가
  const handleAddToPlanFromSaved = () => {
    if (!planId || !timeBlockId) return;
    if (!selectedDay || selectedPlaceIds.length === 0) return;

    addCandidatesToBlock({
      planId,
      timeBlockId,
      body: {
        collection_place_ids: selectedPlaceIds,
      },
    });
  };

  // 검색 탭: place_id로 추가
  const handleAddToPlanFromSearch = () => {
    if (!planId || !timeBlockId) return;
    if (!selectedSearchPlaceId) return;

    addCandidatesToBlock({
      planId,
      timeBlockId,
      body: {
        place_ids: [selectedSearchPlaceId],
      },
    });
  };

  //   const handleOpenManualAdd = () => {
  //     if (!planId || !selectedDay) return;
  //     const search = new URLSearchParams({
  //       mode: "candidate",
  //       collectionId: selectedDay,
  //     });
  //     router.push(
  //       `/projects/${planId}/candidate-select/${timeBlockId}/manual?${search.toString()}`,
  //     );
  //   };

  return (
    <div className="scrollbar-hide flex min-h-screen flex-col overflow-y-auto bg-background">
      <Header
        variant="center"
        title="후보지 선택"
        showBackButton
        rightBtnBgVariant="glass"
        className="fixed inset-x-0 top-0 z-10 bg-background"
      />

      <main className="flex flex-1 flex-col pt-16 pb-24">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "saved" | "search")}
          className="flex flex-1 flex-col"
        >
          <TabsList style="underline" fullWidth className="w-full px-5">
            <TabsTrigger value="saved" style="underline" fullWidth>
              보관함
            </TabsTrigger>
            <TabsTrigger value="search" style="underline" fullWidth>
              장소 검색
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
                          selectionType="check"
                          isSelected={selectedPlaceIds.includes(
                            item.collection_place_id,
                          )}
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
                    disabled={!selectedDay}
                  >
                    장소를 찾지 못하시겠나요?
                  </Button>
                )} */}
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
                ? handleAddToPlanFromSaved
                : handleAddToPlanFromSearch
            }
            className="h-11 w-full rounded-2xl bg-primary px-8 py-0 text-primary-foreground"
            disabled={
              (activeTab === "saved" &&
                (!hasPlanCollections ||
                  selectedPlaceIds.length === 0 ||
                  !timeBlockId ||
                  isAddingCandidates)) ||
              (activeTab === "search" &&
                (!selectedSearchPlaceId || !timeBlockId || isAddingCandidates))
            }
          >
            후보지 추가하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPlanPage;
