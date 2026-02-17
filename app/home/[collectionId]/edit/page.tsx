"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field-description";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { useCollection } from "@/lib/hooks/collection/use-collection";
import { useUpdateCollection } from "@/lib/hooks/collection/use-update-collection";
import { validateCollectionTitle } from "@/lib/utils/validate-collection-title";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const CollectionEditPage = () => {
  const router = useRouter();
  const params = useParams<{ collectionId: string }>();

  const collectionId = useMemo(
    () => params.collectionId,
    [params.collectionId],
  );

  // 컬렉션 조회
  const { data, isLoading, isError } = useCollection(collectionId);

  const [draftTitle, setDraftTitle] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const initialTitle = data?.title ?? "";
  const currentTitle = draftTitle ?? initialTitle;

  // 컬렉션 수정
  const { mutate, isPending } = useUpdateCollection({
    onSuccess: () => {
      setErrorMessage("");
      router.push("/home");
    },
    onError: (err) => {
      const message =
        err.response?.data?.errors?.[0]?.reason ??
        err.response?.data?.detail ??
        "보관함 수정에 실패했어요. 잠시 후 다시 시도해 주세요.";

      setErrorMessage(message);
    },
  });

  const handleUpdate = () => {
    const v = validateCollectionTitle(currentTitle);
    if (!v.ok) {
      setErrorMessage(v.message);
      return;
    }
    if (isPending) return;

    setErrorMessage("");
    mutate({ collectionId, body: { title: v.value } });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더(뒤로가기) */}
      <Header
        variant="center"
        title="보관함 수정하기"
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed top-0 z-10 inset-x-0"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="flex flex-col flex-1 justify-between px-5 py-18.75"
      >
        <div className="flex flex-col gap-2 pt-16">
          <Label>보관함 이름</Label>
          <div className="flex flex-col gap-1.5">
            <InputForm
              key={collectionId}
              hideIcon
              defaultValue={initialTitle}
              error={!!errorMessage}
              placeholder={
                isLoading ? "불러오는 중..." : "예) 우리만의 제주도 맛집 투어"
              }
              disabled={isLoading || isError}
              onChange={(e) => {
                setDraftTitle(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              onBlur={() => {
                const v = validateCollectionTitle(currentTitle);
                if (!v.ok) setErrorMessage(v.message);
              }}
            />
            {errorMessage && (
              <FieldDescription error>{errorMessage}</FieldDescription>
            )}
          </div>
        </div>

        {/* 컬렉션 수정 버튼 */}
        <Button
          type="submit"
          disabled={
            isLoading ||
            isError ||
            isPending ||
            !currentTitle.trim() ||
            currentTitle === initialTitle
          }
          className="w-full"
        >
          보관함 수정하기
        </Button>
      </form>
    </div>
  );
};

export default CollectionEditPage;
