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
import { MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const AddPlanPage = () => {
	// TODO: 타겟 time_block_id 연결 필요
	const TARGET_TIME_BLOCK_ID = "";
	const params = useParams<{ planId: string | string[] }>();
	const router = useRouter();
	const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
	const { data: planCollections = [] } = usePlanCollections(planId ?? "");

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
				if (!planId || !TARGET_TIME_BLOCK_ID) return;
				addCandidatesToBlock({
					planId,
					timeBlockId: TARGET_TIME_BLOCK_ID,
					body: {
						collection_place_ids: [data.collection_place_id],
					},
				});
				setSelectedSearchPlaceId(null);
			},
		});
	const { mutate: addCandidatesToBlock, isPending: isAddingCandidates } =
		useAddPlanBlockCandidates();
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
		if (!TARGET_TIME_BLOCK_ID) return;

		addCandidatesToBlock({
			planId,
			timeBlockId: TARGET_TIME_BLOCK_ID,
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
		if (!planId || !selectedDay || !selectedSearchPlaceId) return;
		if (!TARGET_TIME_BLOCK_ID) return;
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
		// TODO: manual 후보지 추가에서도 time_block_id 연결 필요
		if (TARGET_TIME_BLOCK_ID) {
			search.set("timeBlockId", TARGET_TIME_BLOCK_ID);
		}
		router.push(`/projects/${planId}/candidate-select/manual?${search.toString()}`);
	};

	return (
		<div className="flex min-h-screen flex-col bg-background">
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
										myPreference={
											item.pick_pass.my_preference === "NOTHING"
												? null
												: item.pick_pass.my_preference
										}
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

			{activeTab === "saved" && (
				<div className="fixed inset-x-0 bottom-0 z-50 h-22.75 border-t border-border bg-background">
					<div
						aria-hidden
						className="pointer-events-none absolute -top-12 inset-x-0 h-12 bg-gradient-bottom-fade"
					/>
					<div className="px-5 pt-4">
						<Button
							onClick={handleAddToPlan}
							className="h-11 w-full rounded-2xl bg-primary px-8 py-0 text-primary-foreground"
							disabled={!selectedPlaceId || !TARGET_TIME_BLOCK_ID || isAddingCandidates}
						>
							후보지 추가하기
						</Button>
					</div>
				</div>
			)}

			{activeTab === "search" && (
				<div className="fixed inset-x-0 bottom-0 z-50 h-22.75 border-t border-border bg-background">
					<div
						aria-hidden
						className="pointer-events-none absolute -top-12 inset-x-0 h-12 bg-gradient-bottom-fade"
					/>
					<div className="px-5 pt-4">
						<Button
							onClick={handleOpenPlaceAddFromSearch}
							className="h-11 w-full rounded-2xl bg-primary px-8 py-0 text-primary-foreground"
							disabled={
								!selectedSearchPlaceId ||
								!selectedDay ||
								!TARGET_TIME_BLOCK_ID ||
								isAddingCollectionPlace ||
								isAddingCandidates
							}
						>
							후보지 추가하기
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddPlanPage;
