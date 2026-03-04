"use client";

import PlanEmptyIllust from "@/public/illust/plan-empty-illust.svg";

const PlanEmptyState = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col px-5 py-6 gap-16">
        <div className="flex flex-col gap-5 items-center justify-center">
          <PlanEmptyIllust />
          <div className="flex flex-col gap-2 items-center justify-center text-center">
            <span className="typography-display-lg-bold">
              여행 계획을 시작해보세요
            </span>
            <p className="typography-body-sm-reg">
              편집하기 기능을 통해
              <br />
              여행 계획을 시작해보세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanEmptyState;
