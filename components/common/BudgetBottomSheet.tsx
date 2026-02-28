"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import BudgetInputField from "@/components/common/BudgetInputField";

type BudgetBottomSheetMode =
  | "add-expense"       // 지출 추가
  | "edit-expense"      // 지출 수정/삭제
  | "create-expense";   // 추가 지출 생성

type ExpenseItem = {
  id: number;
  name: string;
  amount: string;
};

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
  "add-expense":    { cancelLabel: "취소",    confirmLabel: "저장하기" },
  "edit-expense":   { cancelLabel: "삭제하기", confirmLabel: "수정하기" },
  "create-expense": { cancelLabel: "취소",    confirmLabel: "저장하기" },
} satisfies Record<BudgetBottomSheetMode, { cancelLabel: string; confirmLabel?: string }>;

const formatAmount = (raw: string) => {
  const numeric = raw.replace(/[^0-9]/g, "");
  return numeric ? Number(numeric).toLocaleString("ko-KR") : "";
};

let nextId = 1;
const createItem = (): ExpenseItem => ({ id: nextId++, name: "", amount: "0" });

function BudgetBottomSheet({
  open,
  onOpenChange,
  mode,
  placeName,
  onCancel,
  onConfirm,
  onDelete,
}: BudgetBottomSheetProps) {
  const [items, setItems] = useState<ExpenseItem[]>([createItem()]);

  const updateItem = (id: number, field: "name" | "amount", value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, createItem()]);

  const hasTitle = mode === "add-expense" || mode === "edit-expense";
  const { cancelLabel, confirmLabel } = BUTTON_CONFIG[mode];

  const isAddExpenseValid = items.every(
    (item) => item.name.trim() !== "" && Number(item.amount.replace(/,/g, "")) > 0
  );
  const confirmDisabled = mode === "add-expense" ? !isAddExpenseValid : false;

  const addExpenseContent = (
    <div className="flex flex-col gap-5">
      {/* 인풋 그룹 목록 */}
      <div className="flex w-full flex-col">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex flex-col gap-5 pb-5 ${
              index < items.length - 1 ? "border-b border-[#E2E2E2]" : ""
            } ${index > 0 ? "pt-5" : ""}`}
          >
            <BudgetInputField
              label="지출 항목"
              value={item.name}
              onChange={(v) => updateItem(item.id, "name", v)}
              inputMode="text"
              unit=""
              placeholder="지출 항목을 입력해 주세요"
            />
            <BudgetInputField
              label="금액"
              value={item.amount}
              onChange={(v) => updateItem(item.id, "amount", formatAmount(v))}
            />
          </div>
        ))}
      </div>

      {/* 추가 버튼 */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="L"
          onClick={addItem}
          className="size-11 rounded-full bg-[#0EA5E9] p-0 hover:bg-[#0EA5E9]/90"
        >
          <Plus className="size-5 text-white" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );

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
      confirmDisabled={confirmDisabled}
      content={
        <div>
          {mode === "add-expense" && addExpenseContent}
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
