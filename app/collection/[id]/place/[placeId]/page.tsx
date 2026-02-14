"use client";

import Header from "@/components/layout/Header";
import HeaderBtn from "@/components/layout/HeaderBtn";
import NavigationBar from "@/components/layout/NavigationBar";
import { MapPin, SquareArrowOutUpRight } from "lucide-react";

const PlaceDetailPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* 이미지 영역 */}
      <div className="fixed top-0 left-0 right-0 w-full aspect-5/3 bg-gray-200 z-0">
        <div className="absolute top-0 left-0 right-0 z-10">
          <Header showBackButton leftBtnBgVariant="glass" />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative pt-[calc(60%-17px)]">
        <div className="flex flex-col gap-16 pt-7 px-5 rounded-t-2xl bg-background">
          <div className="flex flex-col w-full">
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
            </div>
          </div>
        </div>
      </div>

      <NavigationBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default PlaceDetailPage;
