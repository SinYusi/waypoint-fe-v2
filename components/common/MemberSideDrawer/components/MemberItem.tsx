import Image from "next/image";
import { CollectionMember, PlanMember } from "@/types/member";
import MemberActionMenu from "./MemberActionMenu";

interface MemberItemProps {
  member: CollectionMember | PlanMember;
  isManaging: boolean;
  onKick: (memberId: string) => void;
  onAssignOwner: (memberId: string) => void;
}

const getMemberId = (member: CollectionMember | PlanMember): string => {
  return "collection_member_id" in member
    ? member.collection_member_id
    : member.plan_member_id;
};

const MemberItem = ({
  member,
  isManaging,
  onKick,
  onAssignOwner,
}: MemberItemProps) => {
  if (!member.picture) return null;

  return (
    <div className="p-2 flex flex-row gap-2 items-center">
      <Image
        width={28}
        height={28}
        src={member.picture}
        alt={member.nickname ?? ""}
        className="rounded-full"
      />
      <p className="typography-action-sm-reg flex-1">{member.nickname}</p>
      {isManaging && (
        // TODO: 모바일 & PC의 기준이 나온다면 하단 drawer 컴포넌트 구현
        <MemberActionMenu
          memberId={getMemberId(member)}
          onKick={onKick}
          onAssignOwner={onAssignOwner}
        />
      )}
    </div>
  );
};

export default MemberItem;
