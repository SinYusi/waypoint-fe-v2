"use client";

import Header from "@/components/layout/Header";
import DayNav from "@/components/common/DayNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	const selectedDay =
		selectedCollectionId && dayItems.some((item) => item.value === selectedCollectionId)
			? selectedCollectionId
			: (dayItems[0]?.value ?? "");

	return (
		<div className="flex min-h-screen flex-col bg-[#fafafa]">
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
						</div>
					</TabsContent>
					<TabsContent value="search" className="px-5" />
					<TabsContent value="free" className="px-5" />
				</Tabs>
			</main>
		</div>
	);
};

export default AddPlanPage;
