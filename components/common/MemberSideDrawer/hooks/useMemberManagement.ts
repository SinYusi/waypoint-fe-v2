import { useChangeCollectionOwner } from "@/lib/hooks/collection/use-change-collection-owner";
import { useKickCollectionMember } from "@/lib/hooks/collection/use-kick-collection-member";
import { useChangePlanOwner } from "@/lib/hooks/plan/use-change-plan-owner";
import { useKickPlanMember } from "@/lib/hooks/plan/use-kick-plan-member";

interface UseMemberManagementProps {
  variant: "COLLECTION" | "PLAN";
  collectionId?: string;
  planId?: string;
}

export const useMemberManagement = ({
  variant,
  collectionId,
  planId,
}: UseMemberManagementProps) => {
  const { mutate: changeCollectionOwner } = useChangeCollectionOwner();
  const { mutate: kickCollectionMember } = useKickCollectionMember();
  const { mutate: changePlanOwner } = useChangePlanOwner();
  const { mutate: kickPlanMember } = useKickPlanMember();

  const handleKickMember = (memberId: string) => {
    if (variant === "COLLECTION" && collectionId) {
      kickCollectionMember({ collectionId, memberId });
    } else if (variant === "PLAN" && planId) {
      kickPlanMember({ planId, memberId });
    }
  };

  const handleAssignOwner = (memberId: string) => {
    if (variant === "COLLECTION" && collectionId) {
      changeCollectionOwner({ collectionId, memberId });
    } else if (variant === "PLAN" && planId) {
      changePlanOwner({ planId, memberId });
    }
  };

  return {
    handleKickMember,
    handleAssignOwner,
  };
};
