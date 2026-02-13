"use client";

import { DoorClosed, X } from "lucide-react";
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
import BookMarkIcon from "@/components/common/BookmarkIcon";
import { useMemberManagement } from "./hooks/useMemberManagement";
import MemberListSection from "./components/MemberListSection";
import TravelPlanSection from "./components/TravelPlanSection";

interface MemberSideDrawerProps {
  title: string;
  placeCount?: number;
  variant: "COLLECTION" | "PLAN";
}

const MemberSideDrawer = ({
  title,
  placeCount,
  variant,
}: MemberSideDrawerProps) => {
  const { members, isManaging, setIsManaging, handleKickMember, handleAssignOwner } =
    useMemberManagement({ variant });

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {/* TODO: HeaderButton 구현 시 교체 */}
        <Button>사이드바 열기</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose className="absolute top-3 right-3">
          <X size={24} />
        </DrawerClose>
        <DrawerHeader className="flex flex-col gap-1 w-full justify-center items-center mt-10">
          <DrawerTitle className="flex flex-row gap-1">
            <BookMarkIcon strokeWidth={2} size={28} color="#0ea5e9" />
            <p className="typography-display-xl">{title}</p>
          </DrawerTitle>
          <DrawerDescription className="typography-action-sm-bold font-[#757575]">
            {placeCount}개의 장소
          </DrawerDescription>
        </DrawerHeader>
        <main className="flex flex-col gap-3 mx-5 mt-10">
          <MemberListSection
            members={members.members}
            isManaging={isManaging}
            onStartManaging={() => setIsManaging(true)}
            onEndManaging={() => setIsManaging(false)}
            onKick={handleKickMember}
            onAssignOwner={handleAssignOwner}
          />
          <TravelPlanSection />
        </main>
        <DrawerFooter>
          <Button variant="ghost">
            <DoorClosed size={18} className="opacity-40" />
            <p className="typography-action-sm-reg">이 컬렉션에서 나가기</p>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MemberSideDrawer;
