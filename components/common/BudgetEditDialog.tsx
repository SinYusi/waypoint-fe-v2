"use client";

import { useState } from "react";
import { Check, CircleHelp } from "lucide-react";
import AppDialog from "@/components/common/AppDialog";
import { Button } from "@/components/ui/button";
import BudgetInputField from "@/components/common/BudgetInputField";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type BudgetMode = "budget" | "expense";

interface BudgetEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 초기 활성 탭 */
  defaultMode?: BudgetMode;
  /** 초기 총 여행 예산 */
  initialBudget?: number;
  /** 초기 여행 인원 수 */
  initialPersonCount?: number;
  /** 저장 클릭 시 콜백 */
  onSave?: (data: { mode: BudgetMode; totalBudget?: number; personCount?: number }) => void;
}

const formatInput = (raw: string) => {
  const numeric = raw.replace(/[^0-9]/g, "");
  return numeric ? Number(numeric).toLocaleString("ko-KR") : "";
};

const BudgetEditDialog = ({
  open,
  onOpenChange,
  defaultMode = "budget",
  initialBudget,
  initialPersonCount,
  onSave,
}: BudgetEditDialogProps) => {
  const [mode, setMode] = useState<BudgetMode>(defaultMode);
  const [budgetInput, setBudgetInput] = useState(
    initialBudget ? initialBudget.toLocaleString("ko-KR") : "",
  );
  const [personInput, setPersonInput] = useState(
    initialPersonCount ? String(initialPersonCount) : "",
  );
  const [personError, setPersonError] = useState(false);

  const handleSave = () => {
    const personCount = personInput ? Number(personInput) : 0;
    if (personCount === 0) {
      setPersonError(true);
      return;
    }
    const totalBudget = budgetInput
      ? Number(budgetInput.replace(/,/g, ""))
      : undefined;
    onSave?.({ mode, totalBudget, personCount });
    onOpenChange(false);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="여행 예산 편집"
      contentClassName="w-[calc(100%-2.5rem)] max-w-[425px] sm:max-w-[425px]"
    >
      <div className="flex flex-col gap-5">
        {/* 탭 */}
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as BudgetMode)}
        >
          <TabsList style="underline" fullWidth className="mb-5">
            <TabsTrigger value="budget" style="underline" fullWidth>
              예산 중심
            </TabsTrigger>
            <TabsTrigger value="expense" style="underline" fullWidth>
              지출 중심
            </TabsTrigger>
          </TabsList>

          {/* 예산 중심 */}
          <TabsContent value="budget">
            <div className="flex flex-col gap-4">
              {/* 안내 카드 */}
              <div className="flex items-start gap-2 rounded-xl border border-[#E2E2E2] px-3 py-2">
                <CircleHelp
                  className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                  strokeWidth={2}
                />
                <p className="typography-body-sm-reg text-muted-foreground">
                  예산을 미리 설정하고, 설정한 예산을 기준으로 남은 예산과
                  지출액을 확인할 수 있습니다.
                </p>
              </div>

              {/* 총 여행 예산 입력 */}
              <BudgetInputField
                label="총 여행 예산"
                value={budgetInput}
                onChange={(v) => setBudgetInput(formatInput(v))}
                placeholder="다 같이 얼마를 쓰면 좋을까요?"
              />

              {/* 여행 인원 수 입력 */}
              <BudgetInputField
                label="여행 인원 수"
                value={personInput}
                onChange={(v) => { setPersonError(false); setPersonInput(v.replace(/[^0-9]/g, "")); }}
                unit="명"
                placeholder="모두 몇 명이서 떠나나요?"
                error={personError}
                errorMessage="한 명 이상의 인원을 입력해 주세요"
              />
            </div>
          </TabsContent>

          {/* 지출 중심 */}
          <TabsContent value="expense">
            <div className="flex flex-col gap-4 min-h-58">
              {/* 안내 카드 */}
              <div className="flex items-start gap-2 rounded-xl border border-[#E2E2E2] px-3 py-2">
                <CircleHelp
                  className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                  strokeWidth={2}
                />
                <p className="typography-body-sm-reg text-muted-foreground">
                  여행 계획에 등록한 일정과 금액을 기준으로, 설정한 인원 수에 따라 분할 계산합니다.
                </p>
              </div>

              {/* 여행 인원 수 입력 */}
              <BudgetInputField
                label="여행 인원 수"
                value={personInput}
                onChange={(v) => { setPersonError(false); setPersonInput(v.replace(/[^0-9]/g, "")); }}
                unit="명"
                placeholder="모두 몇 명이서 떠나나요?"
                error={personError}
                errorMessage="한 명 이상의 인원을 입력해 주세요"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* 하단 버튼 */}
        <Button
          className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white typography-action-sm-bold"
          icon={<Check className="size-4.5 text-black/40" strokeWidth={2} />}
          onClick={handleSave}
        >
          설정 완료
        </Button>
      </div>
    </AppDialog>
  );
};

export default BudgetEditDialog;
