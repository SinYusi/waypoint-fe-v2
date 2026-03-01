"use client";

import { cn } from "@/lib/utils/utils";
import { Search, X } from "lucide-react";
import { InputForm } from "../ui/input-form";
import HeaderBtn from "./HeaderBtn";
import Dropdown, { DropdownDivider, DropdownItem } from "../common/DropDown";
import MemberSideDrawer from "../common/MemberSideDrawer/MemberSideDrawer";
import type { CollectionMember, MemberRole } from "@/types/member";

type Member = { id: string; name: string };
type SortBy = "LATEST" | "OLDEST";

type PlaceListHeaderValue = {
  isSearchMode?: boolean;
  sort: SortBy;
  addedBy?: string;
  place?: string;
};

interface PlaceListHeaderProps {
  members: Member[];
  value: PlaceListHeaderValue;
  onChange: (next: Partial<PlaceListHeaderValue>) => void;
  title?: string;
  placeCount?: number;
  collectionMembers?: CollectionMember[];
  meRole?: MemberRole;
  collectionId?: string;
  className?: string;
}

const PlaceListHeader = ({
  members,
  value,
  onChange,
  title,
  placeCount,
  collectionMembers,
  meRole,
  collectionId,
  className,
}: PlaceListHeaderProps) => {
  const { isSearchMode, sort, addedBy, place } = value;

  const getSortLabel = () => {
    // 멤버 선택 시: 닉네임의 장소
    if (addedBy) {
      const member = members.find((m) => m.id === addedBy);
      if (!member) return "멤버별 장소";

      return (
        <span className="flex min-w-0">
          <span className="min-w-0 truncate typography-body-sm-sb">
            {member.name}
          </span>
          <p className="shrink-0">의 장소</p>
        </span>
      );
    }

    // 멤버 미선택 시: 정렬 라벨
    if (sort === "LATEST") return "최신 순";
    return "오래된 순";
  };

  return (
    <div className={cn("w-full h-[60px] pt-4 pl-5 pr-2.5", className)}>
      <div className="w-full h-11 flex items-center gap-2">
        <div className="relative h-11 flex-1">
          {/* 드롭다운 메뉴 */}
          <div
            className={cn(
              "absolute inset-0 transition-all duration-200 ease-out",
              isSearchMode
                ? "opacity-0 -translate-x-3 pointer-events-none"
                : "opacity-100 translate-x-0 pointer-events-auto",
            )}
          >
            <Dropdown label={getSortLabel()}>
              <DropdownItem
                onClick={() => onChange({ sort: "LATEST", addedBy: undefined })}
                isActive={!addedBy && sort === "LATEST"}
              >
                최신 순
              </DropdownItem>
              <DropdownItem
                onClick={() => onChange({ sort: "OLDEST", addedBy: undefined })}
                isActive={!addedBy && sort === "OLDEST"}
              >
                오래된 순
              </DropdownItem>

              <DropdownDivider />

              {/* 멤버별 장소 */}
              {members.map((member) => {
                const isActive = addedBy === member.id;

                return (
                  <DropdownItem
                    key={member.id}
                    onClick={() =>
                      onChange({ sort: "LATEST", addedBy: member.id })
                    }
                    isActive={isActive}
                    className="flex items-center gap-0"
                  >
                    <span className="min-w-0 truncate typography-body-sm-sb">
                      {member.name}
                    </span>
                    <p className="shrink-0">의 장소</p>
                  </DropdownItem>
                );
              })}
            </Dropdown>
          </div>

          {/* 검색 바 */}
          <div
            className={cn(
              "absolute inset-0 transition-all duration-200 ease-out",
              isSearchMode
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-4 pointer-events-none",
            )}
          >
            <div className="relative h-14">
              <InputForm
                value={place}
                onChange={(e) => onChange({ place: e.target.value })}
                placeholder="컬렉션의 장소를 검색하세요"
                className="bg-white rounded-[12px] border-[1px] border-border"
              />
            </div>
          </div>
        </div>

        {/* 우측 버튼 */}
        <div className="flex items-center">
          {!isSearchMode ? (
            <HeaderBtn
              icon={Search}
              label="검색"
              bgVariant="ghost"
              onClick={() => onChange({ isSearchMode: true })}
            />
          ) : (
            <HeaderBtn
              icon={X}
              label="닫기"
              bgVariant="ghost"
              onClick={() =>
                onChange({
                  isSearchMode: false,
                  place: "",
                })
              }
            />
          )}
          <MemberSideDrawer
            title={title ?? ""}
            placeCount={placeCount}
            variant="COLLECTION"
            rightBtnBgVariant="ghost"
            members={collectionMembers}
            meRole={meRole}
            collectionId={collectionId}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceListHeader;
export type { Member, SortBy, PlaceListHeaderValue };
