"use client";

import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AddPlanPage = () => {
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
							보관한
						</TabsTrigger>
						<TabsTrigger value="search" style="underline" fullWidth>
							장소 검색
						</TabsTrigger>
						<TabsTrigger value="free" style="underline" fullWidth>
							자유 시간
						</TabsTrigger>
					</TabsList>
					<TabsContent value="saved" className="px-5" />
					<TabsContent value="search" className="px-5" />
					<TabsContent value="free" className="px-5" />
				</Tabs>
			</main>
		</div>
	);
};

export default AddPlanPage;
