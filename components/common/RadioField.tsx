"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface RadioFieldProps {
  id: string;
  name?: string;
  selected?: boolean;
  onSelected?: (selected: boolean) => void;
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
  label,
  icon: Icon,
  description,
  className = "",
}: RadioFieldProps) => {
  const handleSelect = () => onSelected?.(true);

  return (
    <label
      htmlFor={id}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleSelect();
        }
      }}
      className={cn(
        "rounded-4xl bg-checkbox px-5 py-3 transition-colors cursor-pointer border-2",
        selected ? "border-primary" : "border-transparent",
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={selected}
        onChange={handleSelect}
        className="sr-only"
      />
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
