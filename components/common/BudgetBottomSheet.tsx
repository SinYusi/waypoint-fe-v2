"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import BudgetInputField from "@/components/common/BudgetInputField";

type BudgetBottomSheetMode =
  | "add-expense"       // 지출 추가
  | "edit-expense"      // 지출 수정/삭제
  | "create-expense";   // 추가 지출 생성

type ExpenseItem = {
  id: number;
  expense_item_id?: string;
  name: string;
  amount: string;
};

type EditExpenseItem = {
  expense_item_id?: string;
  name: string;
  cost: number;
};

type BudgetBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: BudgetBottomSheetMode;
  /** 지출 추가/수정·삭제 모드에서 사용되는 장소 이름 */
  placeName?: string;
  /** 지출 수정/삭제 모드에서 표시할 기존 지출 목록 */
  editItems?: EditExpenseItem[];
  /** 지출 추가: 취소, 지출 수정/삭제: 닫기 */
  onCancel?: () => void;
  /** 지출 추가: 저장하기, 지출 수정/삭제: 수정하기 */
  onConfirm?: () => void;
  /** 지출 수정/삭제 모드 전용: 삭제하기 */
  onDelete?: () => void;
  /** 저장/수정 시 최종 항목 전달 */
  onSave?: (items: EditExpenseItem[]) => void;
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
const createItemFromEdit = (item: EditExpenseItem): ExpenseItem => ({
  id: nextId++,
  expense_item_id: item.expense_item_id,
  name: item.name,
  amount: item.cost.toLocaleString("ko-KR"),
});

