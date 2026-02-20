"use client";

import { cn } from "@/lib/utils/utils";
import CheckBox from "./CheckBox";
import type { LucideIcon } from "lucide-react";

interface CheckBoxFieldProps {
  id: string;
  name?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
  icon?: LucideIcon;
  description: string;
  className?: string;
  iconClassName?: string;
}

const CheckBoxField = ({
  id,
  name,
  checked,
  onCheckedChange,
  label,
  icon: Icon,
  description,
  className = "",
  iconClassName = "",
}: CheckBoxFieldProps) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 bg-checkbox px-5 py-3 rounded-4xl cursor-pointer w-full transition-colors",
        className,
      )}
    >
      <CheckBox
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
      />
      <div className="flex flex-col gap-[7px] flex-1 min-w-0">
        <span className="typography-label-base-sb text-foreground truncate">
          {label}
        </span>
        <div className="typography-body-sm-reg text-muted-foreground flex items-center gap-[3px]">
          {Icon && (
            <Icon className={cn("w-4.5 h-4.5 shrink-0", iconClassName)} />
          )}
          <span className="min-w-0 flex-1 truncate">{description}</span>
        </div>
      </div>
    </label>
  );
};

export default CheckBoxField;
