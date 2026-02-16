import { useState } from "react";
import { UserPlus } from "lucide-react";
import { CollectionMember, PlanMember } from "@/types/member";
import { Button } from "@/components/ui/button";
import Divider from "@/components/common/Divider";
import MemberItem from "./MemberItem";

interface MemberListSectionProps {
  members: (CollectionMember | PlanMember)[];
  onKick: (memberId: string) => void;
  onAssignOwner: (memberId: string) => void;
}

const MemberListSection = ({
  members,
  onKick,
  onAssignOwner,
}: MemberListSectionProps) => {
  const [isManaging, setIsManaging] = useState(false);
  return (
    <div className="w-full rounded-2xl bg-[#f0f0f0]">
      <div className="flex px-4 py-3 justify-between">
        <p className="typography-action-base-bold">여행 멤버</p>
        {!isManaging && (
          <button
            className="typography-action-sm-reg text-[#757575]"
            onClick={() => setIsManaging(true)}
          >
            관리하기
          </button>
        )}
      </div>
      <div className="px-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          {members.map((member, i) => (
            <MemberItem
              key={member.nickname + `${i}`}
              member={member}
              isManaging={isManaging}
              onKick={onKick}
              onAssignOwner={onAssignOwner}
            />
          ))}
        </div>
        {isManaging ? (
          <Button
            variant="outline"
            className="w-full bg-[#f0f0f0] mb-3 border-neutral-400"
            onClick={() => setIsManaging(false)}
          >
            <p className="typography-action-sm-reg">멤버 관리 끝내기</p>
          </Button>
        ) : (
          <div className="flex flex-col gap-1">
            <Divider />
            <Button
              icon={<UserPlus size={18} className="opacity-40" />}
              variant="ghost"
              className="rounded-2xl typography-action-sm-reg flex flex-row mb-2"
            >
              새로운 멤버 초대하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberListSection;
