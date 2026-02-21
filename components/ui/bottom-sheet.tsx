"use client";

import * as React from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils/utils";

type Description = React.ReactNode | React.ReactNode[];

export type BottomSheetItem = {
  id: string;
  label: React.ReactNode;
  description?: Description;
  icon?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  onSelect?: () => void;
};

type BottomSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: BottomSheetItem[]
  header?: React.ReactNode
  title?: React.ReactNode
  showTitle?: boolean
  itemVariant?: "default" | "member" | "opinion"
  closeOnSelect?: boolean
  cancelLabel?: React.ReactNode
  showCloseIcon?: boolean
  onCancel?: () => void
  className?: string
}

function normalizeDescription(description?: Description) {
  if (!description) return [];
  return Array.isArray(description) ? description : [description];
}

function BottomSheet({
  open,
  onOpenChange,
  items,
  header,
  title = "작업 메뉴",
  showTitle = false,
  itemVariant = "default",
  closeOnSelect = true,
  cancelLabel = "취소",
  showCloseIcon = false,
  onCancel,
  className,
}: BottomSheetProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleSelect = (onSelect?: () => void) => {
    onSelect?.();
    if (closeOnSelect) {
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        showHandle={false}
        className={cn(
          "mx-auto w-full rounded-t-3xl border-none bg-background p-0",
          "shadow-[0_-2px_10px_0_#0000001A]",
          className,
        )}
      >
        <DrawerTitle className="sr-only">{title}</DrawerTitle>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-2">
          {header}
          {showTitle && (
            <h2 className="mb-2 h-7 w-fit whitespace-nowrap typography-title-lg-sb text-black">
              {title}
            </h2>
          )}
          <div
            className={cn(
              "flex flex-col gap-2.5 pb-3.5",
              itemVariant === "opinion" && "w-81.75 gap-3.5 pb-0",
            )}
          >
            {items.map((item) => {
              const descriptionLines = normalizeDescription(item.description);
              const hasDescription = descriptionLines.length > 0;

              return (
                <Button
                  key={item.id}
                  type="button"
                  variant="ghost"
                  size="L"
                  disabled={item.disabled}
                  onClick={() => handleSelect(item.onSelect)}
                  icon={
                    item.icon ? (
                      <span className="text-foreground/40 [&_svg]:size-6">
                        {item.icon}
                      </span>
                    ) : undefined
                  }
                  className={cn(
                    "w-full justify-start gap-2 text-foreground",
                    itemVariant === "member"
                      ? "h-11 rounded-sm px-2 typography-label-base-reg hover:bg-accent"
                      : itemVariant === "opinion"
                        ? "h-11 rounded-2xl border-border bg-transparent px-4 typography-action-sm-reg hover:bg-secondary-hover hover:border-transparent"
                        : "rounded-full px-1 pr-8 hover:bg-accent",
                    itemVariant === "default" &&
                      (hasDescription
                        ? "h-auto min-h-11 py-2 typography-label-base-reg"
                        : "h-11 typography-label-base-sb"),
                    itemVariant === "opinion" && item.selected && "bg-accent border-accent",
                    item.className,
                  )}
                >
                  <span className={cn("min-w-0 text-left", itemVariant === "member" && "w-fit")}>
                    <span
                      className={cn(
                        "block",
                        itemVariant === "member"
                          ? "w-fit typography-label-base-reg text-[#09090B]"
                          : "truncate"
                      )}
                    >
                      {item.label}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="mx-5 h-px bg-border" />

        <div className="h-22.75 bg-background px-5 pt-4">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              size="L"
              onClick={handleCancel}
              className="h-11 w-full rounded-2xl border-border typography-label-base-sb text-foreground hover:bg-transparent"
            >
              {showCloseIcon && (
                <span className="inline-flex size-6 items-center justify-center">
                  <X className="size-6 text-[#1C2024]" strokeWidth={2} />
                </span>
              )}
              <span className="typography-label-base-sb text-[#1C2024]">
                {cancelLabel}
              </span>
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { BottomSheet };
export type { BottomSheetProps };
