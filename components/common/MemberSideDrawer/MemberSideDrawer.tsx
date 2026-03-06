"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DoorClosed, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CollectionIcon from "@/public/icons/collection.svg";
import { useMemberManagement } from "./hooks/useMemberManagement";
import MemberListSection from "./components/MemberListSection";
import TravelPlanSection from "./components/TravelPlanSection";
import HeaderBtn, { HeaderBtnBgVariant } from "@/components/layout/HeaderBtn";
import type { CollectionMember, MemberRole, PlanMember } from "@/types/member";
import { usePlanMembers } from "@/lib/hooks/plan/use-plan-members";
import { useCollectionMembers } from "@/lib/hooks/collection/use-collection-members";
import { useLeaveCollection } from "@/lib/hooks/collection/use-leave-collection";
import { useLeavePlan } from "@/lib/hooks/plan/use-leave-plan";
import { ChevronRight } from "lucide-react";
import AppDialog from "@/components/common/AppDialog";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import InviteDialog from "@/components/common/InviteDialog";

interface MemberSideDrawerProps {
  title: string;
  placeCount?: number;
  dateRange?: string;
  variant: "COLLECTION" | "PLAN";
  rightBtnBgVariant: HeaderBtnBgVariant;
  members?: (CollectionMember | PlanMember)[];
  meRole?: MemberRole;
  collectionId?: string;
  planId?: string;
}

const MemberSideDrawer = ({
  title,
  placeCount,
  dateRange,
  variant,
  rightBtnBgVariant,
  members = [],
  meRole,
  collectionId,
  planId,
}: MemberSideDrawerProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: planMembersData } = usePlanMembers(planId ?? "", {
    enabled: variant === "PLAN" && !!planId,
  });

  const { data: collectionMembersData } = useCollectionMembers(collectionId ?? "", {
    enabled: variant === "COLLECTION" && !!collectionId,
  });

  const resolvedMembers =
    variant === "PLAN" && planMembersData
      ? planMembersData.members
      : members;
  const resolvedMeRole =
    variant === "PLAN" && planMembersData
      ? planMembersData.me?.role
      : meRole;
  const meMemberId =
    variant === "PLAN" && planMembersData
      ? planMembersData.me?.plan_member_id
      : variant === "COLLECTION" && collectionMembersData
        ? collectionMembersData.me?.collection_member_id
        : undefined;

  const isOwner = resolvedMeRole === "OWNER";
  const { handleKickMember, handleAssignOwner } = useMemberManagement({
    variant,
    collectionId,
    planId,
  });

  const { mutate: leaveCollection, isPending: isLeavingCollection } = useLeaveCollection({
    onSuccess: () => router.replace("/home"),
  });
  const { mutate: leavePlan, isPending: isLeavingPlan } = useLeavePlan({
    onSuccess: () => router.replace("/projects"),
  });

  const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleLeaveClick = () => {
    if (resolvedMeRole === "OWNER") {
      setOwnerDialogOpen(true);
    } else {
      setConfirmDialogOpen(true);
    }
  };

  const handleLeaveConfirm = () => {
    if (variant === "PLAN" && planId) {
      leavePlan(planId);
    } else if (variant === "COLLECTION" && collectionId) {
      leaveCollection(collectionId);
    }
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <HeaderBtn bgVariant={rightBtnBgVariant} icon={Menu} label="메뉴" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerClose className="absolute top-3 right-3">
            <X size={24} />
          </DrawerClose>
          <DrawerHeader className="flex flex-col gap-1 w-full justify-center items-center mt-10">
            <DrawerTitle className="flex flex-row gap-1">
              <CollectionIcon color="#0ea5e9" />
              <p className="typography-display-xl">{title}</p>
            </DrawerTitle>
            <DrawerDescription className="typography-action-sm-bold font-[#757575]">
              {variant === "PLAN" ? dateRange : `${placeCount}개의 장소`}
            </DrawerDescription>
          </DrawerHeader>
          <main className="flex flex-col gap-3 mx-5 mt-10">
            <MemberListSection
              members={resolvedMembers}
              isOwner={isOwner}
              meMemberId={meMemberId}
              variant={variant}
              onKick={handleKickMember}
              onAssignOwner={handleAssignOwner}
              onInviteClick={() => setInviteDialogOpen(true)}
            />
            {variant === "PLAN" ? (
              <Button
                className="w-full flex justify-between py-1.5 px-3 bg-card text-foreground"
                onClick={() => router.push(`${pathname}/collection-manage`)}
              >
                <p className="typography-action-sm-reg ">
                  보관함 추가 혹은 삭제하기
                </p>
                <ChevronRight size={20} strokeWidth={2} />
              </Button>
            ) : (
              <TravelPlanSection collectionId={collectionId} />
            )}
          </main>
          <DrawerFooter>
            <Button variant="ghost" onClick={handleLeaveClick} disabled={isLeavingCollection || isLeavingPlan}>
              <DoorClosed size={18} className="opacity-40" />
              <p className="typography-action-sm-reg">
                {variant === "PLAN"
                  ? "이 여행 계획에서 나가기"
                  : "이 컬렉션에서 나가기"}
              </p>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AppDialog
        open={ownerDialogOpen}
        onOpenChange={setOwnerDialogOpen}
        title="지금은 보관함을 나갈 수 없어요"
        description={`보관함을 맡아줄 사람이 한 명은 꼭 필요해요.\n관리 역할을 다른 멤버에게 먼저 넘겨주세요.`}
        actionLabel="확인"
        onAction={() => setOwnerDialogOpen(false)}
      />

      <AppAlertDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="정말 이 보관함에서 나가시겠어요?"
        description={`지금 나가시면 다시 초대 받기 전까지는 이 보관함에 다시 들어오실 수 없어요.\n그래도 정말 나가시겠어요?`}
        cancelLabel="취소"
        actionLabel="나가기"
        onAction={handleLeaveConfirm}
      />

      {(collectionId ?? planId) && (
        <InviteDialog
          variant={variant}
          id={(collectionId ?? planId)!}
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
        />
      )}
    </>
  );
};

export default MemberSideDrawer;
