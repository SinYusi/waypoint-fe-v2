import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Divider from "@/components/common/Divider";

const TravelPlanSection = () => {
  // TODO: 연결된 플랜이 있는지 확인하고 다르게 렌더링하기
  return (
    <div className="p-3 rounded-2xl bg-[#f0f0f0] flex flex-col gap-3">
      <p className="typography-action-base-bold">이제 여행갈 준비가 되셨나요?</p>
      <div className="flex flex-col gap-1">
        <Divider />
        <Button variant="ghost" className="w-full flex justify-between px-0">
          <p className="typography-action-sm-reg">
            이 보관함에서 여행 계획 시작하기
          </p>
          <ChevronRight size={20} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};

export default TravelPlanSection;
