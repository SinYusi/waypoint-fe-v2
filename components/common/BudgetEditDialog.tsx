"use client";

import { useState } from "react";
import { Check, CircleHelp } from "lucide-react";
import AppDialog from "@/components/common/AppDialog";
import { Button } from "@/components/ui/button";
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
  /** 저장 클릭 시 콜백 */
  onSave?: (data: { mode: BudgetMode; totalBudget?: number }) => void;
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
  onSave,
}: BudgetEditDialogProps) => {
  const [mode, setMode] = useState<BudgetMode>(defaultMode);
  const [budgetInput, setBudgetInput] = useState(
    initialBudget ? initialBudget.toLocaleString("ko-KR") : "",
  );

  const handleSave = () => {
    const totalBudget = budgetInput
      ? Number(budgetInput.replace(/,/g, ""))
      : undefined;
    onSave?.({ mode, totalBudget });
    onOpenChange(false);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="여행 예산 편집"
      contentClassName="max-w-[425px]"
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
              />
            </div>
          </TabsContent>

          {/* 지출 중심 */}
          <TabsContent value="expense">
            <div className="flex flex-col gap-4">
              {/* 안내 카드 */}
              <div className="flex items-start gap-2 rounded-xl border border-[#E2E2E2] px-3 py-2">
                <CircleHelp
                  className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                  strokeWidth={2}
                />
                <p className="typography-body-sm-reg text-muted-foreground">
                  별도의 예산 설정 없이 지출을 기록하고, 총 지출 금액을
                  한눈에 확인할 수 있습니다.
                </p>
              </div>
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

interface BudgetInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const BudgetInputField = ({ label, value, onChange }: BudgetInputFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className="typography-body-sm-sb text-foreground">{label}</label>
    <div className="flex h-11 items-center gap-2 rounded-xl bg-muted px-3 py-2 outline-none border border-transparent has-focus:border-sky-500 has-focus:ring-2 has-focus:ring-sky-500/25 transition-all">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="1,500,000"
        className="w-full bg-transparent outline-none typography-body-base text-foreground placeholder:text-muted-foreground"
      />
      <span className="typography-action-base-bold shrink-0 text-muted-foreground">
        원
      </span>
    </div>
  </div>
);

export default BudgetEditDialog;
