"use client";

import { ChevronRight, DoorClosed, Ellipsis, UserPlus, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import BookMarkIcon from "./BookmarkIcon";
import { useState } from "react";
import {
  mockCollectionMembersResponse,
  mockPlanMembersResponse,
} from "@/mocks/member";
import Image from "next/image";
import Divider from "./Divider";

interface MemberSideDrawerProps {
  title: string;
  placeCount?: number;
  variant: "COLLECTION" | "PLAN";
}

const MemberSideDrawer: React.FC<MemberSideDrawerProps> = ({
  title,
  placeCount,
  variant,
}: MemberSideDrawerProps) => {
  // TODO: 멤버 목록 조회 API 호출
  const [members, setMembers] = useState(
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
          {/* 여행 멤버 박스 */}
          <div className="w-full rounded-2xl bg-[#f0f0f0]">
            <div className="flex px-4 py-3 justify-between">
              <p className="typography-action-base-bold">여행 멤버</p>
              <button
                className="typography-action-sm-reg text-[#757575]"
                onClick={() => setIsManaging(true)}
              >
                관리하기
              </button>
            </div>
            <div className="px-3 flex flex-col gap-3">
              {/* 멤버 나열 박스 */}
              <div className="flex flex-col gap-3">
                {members.members.map((member) => (
                  <div
                    className="p-2 flex flex-row gap-2 items-center"
                    key={member.nickname}
                  >
                    {member.picture && (
                      <>
                        <Image
                          width={28}
                          height={28}
                          src={member.picture}
                          alt={member.nickname ?? ""}
                          className="rounded-full"
                        />
                        <p className="typography-action-sm-reg flex-1">
                          {member.nickname}
                        </p>
                        {isManaging && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button>
                                <Ellipsis size={18} className="text-[#757575]" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleKickMember(
                                    "collection_member_id" in member
                                      ? member.collection_member_id
                                      : member.plan_member_id,
                                  )
                                }
                              >
                                내보내기
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAssignOwner(
                                    "collection_member_id" in member
                                      ? member.collection_member_id
                                      : member.plan_member_id,
                                  )
                                }
                              >
                                보관함 소유자로 지정
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </>
                    )}
                  </div>
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
          {/* 여행 시작 박스 */}
          <div className="p-3 rounded-2xl bg-[#f0f0f0] flex flex-col gap-3">
            <p className="typography-action-base-bold">
              이제 여행갈 준비가 되셨나요?
            </p>
            <div className="flex flex-col gap-1">
              <Divider />
              <Button
                variant="ghost"
                className="w-full flex justify-between px-0"
              >
                <p className="typography-action-sm-reg">
                  이 보관함에서 여행 계획 시작하기
                </p>
                <ChevronRight size={20} strokeWidth={2} />
              </Button>
            </div>
          </div>
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
