import { useState } from "react";
import Image from "next/image";
import { Ellipsis } from "lucide-react";
import { CollectionMember, PlanMember } from "@/types/member";
import {
  SelectDropdown,
  SelectDropdownItem,
} from "@/components/ui/select-dropdown";

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
  const [isOpen, setIsOpen] = useState(false);

  const memberId = getMemberId(member);
  const actionItems: SelectDropdownItem[] = [
    {
      id: "kick",
      label: "내보내기",
      onSelect: () => {
        onKick(memberId);
        setIsOpen(false);
      },
    },
    {
      id: "assign-owner",
      label: "보관함 소유자로 지정",
      onSelect: () => {
        onAssignOwner(memberId);
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative p-2 flex flex-row gap-2 items-center">
      {member.picture ? (
        <Image
          width={28}
          height={28}
          src={member.picture}
          alt={member.nickname ?? ""}
          className="rounded-full shrink-0"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gray-300 shrink-0" />
      )}
      <p className="typography-action-sm-reg flex-1">{member.nickname}</p>
      {isManaging && (
        // TODO: 모바일 & PC의 기준이 나온다면 하단 drawer 컴포넌트 구현
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <Ellipsis size={18} className="text-[#757575]" />
          </button>
          {isOpen && (
            <SelectDropdown
              items={actionItems}
              className="absolute right-0 top-full z-10"
            />
          )}
        </>
      )}
    </div>
  );
};

export default MemberItem;
