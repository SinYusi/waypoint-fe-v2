"use client";

import Image from "next/image";
import ProfileImage from "@/components/common/ProfileImage";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOutIcon } from "lucide-react";
import { useMe } from "@/lib/hooks/use-me";

type SocialProvider = "GOOGLE" | "KAKAO" | "NAVER";

const SOCIAL_PROVIDER_ICON: Record<SocialProvider, string> = {
  GOOGLE: "/icons/google.svg",
  KAKAO: "/icons/kakao.svg",
  NAVER: "/icons/naver.svg",
};

const Mypage = () => {
  const { data: me, isLoading } = useMe();

  const provider = me?.provider ?? "GOOGLE";
  const nickname = me?.nickname ?? "";
  const email = me?.email ?? "";
  const picture = me?.picture ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pl-5 pr-8.5 pb-7 flex flex-row gap-3.5 items-center">
        <ProfileImage
          src={picture}
          alt={nickname || "프로필 이미지"}
          size="md"
        />
        <div className="flex flex-col gap-0.5 flex-1">
          <h2 className="typography-display-lg-bold">
            {isLoading ? "로딩 중..." : nickname}
          </h2>
          {/* 디자인 상으로 semibold이나 눈누 사이트의 LINE Seed Sans KR은 600 weight를 지원하지 않음 */}
          <p className="typography-action-sm-reg">{email}</p>
        </div>
        <div className="size-6 rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
          <Image
            src={SOCIAL_PROVIDER_ICON[provider]}
            alt={provider}
            width={14}
            height={14}
          />
        </div>
      </div>
      <div className="flex-1 w-full rounded-t-3xl bg-[#f0f0f0] flex flex-col gap-2.5 pt-6 px-5 pb-36 justify-between">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-1">
            <p className="typography-action-sm-bold text-[#a3a3a3]">
              나의 계정
            </p>
            <MypageBtn>회원 정보 수정</MypageBtn>
          </div>
          <div className="flex flex-col gap-1">
            <p className="typography-action-sm-bold text-[#a3a3a3]">도움말</p>
            <MypageBtn>약관 및 정책</MypageBtn>
            <MypageBtn>소중한 의견 들려주기</MypageBtn>
          </div>
        </div>
        <Button
          variant="ghost"
          icon={<LogOutIcon size={18} className="opacity-40" />}
        >
          <p className="typography-action-sm-reg text-neutral-500">로그아웃</p>
        </Button>
      </div>
    </div>
  );
};

const MypageBtn = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button
      variant="ghost"
      className="flex flex-row justify-between w-full p-0 pr-5"
    >
      <div className="typography-body-base">{children}</div>
      <ChevronRight
        size={20}
        strokeWidth={2}
        color="#01012e"
        className="opacity-13"
      />
    </Button>
  );
};

export default Mypage;