function BudgetBottomSheet({
  open,
  onOpenChange,
  mode,
  placeName,
  editItems = [],
  onCancel,
  onConfirm,
  onDelete,
  onSave,
}: BudgetBottomSheetProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isEditFormMode, setIsEditFormMode] = useState(false);

  // add-expense 전용 state
  const [items, setItems] = useState<ExpenseItem[]>([createItem()]);
  const [editFormItems, setEditFormItems] = useState<ExpenseItem[]>([]);

  // create-expense 전용 state
  const [createName, setCreateName] = useState("");
  const [createAmount, setCreateAmount] = useState("0");

  const updateItem = (id: number, field: "name" | "amount", value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };
  const updateEditFormItem = (id: number, field: "name" | "amount", value: string) => {
    setEditFormItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, createItem()]);
  const addEditFormItem = () => setEditFormItems((prev) => [...prev, createItem()]);
  const removeItem = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id));
  const removeEditFormItem = (id: number) =>
    setEditFormItems((prev) => prev.filter((item) => item.id !== id));

  const resetEditState = () => {
    setDeleteConfirmOpen(false);
    setIsEditFormMode(false);
    setEditFormItems([]);
    setItems([createItem()]);
    setCreateName("");
    setCreateAmount("0");
  };

  const handleSheetOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetEditState();
    }
    onOpenChange(nextOpen);
  };

  const hasTitle = mode === "add-expense" || mode === "edit-expense";
  const { cancelLabel: defaultCancelLabel, confirmLabel } = BUTTON_CONFIG[mode];
  const cancelLabel =
    mode === "edit-expense" && isEditFormMode ? "취소" : defaultCancelLabel;

  const isAddExpenseValid = items.every(
    (item) => item.name.trim() !== "" && Number(item.amount.replace(/,/g, "")) > 0
  );
  const isCreateExpenseValid =
    createName.trim() !== "" && Number(createAmount.replace(/,/g, "")) > 0;
  const isEditExpenseValid = editFormItems.every(
    (item) => item.name.trim() !== "" && Number(item.amount.replace(/,/g, "")) > 0
  );

  const confirmDisabled =
    mode === "add-expense" ? !isAddExpenseValid :
    mode === "edit-expense" && isEditFormMode ? !isEditExpenseValid :
    mode === "create-expense" ? !isCreateExpenseValid :
    false;

  const sheetHeight =
    mode === "create-expense" ? "h-139" :
    mode === "edit-expense" && isEditFormMode
      ? editFormItems.length === 1 ? "h-168.75" : "h-183.25"
      : mode === "edit-expense" ? "h-168.75" :
    items.length === 1 ? "h-168.75" :
    "h-183.25";

  /* ── add-expense 콘텐츠 ── */
  const addExpenseContent = (
    <div className="flex flex-col gap-5">
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
              labelAction={
                items.length >= 2 ? (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="flex size-9 items-center justify-center rounded-2xl p-1.25 hover:bg-accent"
                  >
                    <Trash2 className="size-4.5 text-[#1C2024]" strokeWidth={2} />
                  </button>
                ) : undefined
              }
            />
            <BudgetInputField
              label="금액"
              value={item.amount}
              onChange={(v) => updateItem(item.id, "amount", formatAmount(v))}
            />
          </div>
        ))}
      </div>

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

  /* ── edit-expense 콘텐츠 ── */
  const editExpenseContent = (
    <div className="flex flex-col gap-5">
      <div className="flex w-full flex-col">
        {editItems.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col gap-5 pb-5 ${
              index < editItems.length - 1 ? "border-b border-[#E2E2E2]" : ""
            } ${index > 0 ? "pt-5" : ""}`}
          >
            {/* 지출 항목 */}
            <div className="flex flex-col gap-2">
              <span className="font-sans text-sm font-semibold leading-5 text-[#1C2024]">
                지출 항목
              </span>
              <span className="font-sans text-base font-normal leading-6 text-[#1C2024]">
                {item.name}
              </span>
            </div>

            {/* 금액 */}
            <div className="flex flex-col gap-2">
              <span className="font-sans text-sm font-semibold leading-5 text-[#1C2024]">
                금액
              </span>
              <span className="font-sans text-base font-normal leading-6 text-[#1C2024]">
                {item.cost.toLocaleString("ko-KR")} 원
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const editExpenseFormContent = (
    <div className="flex flex-col gap-5">
      <div className="flex w-full flex-col">
        {editFormItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex flex-col gap-5 pb-5 ${
              index < editFormItems.length - 1 ? "border-b border-[#E2E2E2]" : ""
            } ${index > 0 ? "pt-5" : ""}`}
          >
            <BudgetInputField
              label="지출 항목"
              value={item.name}
              onChange={(v) => updateEditFormItem(item.id, "name", v)}
              inputMode="text"
              unit=""
              placeholder="지출 항목을 입력해 주세요"
              labelAction={
                editFormItems.length >= 2 ? (
                  <button
                    type="button"
                    onClick={() => removeEditFormItem(item.id)}
                    className="flex size-9 items-center justify-center rounded-2xl p-1.25 hover:bg-accent"
                  >
                    <Trash2 className="size-4.5 text-[#1C2024]" strokeWidth={2} />
                  </button>
                ) : undefined
              }
            />
            <BudgetInputField
              label="금액"
              value={item.amount}
              onChange={(v) => updateEditFormItem(item.id, "amount", formatAmount(v))}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="L"
          onClick={addEditFormItem}
          className="size-11 rounded-full bg-[#0EA5E9] p-0 hover:bg-[#0EA5E9]/90"
        >
          <Plus className="size-5 text-white" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );

  /* ── create-expense 콘텐츠 ── */
  const createExpenseContent = (
    <div className="flex flex-col gap-5">
      <BudgetInputField
        label="지출 항목"
        value={createName}
        onChange={setCreateName}
        inputMode="text"
        unit=""
        placeholder="지출 항목을 입력해 주세요"
      />
      <BudgetInputField
        label="금액"
        value={createAmount}
        onChange={(v) => setCreateAmount(formatAmount(v))}
      />
    </div>
  );

  return (
    <>
      <BottomSheet
        open={open}
        onOpenChange={handleSheetOpenChange}
        className={sheetHeight}
        header={
          hasTitle ? (
            <h2 className="mb-2 w-full text-center font-sans text-lg font-semibold leading-4 tracking-normal text-black">
              {placeName ?? ""}
            </h2>
          ) : undefined
        }
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        closeOnCancel={mode !== "edit-expense"}
        closeOnConfirm={!(mode === "edit-expense" && !isEditFormMode)}
        onCancel={
          mode === "edit-expense"
            ? () => {
                if (isEditFormMode) {
                  setIsEditFormMode(false);
                  setEditFormItems([]);
                  return;
                }
                setDeleteConfirmOpen(true);
              }
            : onCancel
        }
        onConfirm={
          mode === "edit-expense"
            ? () => {
                if (!isEditFormMode) {
                  setEditFormItems(
                    editItems.length > 0 ? editItems.map(createItemFromEdit) : [createItem()]
                  );
                  setIsEditFormMode(true);
                  return;
                }
                // 수정 폼 확정 → onSave 호출
                onSave?.(
                  editFormItems.map((i) => ({
                    expense_item_id: i.expense_item_id,
                    name: i.name,
                    cost: Number(i.amount.replace(/,/g, "")),
                  }))
                );
                onConfirm?.();
              }
            : () => {
                // add-expense / create-expense → onSave 호출
                if (mode === "add-expense") {
                  onSave?.(
                    items.map((i) => ({
                      name: i.name,
                      cost: Number(i.amount.replace(/,/g, "")),
                    }))
                  );
                } else if (mode === "create-expense") {
                  onSave?.([
                    { name: createName, cost: Number(createAmount.replace(/,/g, "")) },
                  ]);
                }
                onConfirm?.();
              }
        }
        confirmDisabled={confirmDisabled}
        content={
          <div>
            {mode === "add-expense" && addExpenseContent}
            {mode === "edit-expense" && (isEditFormMode ? editExpenseFormContent : editExpenseContent)}
            {mode === "create-expense" && createExpenseContent}
          </div>
        }
      />

      <AppAlertDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="지출 기록을 삭제하시겠습니까?"
        description={`기록 되었던 예산 기록은 삭제 이후\n복구되지 않습니다.`}
        cancelLabel="취소"
        onCancel={() => setDeleteConfirmOpen(false)}
        actionLabel="삭제하기"
        onAction={() => {
          setDeleteConfirmOpen(false);
          onDelete?.();
          handleSheetOpenChange(false);
        }}
      />
    </>
  );
}

export default BudgetBottomSheet;
export type { BudgetBottomSheetProps, BudgetBottomSheetMode, EditExpenseItem };
