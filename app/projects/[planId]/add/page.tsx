"use client";

import Header from "@/components/layout/Header";

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

			<main className="flex flex-1 flex-col px-5 pt-16 pb-24" />

		</div>
	);
};

export default AddPlanPage;
