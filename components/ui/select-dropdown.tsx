"use client";

import * as React from "react";

import { cn } from "@/lib/utils/utils";
import { DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";

type Description = React.ReactNode | React.ReactNode[];

export type SelectDropdownItem = {
  id: string;
  label: React.ReactNode;
  description?: Description;
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
};

type SelectDropdownProps = React.ComponentProps<"div"> & {
  items: SelectDropdownItem[];
};

function normalizeDescription(description?: Description) {
  if (!description) return [];
  return Array.isArray(description) ? description : [description];
}

function SelectDropdown({ className, items, ...props }: SelectDropdownProps) {
  return (
    <DropdownMenuContent
      align="end"
      className={cn(
        "w-[148px] rounded-xl border border-border bg-background p-1",
        "shadow-[0px_2px_4px_-1px_#0000000F,0px_4px_6px_-1px_#0000001A]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-0">
        {items.map((item) => {
          const descriptionLines = normalizeDescription(item.description);
          const hasDescription = descriptionLines.length > 0;

          return (
            <DropdownMenuItem
              key={item.id}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={cn(
                "flex w-full items-center gap-1.5 rounded-lg bg-background px-2.5 py-1.5 text-left",
                "hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
                hasDescription ? "min-h-8" : "h-8",
              )}
            >
              {item.icon && (
                <span className="shrink-0 text-foreground [&_svg]:size-4 [&_svg]:opacity-100">
                  {item.icon}
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="block truncate typography-select-sm-reg text-foreground">
                  {item.label}
                </span>
              </span>
            </DropdownMenuItem>
          );
        })}
      </div>
    </DropdownMenuContent>
  );
}

export { SelectDropdown };
export type { SelectDropdownProps };
