"use client";

import Image from "next/image";
import ProfileImage from "@/components/common/ProfileImage";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useMe } from "@/lib/hooks/use-me";
import { useLogout } from "@/lib/hooks/use-logout";

type SocialProvider = "GOOGLE" | "KAKAO" | "NAVER";

const SOCIAL_PROVIDER_ICON: Record<SocialProvider, string> = {
  GOOGLE: "/icons/google.svg",
  KAKAO: "/icons/kakao.svg",
  NAVER: "/icons/naver.svg",
};

const Mypage = () => {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const { mutate: logoutMutate, isPending: isLogoutPending } = useLogout({
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      router.replace("/login");
    },
  });

  const provider = me?.provider ?? "GOOGLE";
  const nickname = me?.nickname ?? "";
  const email = me?.email ?? "";
  const picture = me?.picture ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNotificationButton rightBtnBgVariant="ghost" />
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
        <div className="size-6 rounded-full shrink-0 overflow-hidden">
          <Image
            src={SOCIAL_PROVIDER_ICON[provider]}
            alt={provider}
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="flex-1 w-full rounded-t-3xl bg-[#f0f0f0] flex flex-col gap-2.5 pt-6 px-5 pb-24 justify-between">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-1">
            <p className="typography-action-sm-bold text-[#a3a3a3]">
              나의 계정
            </p>
            <MypageBtn href="/my/edit">회원 정보 수정</MypageBtn>
          </div>
          <div className="flex flex-col gap-1">
            <p className="typography-action-sm-bold text-[#a3a3a3]">도움말</p>
            <MypageBtn>약관 및 정책</MypageBtn>
            <MypageBtn>소중한 의견 들려주기</MypageBtn>
          </div>
        </div>
        <Button
          variant="ghost"
          disabled={isLogoutPending}
          icon={<LogOutIcon size={18} className="opacity-40" />}
          onClick={() => logoutMutate()}
        >
          <p className="typography-action-sm-reg text-neutral-500">로그아웃</p>
        </Button>
      </div>
    </div>
  );
};

const MypageBtn = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="flex flex-row justify-between w-full p-0 pr-5"
      onClick={href ? () => router.push(href) : undefined}
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
