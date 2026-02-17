"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field-description";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { useCreateCollection } from "@/lib/hooks/collection/use-create-collection";
import { validateCollectionTitle } from "@/lib/utils/validate-collection-title";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CollectionCreatePage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutate, isPending } = useCreateCollection({
    onSuccess: () => {
      setTitle("");
      setErrorMessage("");
      router.push("/home");
    },
    onError: (err) => {
      const message =
        err.response?.data?.errors?.[0]?.reason ??
        err.response?.data?.detail ??
        "보관함 생성에 실패했어요. 잠시 후 다시 시도해 주세요.";

      setErrorMessage(message);
    },
  });

  const handleCreate = () => {
    const v = validateCollectionTitle(title);
    if (!v.ok) {
      setErrorMessage(v.message);
      return;
    }
    if (isPending) return;

    setErrorMessage("");
    mutate({ title: v.value });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {/* 헤더(뒤로가기) */}
      <Header
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed top-0 z-10 inset-x-0"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        className="flex flex-col flex-1 justify-between px-5 py-18.75"
      >
        <div className="flex flex-col gap-10 pt-4">
          {/* 타이틀 + 설명 */}
          <div className="flex flex-col gap-5 text-start pt-16">
            <h2 className="typography-display-2xl">
              어떤 여행을 꿈꾸고 계신가요?
            </h2>
            <p className="typography-body-base text-muted-foreground">
              보관함 이름을 입력하고,
              <br />
              가고 싶은 장소들을 우리만의 공간에 담아보세요!
            </p>
          </div>

          {/* 컬렉션 Field */}
          <div className="flex flex-col gap-2">
            <Label>보관함 이름</Label>
            <div className="flex flex-col gap-1.5">
              <InputForm
                hideIcon
                value={title}
                error={!!errorMessage}
                placeholder="예) 우리만의 제주도 맛집 투어"
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                onBlur={() => {
                  const v = validateCollectionTitle(title);
                  if (!v.ok) setErrorMessage(v.message);
                }}
              />
              {errorMessage && (
                <FieldDescription error>{errorMessage}</FieldDescription>
              )}
            </div>
          </div>
        </div>

        {/* 컬렉션 생성 버튼 */}
        <Button
          type="submit"
          disabled={isPending || !title.trim()}
          className="w-full"
        >
          보관함 만들기
        </Button>
      </form>
    </div>
  );
};

export default CollectionCreatePage;
