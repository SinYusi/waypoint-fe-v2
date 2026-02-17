"use client";

import { useState } from "react";
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
import AppDialog from "@/components/common/AppDialog";
import AppAlertDialog from "@/components/common/AppAlertDialog";

interface MemberSideDrawerProps {
  title: string;
  placeCount?: number;
  variant: "COLLECTION" | "PLAN";
  rightBtnBgVariant: HeaderBtnBgVariant;
  members?: (CollectionMember | PlanMember)[];
  meRole?: MemberRole;
}

const MemberSideDrawer = ({
  title,
  placeCount,
  variant,
  rightBtnBgVariant,
  members = [],
  meRole,
}: MemberSideDrawerProps) => {
  const { handleKickMember, handleAssignOwner } = useMemberManagement({
    variant,
  });

  const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleLeaveClick = () => {
    if (meRole === "OWNER") {
      setOwnerDialogOpen(true);
    } else {
      setConfirmDialogOpen(true);
    }
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
              {placeCount}개의 장소
            </DrawerDescription>
          </DrawerHeader>
          <main className="flex flex-col gap-3 mx-5 mt-10">
            <MemberListSection
              members={members}
              onKick={handleKickMember}
              onAssignOwner={handleAssignOwner}
            />
            <TravelPlanSection />
          </main>
          <DrawerFooter>
            <Button variant="ghost" onClick={handleLeaveClick}>
              <DoorClosed size={18} className="opacity-40" />
              <p className="typography-action-sm-reg">이 컬렉션에서 나가기</p>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AppDialog
        open={ownerDialogOpen}
        onOpenChange={setOwnerDialogOpen}
        title="보관함을 나갈 수 없어요"
        description={`소유자는 보관함을 나갈 수 없어요.\n멤버에게 소유자 권한을 넘긴 후 나가주세요.`}
        actionLabel="확인"
        onAction={() => setOwnerDialogOpen(false)}
      />

      <AppAlertDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="보관함에서 나갈까요?"
        description={`나가면 이 보관함의 장소 목록을\n더 이상 볼 수 없어요.`}
        cancelLabel="취소"
        actionLabel="나가기"
        onAction={() => {
          setConfirmDialogOpen(false);
        }}
      />
    </>
  );
};

export default MemberSideDrawer;
