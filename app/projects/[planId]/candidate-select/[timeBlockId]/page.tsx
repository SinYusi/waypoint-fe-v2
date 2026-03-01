"use client";

import Header from "@/components/layout/Header";
import DayNav from "@/components/common/DayNav";
import PlanCardSelection from "@/components/card/PlanCardSelection";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddCollectionPlace } from "@/lib/hooks/collection/use-add-collection-place";
import { useCollectionPlacePreference } from "@/lib/hooks/collection/use-collection-place-preference";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { usePlaceSearch } from "@/lib/hooks/use-place-search";
import { useAddPlanBlockCandidates } from "@/lib/hooks/plan/use-create-plan-block";
import { usePlanCollectionPlaces } from "@/lib/hooks/plan/use-plan-collection-places";
import { usePlanCollections } from "@/lib/hooks/plan/use-plan-collections";
import { normalizePickPassPreference } from "@/lib/utils/pick-pass-preference";
import CollectionEmptyIllust from "@/public/illust/collection-empty.svg";
import { MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const AddPlanPage = () => {
	const params = useParams<{ planId: string | string[]; timeBlockId: string | string[] }>();
	const router = useRouter();
	const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
	const timeBlockId = Array.isArray(params.timeBlockId)
		? params.timeBlockId[0]
		: params.timeBlockId;
	const { data: planCollectionsData, isLoading: isPlanCollectionsLoading } = usePlanCollections(
		planId ?? "",
	);
	const planCollections = useMemo(() => planCollectionsData ?? [], [planCollectionsData]);
	const isPlanCollectionsReady = !isPlanCollectionsLoading;
	const isPlanCollectionsEmpty = isPlanCollectionsReady && planCollections.length === 0;
	const hasPlanCollections = isPlanCollectionsReady && planCollections.length > 0;

	const dayItems = useMemo(
		() =>
			planCollections.map((collection) => ({
				value: collection.collection_id,
				label: collection.title,
			})),
		[planCollections],
	);
	const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"saved" | "search">("saved");
	const [selectedPlaceByCollection, setSelectedPlaceByCollection] = useState<
		Record<string, string | null>
	>({});
	const [query, setQuery] = useState("");
	const [selectedSearchPlaceId, setSelectedSearchPlaceId] = useState<string | null>(null);
	const selectedDay =
		selectedCollectionId && dayItems.some((item) => item.value === selectedCollectionId)
			? selectedCollectionId
			: (dayItems[0]?.value ?? "");
	const selectedPlaceId = selectedPlaceByCollection[selectedDay] ?? null;
	const moveToSavedFirst = () => {
		setActiveTab("saved");
		setSelectedCollectionId(null);
		setSelectedSearchPlaceId(null);
		setQuery("");
		window.scrollTo({ top: 0, behavior: "auto" });
		router.refresh();
	};

	const handlePlaceSelected = (collectionPlaceId: string, selected: boolean) => {
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
	} = usePlanCollectionPlaces(planId ?? "", selectedDay, {
		size: 20,
	});
	const places = placesData?.pages.flatMap((page) => page.contents) ?? [];
	const { data: searchedPlaces = [] } = usePlaceSearch(query);
	const { mutate: postPreference } = useCollectionPlacePreference();
	const { mutate: addCollectionPlace, isPending: isAddingCollectionPlace } =
		useAddCollectionPlace({
			onSuccess: (data) => {
				if (!planId || !timeBlockId) return;
				addCandidatesToBlock({
					planId,
					timeBlockId,
					body: {
						collection_place_ids: [data.collection_place_id],
					},
				});
				setSelectedSearchPlaceId(null);
			},
			onError: (err) => {
				const detail = err.response?.data?.detail?.toLowerCase() ?? "";
				const code = err.response?.data?.code?.toLowerCase() ?? "";
				const reason = err.response?.data?.errors?.[0]?.reason?.toLowerCase() ?? "";
				const isAlreadyExistsError =
					detail.includes("이미") ||
					reason.includes("이미") ||
					detail.includes("already") ||
					reason.includes("already") ||
					code.includes("already") ||
					code.includes("duplicate");

				if (isAlreadyExistsError) {
					moveToSavedFirst();
				}
			},
		});
	const { mutate: addCandidatesToBlock, isPending: isAddingCandidates } =
		useAddPlanBlockCandidates({
			onSuccess: () => {
				moveToSavedFirst();
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
		if (!timeBlockId) return;

		addCandidatesToBlock({
			planId,
			timeBlockId,
			body: {
				collection_place_ids: [selectedPlaceId],
			},
		});
	};

	const handlePreference = (
		collectionPlaceId: string,
		type: "PICK" | "PASS",
	) => {
		if (!selectedDay) return;

		postPreference({
			collectionId: selectedDay,
			collectionPlaceId,
			type,
		});
	};

	const handleOpenPlaceAddFromSearch = () => {
		if (!planId || !selectedSearchPlaceId) return;
		if (!timeBlockId) return;

		if (!selectedDay) {
			handleCreateCollection();
			return;
		}

		addCollectionPlace({
			collectionId: selectedDay,
			place_id: selectedSearchPlaceId,
		});
	};

	const handleOpenManualAdd = () => {
		if (!planId || !selectedDay) return;
		const search = new URLSearchParams({
			mode: "candidate",
			collectionId: selectedDay,
		});
		router.push(
			`/projects/${planId}/candidate-select/${timeBlockId}/manual?${search.toString()}`,
		);
	};

	const handleCreateCollection = () => {
		router.push("/home/create");
	};

	const renderEmptyCollections = () => (
		<div className="flex flex-col items-center gap-12 px-5 py-8">
			<div className="flex flex-col gap-5 items-center">
				<CollectionEmptyIllust />
				<div className="flex flex-col text-center gap-2">
					<h2 className="typography-display-xl">우리만의 장소 보관함 만들기</h2>
					<p className="typography-body-sm-md">
						함께 꿈꾸는 여행지들을 보관함에 담고,
						<br />
						서로 가고 싶은 곳들을 자유롭게 나눠볼까요?
					</p>
				</div>
			</div>
			<Button onClick={handleCreateCollection} className="w-full">
				새 보관함 만들기
			</Button>
		</div>
	);

	return (
		<div className="scrollbar-hide flex min-h-screen flex-col overflow-y-auto bg-background">
			<Header
				variant="center"
				title="후보지 선택"
				showBackButton
				rightBtnBgVariant="glass"
				className="fixed inset-x-0 top-0 z-10"
			/>

			<main className="flex flex-1 flex-col pt-16 pb-24">
				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as "saved" | "search")}
				>
					<TabsList style="underline" fullWidth className="w-full px-5">
						<TabsTrigger value="saved" style="underline" fullWidth>
							보관함
						</TabsTrigger>
						<TabsTrigger value="search" style="underline" fullWidth>
							장소 검색
						</TabsTrigger>
					</TabsList>


					<TabsContent value="saved">
						{isPlanCollectionsLoading ? (
							<div className="px-5 py-8 typography-body-sm-md text-muted-foreground">
								보관함을 불러오는 중...
							</div>
						) : isPlanCollectionsEmpty ? (
							renderEmptyCollections()
						) : (
							<div className="flex w-full flex-col px-5 py-5">
								{dayItems.length > 0 && (
									<DayNav
										items={dayItems}
										value={selectedDay}
										onValueChange={setSelectedCollectionId}
										className="w-full px-0"
										ariaLabel="컬렉션 선택"
									/>
								)}

								<div className="mt-4 flex w-full flex-col gap-4 self-center">
									{places.map((item) => (
										<PlanCardSelection
											key={item.collection_place_id}
											isSelected={selectedPlaceId === item.collection_place_id}
											onSelected={(selected) =>
												handlePlaceSelected(item.collection_place_id, selected)
											}
											title={item.place.name}
											address={item.place.address}
											imageSrc={item.place.photos[0]}
											pickCount={item.pick_pass.picked.count}
											passCount={item.pick_pass.passed.count}
											myPreference={normalizePickPassPreference(item.pick_pass.my_preference)}
											onPickClick={() =>
												handlePreference(item.collection_place_id, "PICK")
											}
											onPassClick={() =>
												handlePreference(item.collection_place_id, "PASS")
											}
										/>
									))}
									<div ref={loadMoreRef} className="h-10" />
								</div>
							</div>
						)}
					</TabsContent>
					<TabsContent value="search" className="px-5">
						<div className="flex flex-col gap-4 py-5">
							<InputForm
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setSelectedSearchPlaceId(null);
								}}
								placeholder="장소를 검색해 주세요"
							/>
							<div className="flex flex-col gap-4">
								{searchedPlaces.map((place) => {
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
												setSelectedSearchPlaceId(isSelected ? null : place.place_id)
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
								})}
								{query.length > 0 && (
									<Button
										variant="ghost"
										className="w-full typography-action-sm-reg text-muted-foreground"
										onClick={handleOpenManualAdd}
										disabled={!selectedDay}
									>
										장소를 찾지 못하시겠나요?
									</Button>
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
						onClick={activeTab === "saved" ? handleAddToPlan : handleOpenPlaceAddFromSearch}
						className="h-11 w-full rounded-2xl bg-primary px-8 py-0 text-primary-foreground"
						disabled={
							(activeTab === "saved" &&
								(!hasPlanCollections || !selectedPlaceId || !timeBlockId || isAddingCandidates)) ||
							(activeTab === "search" &&
								(!selectedSearchPlaceId ||
									!timeBlockId ||
									isAddingCollectionPlace ||
									isAddingCandidates))
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
