"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthInit } from "@/lib/hooks/use-auth-init";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import CheckBox from "@/components/common/CheckBox";
import { InputForm } from "@/components/ui/input-form";
import { ChevronRight } from "lucide-react";
import { useUpdateMe } from "@/lib/hooks/use-update-me";
import { useAgreeTerms } from "@/lib/hooks/use-agree-terms";
import { toast } from "sonner";

const OnboardPage = () => {
  const router = useRouter();
  const { isReady } = useAuthInit();
  const [step, setStep] = useState(1);

  // step 1
  const [allChecked, setAllChecked] = useState(false);
  const [serviceChecked, setServiceChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  // step 2
  const [nickname, setNickname] = useState("");

  // step 3
  const [selectedCard, setSelectedCard] = useState<
    "collection" | "plan" | null
  >(null);

  const { mutate: agreeTerms, isPending: isAgreeTermsPending } = useAgreeTerms({
    onSuccess: () => {
      setStep(2);
    },
    onError: (err) => {
      if (err.response?.status === 409) {
        setStep(2);
        return;
      }
      toast.error(
        err.response?.data?.detail ?? "약관 동의에 실패했어요. 다시 시도해 주세요.",
      );
    },
  });

  const { mutate: updateMe, isPending } = useUpdateMe({
    onSuccess: () => {
      if (selectedCard === "collection") {
        router.replace("/home/create");
      } else if (selectedCard === "plan") {
        router.replace("/projects/create");
      } else {
        router.replace("/home");
      }
    },
  });

  if (!isReady) return null;

  const handleAllChange = (checked: boolean) => {
    setAllChecked(checked);
    setServiceChecked(checked);
    setPrivacyChecked(checked);
  };

  const handleServiceChange = (checked: boolean) => {
    setServiceChecked(checked);
    setAllChecked(checked && privacyChecked);
  };

  const handlePrivacyChange = (checked: boolean) => {
    setPrivacyChecked(checked);
    setAllChecked(checked && serviceChecked);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (step === 1) {
      agreeTerms();
    } else if (step === 2) {
      setStep(3);
    } else {
      updateMe({ nickname });
    }
  };

  const isNextDisabled =
    step === 1
      ? !serviceChecked || !privacyChecked
      : step === 2
        ? !nickname.trim()
        : false;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header
        showBackButton
        leftBtnBgVariant="ghost"
        onBack={handleBack}
        className="fixed top-0 z-10 inset-x-0"
      />

      <main className="flex-1 mt-22 px-5 flex flex-col gap-20">
        {step === 1 && (
          <>
            <div>
              <h2 className="typography-display-2xl">
                Tripixel에 오신 것을 <br />
                환영합니다!
              </h2>
              <p className="mt-5 text-(--muted-foreground) typography-action-base-reg">
                Tripixel을 이용하기 위해
                <br />
                약관 동의가 필요해요
              </p>
            </div>
            <div className="border-t border-[#e2e2e2] pt-6 flex flex-col gap-4">
              <label
                htmlFor="all"
                className="flex items-center gap-2 cursor-pointer"
              >
                <CheckBox
                  id="all"
                  checked={allChecked}
                  onCheckedChange={handleAllChange}
                />
                <span className="typography-label-base-sb">약관 전체 동의</span>
              </label>
              <div className="flex items-center gap-2">
                <CheckBox
                  id="service"
                  checked={serviceChecked}
                  onCheckedChange={handleServiceChange}
                />
                <button
                  type="button"
                  className="flex flex-1 items-center justify-between cursor-pointer"
                  onClick={() => {
                    // TODO: 이용약관 route 설정
                  }}
                >
                  <span className="typography-label-base-reg">
                    이용약관 동의{" "}
                    <span className="text-muted-foreground">(필수)</span>
                  </span>
                  <ChevronRight className="size-6 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <CheckBox
                  id="privacy"
                  checked={privacyChecked}
                  onCheckedChange={handlePrivacyChange}
                />
                <button
                  type="button"
                  className="flex flex-1 items-center justify-between cursor-pointer"
                  onClick={() => {
                    // TODO: 개인정보 수집 및 이용 동의 route 설정
                  }}
                >
                  <span className="typography-label-base-reg">
                    개인정보 수집 및 이용 동의{" "}
                    <span className="text-muted-foreground">(필수)</span>
                  </span>
                  <ChevronRight className="size-6 text-muted-foreground" />
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="typography-display-2xl">닉네임을 입력해주세요</h2>
              <p className="mt-5 text-(--muted-foreground) typography-action-base-reg">
                Tripixel에서 여행을 계획하며 활동할
                <br />
                닉네임을 입력해주세요
              </p>
            </div>
            <div>
              <p className="typography-action-sm-bold">닉네임을 입력해주세요</p>
              <InputForm
                hideIcon
                className="mt-2"
                placeholder="홍길동"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="typography-display-2xl">
                이제 Tripixel에서
                <br />
                여행을 시작해볼까요?
              </h2>
              <p className="mt-5 text-(--muted-foreground) typography-action-base-reg">
                Tripixel에서 본격적으로 여행을
                <br />
                시작할 수 있어요.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5 justify-center transition-colors cursor-pointer bg-white ${
                  selectedCard === "collection"
                    ? "border-sky-500"
                    : "border-[#e2e2e2]"
                }`}
                onClick={() =>
                  setSelectedCard(
                    selectedCard === "collection" ? null : "collection",
                  )
                }
              >
                <span className="typography-label-base-sb">보관함</span>
                <span className="typography-body-sm-reg text-muted-foreground">
                  마음에 드는 여행 장소를
                  <br />
                  저장해보세요.
                </span>
              </button>
              <button
                type="button"
                className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5 text-center transition-colors cursor-pointer bg-white ${
                  selectedCard === "plan"
                    ? "border-sky-500"
                    : "border-[#e2e2e2]"
                }`}
                onClick={() =>
                  setSelectedCard(selectedCard === "plan" ? null : "plan")
                }
              >
                <span className="typography-label-base-sb">여행 계획</span>
                <span className="typography-body-sm-reg text-muted-foreground">
                  여행 전 일정을 계획해
                  <br />
                  만들어보세요.
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 inset-x-0 px-5 pb-9">
        <Button
          className="w-full"
          disabled={isNextDisabled || isPending || isAgreeTermsPending}
          onClick={handleNext}
        >
          {step === 3 && selectedCard !== null ? "시작하기" : "다음"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardPage;
