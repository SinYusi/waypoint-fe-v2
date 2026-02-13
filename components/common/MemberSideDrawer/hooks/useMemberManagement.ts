import { useState } from "react";
import {
  mockCollectionMembersResponse,
  mockPlanMembersResponse,
} from "@/mocks/member";

interface UseMemberManagementProps {
  variant: "COLLECTION" | "PLAN";
}

export const useMemberManagement = ({ variant }: UseMemberManagementProps) => {
  // TODO: 멤버 목록 조회 API 호출
  const [members] = useState(
    variant === "COLLECTION"
      ? mockCollectionMembersResponse
      : mockPlanMembersResponse,
  );
  const [isManaging, setIsManaging] = useState(false);

  const handleKickMember = (memberId: string) => {
    // TODO: 멤버 내보내기 API 호출
    console.log("내보내기:", memberId);
  };

  const handleAssignOwner = (memberId: string) => {
    // TODO: 보관함 소유자 지정 API 호출
    console.log("소유자 지정:", memberId);
  };

  return {
    members,
    isManaging,
    setIsManaging,
    handleKickMember,
    handleAssignOwner,
  };
};
