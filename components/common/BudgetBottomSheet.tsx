"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";

type BudgetBottomSheetMode =
  | "add-expense"       // 지출 추가
  | "edit-expense"      // 지출 수정/삭제
  | "create-expense";   // 추가 지출 생성

type BudgetBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: BudgetBottomSheetMode;
  /** 지출 추가/수정·삭제 모드에서 사용되는 장소 이름 */
  placeName?: string;
  /** 지출 추가: 취소, 지출 수정/삭제: 닫기 */
  onCancel?: () => void;
  /** 지출 추가: 저장하기, 지출 수정/삭제: 수정하기 */
  onConfirm?: () => void;
  /** 지출 수정/삭제 모드 전용: 삭제하기 */
  onDelete?: () => void;
};

const BUTTON_CONFIG = {
  "add-expense":    { cancelLabel: "취소",   confirmLabel: "저장하기" },
  "edit-expense":   { cancelLabel: "삭제하기", confirmLabel: "수정하기" },
  "create-expense": { cancelLabel: "취소",   confirmLabel: "저장하기" },
} satisfies Record<BudgetBottomSheetMode, { cancelLabel: string; confirmLabel?: string }>;

function BudgetBottomSheet({
  open,
  onOpenChange,
  mode,
  placeName,
  onCancel,
  onConfirm,
  onDelete,
}: BudgetBottomSheetProps) {
  const hasTitle = mode === "add-expense" || mode === "edit-expense";
  const { cancelLabel, confirmLabel } = BUTTON_CONFIG[mode];

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      header={
        hasTitle ? (
          <h2 className="mb-2 w-full text-center font-sans text-lg font-semibold leading-4 tracking-normal text-black">
            {placeName ?? ""}
          </h2>
        ) : undefined
      }
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      onCancel={mode === "edit-expense" ? onDelete : onCancel}
      onConfirm={onConfirm}
      content={
        <div>
          {mode === "add-expense" && (
            <div>{/* TODO: 지출 추가 */}</div>
          )}
          {mode === "edit-expense" && (
            <div>{/* TODO: 지출 수정/삭제 */}</div>
          )}
          {mode === "create-expense" && (
            <div>{/* TODO: 추가 지출 생성 */}</div>
          )}
        </div>
      }
    />
  );
}

export default BudgetBottomSheet;
export type { BudgetBottomSheetProps, BudgetBottomSheetMode };
