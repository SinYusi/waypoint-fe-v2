"use client";

import * as React from "react";

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
  onSelect?: () => void;
};

type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: BottomSheetItem[];
  title?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onCancel?: () => void;
  className?: string;
};

function normalizeDescription(description?: Description) {
  if (!description) return [];
  return Array.isArray(description) ? description : [description];
}

function BottomSheet({
  open,
  onOpenChange,
  items,
  title = "작업 메뉴",
  cancelLabel = "취소",
  onCancel,
  className,
}: BottomSheetProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleSelect = (onSelect?: () => void) => {
    onSelect?.();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        showHandle={false}
        className={cn(
          "mx-auto w-full max-w-[375px] rounded-t-3xl border-none bg-background p-0",
          "shadow-[0_-2px_10px_0_#0000001A]",
          className,
        )}
      >
        <DrawerTitle className="sr-only">{title}</DrawerTitle>

        <div className="px-6 pt-6 pb-2">
          <div className="flex flex-col gap-[10px] pb-3.5">
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
                    "w-full justify-start gap-2 rounded-full px-1 pr-8 text-foreground",
                    "hover:bg-accent",
                    hasDescription
                      ? "h-auto min-h-[44px] py-2 typography-label-base-reg"
                      : "h-[44px] typography-label-base-sb",
                  )}
                >
                  <span className="min-w-0 text-left">
                    <span className="block truncate">{item.label}</span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="mx-5 h-px bg-border" />

        <div className="h-[91px] bg-background px-5 pt-4">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              size="L"
              onClick={handleCancel}
              className="h-[44px] w-full rounded-2xl border-border typography-label-base-sb text-foreground hover:bg-transparent"
            >
              {cancelLabel}
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { BottomSheet };
export type { BottomSheetProps };
