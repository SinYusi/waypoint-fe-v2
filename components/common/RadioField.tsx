"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface RadioFieldProps {
  id: string;
  name?: string;
  selected?: boolean;
  onSelected?: (selected: boolean) => void;
  radioButton?: boolean;
  label: string;
  icon?: LucideIcon;
  description: string;
  className?: string;
}

const RadioField = ({
  id,
  name,
  selected = false,
  onSelected,
  radioButton = false,
  label,
  icon: Icon,
  description,
  className = "",
}: RadioFieldProps) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 rounded-4xl bg-checkbox px-5 py-3 transition-colors cursor-pointer border-2",
        "has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",
        selected ? "border-primary" : "border-transparent",
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={selected}
        onChange={() => onSelected?.(true)}
        className="peer sr-only"
      />
      {radioButton && (
        <span
          aria-hidden="true"
          className={cn(
            "flex items-center justify-center rounded-full size-6 bg-neutral-300 transition shrink-0",
            selected && "border-7 border-primary bg-input",
          )}
        />
      )}
      <div className="flex flex-col gap-[7px] flex-1 min-w-0">
        <span className="typography-label-base-sb text-foreground truncate">
          {label}
        </span>
        <div className="typography-body-sm-reg text-muted-foreground flex items-center gap-[3px]">
          {Icon && <Icon className="w-4.5 h-4.5 shrink-0" />}
          <span className="min-w-0 flex-1 truncate">{description}</span>
        </div>
      </div>
    </label>
  );
};

export default RadioField;
