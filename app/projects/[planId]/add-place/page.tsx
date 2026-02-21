"use client";

import Header from "@/components/layout/Header";
import DayNav from "@/components/common/DayNav";
import PlanCardSelection from "@/components/card/PlanCardSelection";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCollectionPlacePreference } from "@/lib/hooks/collection/use-collection-place-preference";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { usePlaceSearch } from "@/lib/hooks/use-place-search";
import { usePlanCollectionPlaces } from "@/lib/hooks/plan/use-plan-collection-places";
import { usePlanCollections } from "@/lib/hooks/plan/use-plan-collections";
import { MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const AddPlanPage = () => {
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
	const [activeTab, setActiveTab] = useState<"saved" | "search" | "free">("saved");
	const [selectedPlaceByCollection, setSelectedPlaceByCollection] = useState<
		Record<string, string | null>
	>({});
	const [query, setQuery] = useState("");
	const [selectedSearchPlaceId, setSelectedSearchPlaceId] = useState<string | null>(null);
	const [freeDay, setFreeDay] = useState("");
	const [freeStartTime, setFreeStartTime] = useState("");
	const [freeEndTime, setFreeEndTime] = useState("");
	const [freeMemo, setFreeMemo] = useState("");
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
		const selectedPlace = searchedPlaces.find(
			(place) => place.place_id === selectedSearchPlaceId,
		);
		if (!selectedPlace) {
			toast.error("선택한 장소 정보를 찾지 못했습니다.");
			return;
		}
		window.sessionStorage.setItem(
			"project:selected-search-place",
			JSON.stringify(selectedPlace),
		);
		router.push(`/projects/${planId}/place-add?collectionId=${selectedDay}&source=search`);
	};

	const handleOpenManualAdd = () => {
		if (!planId) return;
		router.push(`/projects/${planId}/add-place/manual`);
	};

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header
				variant="center"
				title="일정 추가"
				showBackButton
				rightBtnBgVariant="glass"
				className="fixed inset-x-0 top-0 z-10"
			/>

			<main className="flex flex-1 flex-col pt-16 pb-24">
				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as "saved" | "search" | "free")}
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
									>
										장소를 찾지 못하시겠나요?
									</Button>
								)}
							</div>
						</div>
					</TabsContent>
					<TabsContent value="free" className="px-5">
						<div className="flex flex-col gap-8 py-5">
							<div className="flex flex-col gap-2">
								<Label htmlFor="free-day" required>
									<span className="typography-label-sm-sb text-foreground">날짜</span>
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
									<span className="typography-label-sm-sb text-foreground">시작 시간</span>
								</Label>
								<InputForm
									id="free-start-time"
									hideIcon
									placeholder="00:00"
									value={freeStartTime}
									onChange={(e) => setFreeStartTime(e.target.value)}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="free-end-time" required>
									<span className="typography-label-sm-sb text-foreground">종료 시간</span>
								</Label>
								<InputForm
									id="free-end-time"
									hideIcon
									placeholder="00:00"
									value={freeEndTime}
									onChange={(e) => setFreeEndTime(e.target.value)}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="free-memo" required>
									<span className="typography-label-sm-sb text-foreground">메모</span>
								</Label>
								<Textarea
									id="free-memo"
									placeholder="메모를 입력해 주세요"
									value={freeMemo}
									onChange={(e) => setFreeMemo(e.target.value)}
									className="bg-muted"
								/>
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
							disabled={!selectedPlaceId}
						>
							여행 게획에 추가하기
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
							disabled={!selectedSearchPlaceId || !selectedDay}
						>
							여행 게획에 추가하기
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddPlanPage;
