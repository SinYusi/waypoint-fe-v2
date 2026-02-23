"use client";

import Header from "@/components/layout/Header";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBlockDetail, useUpdateBlock } from "@/lib/hooks/use-block-detail";
import { Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const MEMO_MAX_LENGTH = 300;

const FreeDetailPage = () => {
  const params = useParams<{
    planId: string | string[];
    timeBlockId: string | string[];
  }>();
  const planId = Array.isArray(params.planId)
    ? params.planId[0]
    : params.planId;
  const blockId = Array.isArray(params.timeBlockId)
    ? params.timeBlockId[0]
    : params.timeBlockId;

  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoDraft, setMemoDraft] = useState("");

  const {
    data: blockDetail,
    isLoading,
    isError,
  } = useBlockDetail({
    planId,
    blockId,
    enabled: Boolean(planId && blockId),
  });
  const updateBlockMutation = useUpdateBlock({ planId, blockId });

  const memo = blockDetail?.memo ?? "";
  const dayText = `${blockDetail?.day ?? 0}일차`;
  const dateText = (() => {
    if (!blockDetail?.date) return "";
    const date = new Date(blockDetail.date);
    if (Number.isNaN(date.getTime())) return blockDetail.date;
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  })();
  const timeText =
    blockDetail?.startTime && blockDetail?.endTime
      ? `${blockDetail.startTime}~${blockDetail.endTime}`
      : "";

  const handleEditMemo = () => {
    setMemoDraft(memo);
    setIsEditingMemo(true);
  };

  const handleSaveMemo = () => {
    if (updateBlockMutation.isPending) return;

    const nextMemo = memoDraft.slice(0, MEMO_MAX_LENGTH);
    if (nextMemo === memo) {
      setIsEditingMemo(false);
      return;
    }

    updateBlockMutation.mutate(
      { memo: nextMemo },
      {
        onSuccess: () => {
          setIsEditingMemo(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="center"
        title="자유 시간"
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed top-0 inset-x-0"
      />

      <main className="mt-20 flex flex-col flex-1 px-5 pb-3.5 gap-2.5 w-full">
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center text-muted-foreground">
            불러오는 중...
          </div>
        ) : isError ? (
          <div className="fixed inset-0 flex items-center justify-center text-destructive">
            블록 정보를 불러오지 못했습니다.
          </div>
        ) : (
          <div className="pt-4 flex flex-col flex-1 gap-7 border-b border-border">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-1.75">
                  <Calendar className="text-primary" />
                  <span className="typography-body-sm-sb">{dayText}</span>
                  <p className="typography-body-sm-reg text-muted-foreground">
                    {dateText}
                  </p>
                </div>
                <p className="typography-body-sm-reg text-muted-foreground">
                  {timeText}
                </p>
              </div>
              <div className="flex flex-col gap-0 w-full">
                <Label
                  isEditing={isEditingMemo}
                  onEdit={handleEditMemo}
                  onSave={handleSaveMemo}
                  className="w-full h-9"
                >
                  <span className="typography-label-sm-sb text-foreground align-middle">
                    메모
                  </span>
                </Label>
                <div className="w-full">
                  {isEditingMemo ? (
                    <Textarea
                      placeholder="메모를 입력해주세요"
                      value={memoDraft}
                      onChange={(e) =>
                        setMemoDraft(e.target.value.slice(0, MEMO_MAX_LENGTH))
                      }
                      maxLength={MEMO_MAX_LENGTH}
                      className="typography-body-base! text-foreground!"
                      disabled={updateBlockMutation.isPending}
                    />
                  ) : (
                    <div className="flex items-start gap-2.5 py-2.5">
                      <p className="w-full whitespace-pre-wrap wrap-break-word align-middle typography-body-base text-foreground">
                        {memo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FreeDetailPage;
