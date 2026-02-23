"use client";

import { useState } from "react";
import { Angry, Laugh, Smile } from "lucide-react";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Chip, Chips } from "@/components/ui/chip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  OPINION_REASON_MAP,
  OPINION_STATE_LABEL,
  type OpinionCategoryKey,
  type OpinionReason,
  type OpinionState,
} from "@/lib/opinion-bottom-sheet";
import { cn } from "@/lib/utils/utils";

const STATE_ICONS: Record<OpinionState, React.ReactNode> = {
  POSITIVE: <Laugh />,
  NEUTRAL: <Smile />,
  NEGATIVE: <Angry />,
};

const CUSTOM_INPUT_REASON: OpinionReason = {
  id: 0,
  text: "직접 입력",
};

type OpinionBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryKey: OpinionCategoryKey;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  closeOnCancel?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  /** 외부에서 제어할 때 사용 (생략 시 내부 상태로 관리) */
  state?: OpinionState;
  onStateChange?: (state: OpinionState) => void;
  selectedReasonIds?: number[];
  onSelectReason?: (reason: OpinionReason, selected: boolean) => void;
  onSelectedReasonIdsChange?: (selectedReasonIds: number[]) => void;
  customInputText?: string;
  onCustomInputTextChange?: (text: string) => void;
  className?: string;
};

function OpinionBottomSheet({
  open,
  onOpenChange,
  categoryKey,
  cancelLabel = "취소",
  confirmLabel = "입력 완료",
  confirmDisabled: confirmDisabledProp,
  closeOnCancel = true,
  onCancel,
  onConfirm,
  state: stateProp,
  onStateChange,
  selectedReasonIds: selectedReasonIdsProp,
  onSelectReason,
  onSelectedReasonIdsChange,
  customInputText: customInputTextProp,
  onCustomInputTextChange,
  className,
}: OpinionBottomSheetProps) {
  const [internalState, setInternalState] = useState<OpinionState>("POSITIVE");
  const [internalSelectedReasonIdsByState, setInternalSelectedReasonIdsByState] = useState<Record<OpinionState, number[]>>({
    POSITIVE: [],
    NEUTRAL: [],
    NEGATIVE: [],
  });
  const [internalCustomInputTextByState, setInternalCustomInputTextByState] = useState<Record<OpinionState, string>>({
    POSITIVE: "",
    NEUTRAL: "",
    NEGATIVE: "",
  });
  const state = stateProp ?? internalState;
  const selectedReasonIds = selectedReasonIdsProp ?? internalSelectedReasonIdsByState[state];
  const customInputText = customInputTextProp ?? internalCustomInputTextByState[state];
  const isCustomInputSelected = selectedReasonIds.includes(CUSTOM_INPUT_REASON.id);
  const isConfirmDisabled =
    (confirmDisabledProp ?? false) ||
    selectedReasonIds.length === 0 ||
    (isCustomInputSelected && customInputText.trim() === "");

  const handleCustomInputTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalCustomInputTextByState((prev) => ({ ...prev, [state]: e.target.value }));
    onCustomInputTextChange?.(e.target.value);
  };

  const handleStateChange = (value: string) => {
    const next = value as OpinionState;
    setInternalState(next);
    onStateChange?.(next);
    // controlled 모드(외부에서 selectedReasonIds를 주입)일 때는 부모가 onStateChange에서 직접 처리하므로
    // onSelectedReasonIdsChange/onCustomInputTextChange를 여기서 호출하지 않음
    // uncontrolled 모드일 때만 내부 탭별 상태로 자동 전환됨
  };

  const handleReasonClick = (reason: OpinionReason) => {
    const isSelected = selectedReasonIds.includes(reason.id);
    const nextSelectedReasonIds = isSelected
      ? selectedReasonIds.filter((id) => id !== reason.id)
      : [...selectedReasonIds, reason.id];

    setInternalSelectedReasonIdsByState((prev) => ({ ...prev, [state]: nextSelectedReasonIds }));
    onSelectedReasonIdsChange?.(nextSelectedReasonIds);
    onSelectReason?.(reason, !isSelected);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      confirmDisabled={isConfirmDisabled}
      closeOnCancel={closeOnCancel}
      onCancel={onCancel}
      onConfirm={onConfirm}
      className={cn("h-165.5 w-full gap-0.5 rounded-t-3xl", className)}
      content={
        <Chips className="max-w-full items-start gap-2.5 pb-0">
          {OPINION_REASON_MAP[categoryKey][state].map((reason) => (
            <Chip
              key={`${categoryKey}-${state}-${reason.id}`}
              variant={selectedReasonIds.includes(reason.id) ? "active" : "primary"}
              onClick={() => handleReasonClick(reason)}
              className="h-8 w-fit gap-2.5 rounded-xl px-3 py-1.5"
            >
              {reason.text}
            </Chip>
          ))}
          <div className="flex w-full flex-col gap-2">
            <Chip
              variant={isCustomInputSelected ? "active" : "primary"}
              onClick={() => handleReasonClick(CUSTOM_INPUT_REASON)}
              className="h-8 w-fit gap-2.5 rounded-xl px-3 py-1.5"
            >
              {CUSTOM_INPUT_REASON.text}
            </Chip>
            {isCustomInputSelected && (
              <Textarea
                value={customInputText}
                onChange={handleCustomInputTextChange}
                placeholder="의견을 직접 입력해 주세요"
                className="min-h-11 w-full rounded-xl bg-[#F0F0F0] px-3 py-0.75 typography-body-sm-reg"
              />
            )}
          </div>
        </Chips>
      }
      header={
        <div className="mb-5 flex w-full flex-col gap-5">
          <div className="flex h-19 flex-col gap-2">
            <span className="h-7 w-full typography-display-lg-bold text-foreground">
              장소에 대한 의견을 남겨보세요
            </span>
            <span className="h-10 w-40.75 typography-body-sm-reg text-muted-foreground">
              의견을 함께 남기면 팀원들의 생각을 쉽게 이해할 수 있어요.
            </span>
          </div>

          {/* 탭: 선호해요 / 가능해요 / 불가능해요 */}
          <Tabs value={state} onValueChange={handleStateChange} className="w-full">
            <TabsList style="underline" fullWidth className="w-full">
              {(["POSITIVE", "NEUTRAL", "NEGATIVE"] as const).map((s) => (
                <TabsTrigger
                  key={s}
                  value={s}
                  style="underline"
                  fullWidth
                  icon={STATE_ICONS[s]}
                >
                  {OPINION_STATE_LABEL[s]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      }
    />
  );
}

export default OpinionBottomSheet;
export type { OpinionBottomSheetProps };
