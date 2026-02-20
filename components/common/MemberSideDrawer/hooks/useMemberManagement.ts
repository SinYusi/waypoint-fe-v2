interface UseMemberManagementProps {
  variant: "COLLECTION" | "PLAN";
}

export const useMemberManagement = ({ variant: _ }: UseMemberManagementProps) => {
  const handleKickMember = (memberId: string) => {
    // TODO: 멤버 내보내기 API 호출
    console.log("내보내기:", memberId);
  };

  const handleAssignOwner = (memberId: string) => {
    // TODO: 보관함 소유자 지정 API 호출
    console.log("소유자 지정:", memberId);
  };

  return {
    handleKickMember,
    handleAssignOwner,
  };
};
