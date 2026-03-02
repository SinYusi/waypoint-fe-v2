"use client";

import { useRef } from "react";
import { FieldDescription } from "@/components/ui/field-description";

interface BudgetInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** label 우측에 렌더링할 액션 버튼 */
  labelAction?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
}

const BudgetInputField = ({
  label,
  value,
  onChange,
  unit = "원",
  placeholder = "",
  inputMode = "numeric",
  labelAction,
  error,
  errorMessage,
}: BudgetInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEmpty = value === "";

  const handleFocus = () => {
    if (inputMode === "numeric") {
      if (isEmpty) {
        onChange("0");
        setTimeout(() => inputRef.current?.select(), 0);
      } else {
        inputRef.current?.select();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="typography-body-sm-sb text-foreground">{label}</label>
        {labelAction}
      </div>
      <div
        className={`flex h-11 items-center gap-2 rounded-xl bg-[#F0F0F0] px-3 py-2 outline-none border transition-all ${
          error
            ? "border-destructive"
            : "border-transparent has-focus:border-sky-500 has-focus:ring-2 has-focus:ring-sky-500/25"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none typography-body-base text-foreground placeholder:text-muted-foreground"
        />
        {unit && !isEmpty && (
          <span className="typography-action-base-bold shrink-0 text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {error && errorMessage && (
        <FieldDescription error>{errorMessage}</FieldDescription>
      )}
    </div>
  );
};

export default BudgetInputField;
export type { BudgetInputFieldProps };
