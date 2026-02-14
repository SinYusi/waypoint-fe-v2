"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import HeaderBtn from "@/components/layout/HeaderBtn";
import NavigationBar from "@/components/layout/NavigationBar";
import VoteBtn from "@/components/common/VoteBtn";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, SquareArrowOutUpRight } from "lucide-react";

const PlaceDetailPage = () => {
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memo, setMemo] = useState("");

  const handleEditMemo = () => {
    setIsEditingMemo(true);
  };

  const handleSaveMemo = () => {
    setIsEditingMemo(false);
    // TODO: 서버에 메모 저장
  };

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-hidden">
      {/* 이미지 영역 */}
      <div className="fixed top-0 left-0 right-0 w-full aspect-5/3 bg-gray-200 z-0">
        <div className="absolute top-0 left-0 right-0 z-10">
          <Header showBackButton leftBtnBgVariant="glass" />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative pt-[calc(60%-17px)]">
        <div className="flex flex-col gap-16 pt-7 px-5 rounded-t-2xl bg-background min-w-0">
          <div className="flex flex-col w-full min-w-0">
            <h2 className="flex justify-between items-center w-full h-8 py-0.5 px-1">
              <span className="font-sans font-semibold text-lg leading-4 text-[#101828]">
                헤이리 예술 마을
              </span>
              <span className="font-sans font-bold text-sm leading-2 text-gray-500">
                관광지
              </span>
            </h2>
            <div className="flex-1 flex flex-col w-full gap-5 pt-4">
              {/* 주소 영역 */}
              <div className="flex flex-col gap-1 w-full">
                <hr className="border-slate-200" />
                <div className="flex justify-between items-center w-full h-11">
                  <div className="flex items-center gap-[9px]">
                    <MapPin className="size-6 text-teal-400" />
                    <span className="font-sans font-medium text-sm leading-2 text-black">
                      서울시 마포구 와우산로
                    </span>
                  </div>
                  <HeaderBtn
                    bgVariant="ghost"
                    icon={SquareArrowOutUpRight}
                    label="외부 링크"
                  />
                </div>
                <hr className="border-slate-200" />
              </div>
              {/* 투표 버튼 영역 */}
              <div className="flex gap-3 w-full pb-3.5">
                <VoteBtn type="pick" count={0} />
                <VoteBtn type="pass" count={0} />
              </div>
              {/* 메모 영역 */}
              <div className="flex flex-col gap-2 w-full">
                <Label
                  isEditing={isEditingMemo}
                  onEdit={handleEditMemo}
                  onSave={handleSaveMemo}
                >
                  메모
                </Label>
                <Textarea
                  placeholder="텍스트를 입력해주세요."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  disabled={!isEditingMemo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavigationBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default PlaceDetailPage;
