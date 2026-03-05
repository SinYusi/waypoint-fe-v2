import { useChangeCollectionOwner } from "@/lib/hooks/collection/use-change-collection-owner";
import { useKickCollectionMember } from "@/lib/hooks/collection/use-kick-collection-member";

interface UseMemberManagementProps {
  variant: "COLLECTION" | "PLAN";
  collectionId?: string;
  planId?: string;
}

export const useMemberManagement = ({
  variant,
  collectionId,
  planId: _planId,
}: UseMemberManagementProps) => {
  const { mutate: changeOwner } = useChangeCollectionOwner();
  const { mutate: kickMember } = useKickCollectionMember();

  const handleKickMember = (memberId: string) => {
    if (variant === "COLLECTION" && collectionId) {
      kickMember({ collectionId, memberId });
    } else {
      // TODO: 플랜 멤버 내보내기 API 호출
      console.log("플랜 멤버 내보내기:", memberId);
    }
  };

  const handleAssignOwner = (memberId: string) => {
    if (variant === "COLLECTION" && collectionId) {
      changeOwner({ collectionId, memberId });
    } else {
      // TODO: 플랜 소유자 지정 API 호출
      console.log("플랜 소유자 지정:", memberId);
    }
  };

  return {
    handleKickMember,
    handleAssignOwner,
  };
};
