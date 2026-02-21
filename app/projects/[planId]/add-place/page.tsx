"use client";

import Header from "@/components/layout/Header";
import DayNav from "@/components/common/DayNav";
import PlanCardSelection from "@/components/card/PlanCardSelection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlanCollectionPlaces } from "@/lib/hooks/plan/use-plan-collection-places";
import { usePlanCollections } from "@/lib/hooks/plan/use-plan-collections";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const AddPlanPage = () => {
	const params = useParams<{ planId: string | string[] }>();
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
	const [selectedPlaceByCollection, setSelectedPlaceByCollection] = useState<
		Record<string, string | null>
	>({});
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
	const { data: placesData } = usePlanCollectionPlaces(planId ?? "", selectedDay, {
		size: 20,
	});
	const places = placesData?.pages.flatMap((page) => page.contents) ?? [];

	const handleAddToPlan = () => {
		if (!selectedPlaceId) return;
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
				<Tabs defaultValue="saved">
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
									/>
								))}
							</div>
						</div>
					</TabsContent>
					<TabsContent value="search" className="px-5" />
					<TabsContent value="free" className="px-5" />
				</Tabs>
			</main>

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
						여행 계획에 추가하기
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AddPlanPage;
