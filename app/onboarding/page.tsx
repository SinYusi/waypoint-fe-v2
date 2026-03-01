"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Vote, MapPin, UsersRound } from "lucide-react";
import { useState } from "react";

const onboardingOptions = [
  {
    id: "place",
    title: "가고 싶은 곳을 차곡차곡",
    description:
      "각자 마음에 드는 장소를 눈치 보지 말고 편하게 바구니에 담아보세요.",
    icon: MapPin,
  },
  {
    id: "schedule",
    title: "쉬고 싶은 영상 속 그곳을 찾아주는 AI",
    description:
      "유튜브에서 본 멋진 곳, 링크만 넣으면 AI가 영상 속 장소들을 알아서 찾아줘요.",
    icon: MapPin,
  },
  {
    id: "route",
    title: "나란히 비교하며 마음을 모아",
    description:
        "후보지들을 함께 비교하고 조금씩 양보하며, 모두가 만족할 정답을 찾아요.",
    icon: Vote,
  },
  {
    id: "budget",
    title: "아쉬움 없이 다 함께",
    description:
      "기분 좋게 합의된 장소들만 일정표에 담아요. 다툴 일 없는 즐거운 계획이 완성돼요.",
    icon: UsersRound,
  },
] as const;

const OnboardingPage = () => {
  const [selectedOption, setSelectedOption] = useState<string>(
    onboardingOptions[0].id,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header className="fixed inset-x-0 top-0 z-10" />

      <main className="mt-15 flex min-h-[calc(100vh-60px)] justify-center px-5 pt-6 pb-26.25">
        <section className="flex h-[840px] w-full max-w-[335px] flex-col gap-10 p-0">
          <div className="flex h-[232px] w-full flex-col gap-5">
            <div className="flex h-10 w-full items-center justify-center">
              <h1 className="font-[Urbanist] text-2xl leading-8 font-extrabold text-[#2D2D2D]">
                TripPixel
              </h1>
            </div>

            <div className="flex h-[172px] w-full flex-col gap-5 pt-2 text-center">
              <h2 className="typography-display-2xl text-foreground">
                우리의 여행을 미리 맞춰봐요!
              </h2>

              <div className="flex flex-col gap-3 typography-body-base text-muted-foreground">
                <p>
                  가고 싶은 곳도,
                  <span className="inline"> 쉬고 싶은 시간도 다를 수 있어요.</span>
                </p>
                <p>
                  여행지에서 아쉬운 마음이 들지 않도록,
                  <br />
                  출발하기 전에 우리들의 기대를 하나로 모아볼까요?
                </p>
              </div>
            </div>
          </div>

          <div className="flex h-[456px] w-full flex-col gap-5">
            {onboardingOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    "flex h-[99px] w-full items-center gap-4 rounded-2xl bg-[#F0F0F0] px-4 py-3.5 text-left",
                    "focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
                  )}
                  aria-pressed={isSelected}
                >
                  <div className="flex size-12 items-center justify-center rounded-lg bg-white">
                    <Icon className="size-[30px] text-primary" strokeWidth={2.5} />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
                    <p className="truncate typography-body-base font-semibold text-[#1C2024]">
                      {option.title}
                    </p>
                    <p className="line-clamp-2 typography-body-sm-reg text-[#737373]">
                      {option.description}
                    </p>
                  </div>

                </button>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 h-[91px]">
        <div className="mx-auto flex h-full w-full max-w-[375px] items-start px-5 pt-4">
          <Button className="h-11 w-full">여행 계획 시작하기</Button>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingPage;
