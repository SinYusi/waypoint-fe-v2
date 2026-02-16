"use client";

import { cn } from "@/lib/utils/utils";

interface RadioProps {
  id: string;
  name?: string;
  selected?: boolean;
  onSelected?: (selected: boolean) => void;
  className?: string;
}

const Radio = ({
  id,
  name,
  selected = false,
  onSelected,
  className = "",
}: RadioProps) => {
  return (
    <label htmlFor={id} className={cn("cursor-pointer size-6", className)}>
      <input
        id={id}
        name={name}
        type="radio"
        checked={selected}
        onChange={() => onSelected?.(true)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex items-center justify-center rounded-full size-6 bg-neutral-300 transition",
          "peer-checked:border-7 peer-checked:border-primary peer-checked:bg-input",
          "peer-focus-visible:border-primary peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px]",
        )}
      ></span>
    </label>
  );
};

export default Radio;
