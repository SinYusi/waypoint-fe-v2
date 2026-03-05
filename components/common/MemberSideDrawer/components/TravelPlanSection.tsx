import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Divider from "@/components/common/Divider";
import { useRouter } from "next/navigation";
import { useCollectionPlans } from "@/lib/hooks/collection/use-collection-plans";

interface TravelPlanSectionProps {
  collectionId?: string;
}

const TravelPlanSection = ({ collectionId }: TravelPlanSectionProps) => {
  const router = useRouter();

  const { data: plans } = useCollectionPlans(collectionId ?? "", {
    enabled: !!collectionId,
  });

  const hasPlans = plans && plans.length > 0;

  return (
    <div className="p-3 rounded-2xl bg-[#f0f0f0] flex flex-col gap-3">
      <p className="typography-action-base-bold">
        {hasPlans ? "연결된 여행계획이 있어요!" : "이제 여행갈 준비가 되셨나요?"}
      </p>
      <div className="flex flex-col gap-1">
        <Divider />
        {hasPlans ? (
          plans.map((plan) => (
            <Button
              key={plan.plan_id}
              variant="ghost"
              className="w-full flex justify-between px-0"
              onClick={() => router.push(`/projects/${plan.plan_id}`)}
            >
              <p className="typography-action-sm-reg">{plan.title}</p>
              <ChevronRight size={20} strokeWidth={2} />
            </Button>
          ))
        ) : (
          <Button
            variant="ghost"
            className="w-full flex justify-between px-0"
            onClick={() =>
              router.push(
                collectionId
                  ? `/projects/create?collectionId=${collectionId}`
                  : "/projects/create",
              )
            }
          >
            <p className="typography-action-sm-reg">
              이 보관함에서 여행 계획 시작하기
            </p>
            <ChevronRight size={20} strokeWidth={2} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TravelPlanSection;
