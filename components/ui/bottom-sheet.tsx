"use client";

import * as React from "react";
import { X } from "lucide-react";

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: BottomSheetItem[];
  /** items 대신 자유롭게 콘텐츠를 렌더링할 슬롯 */
  content?: React.ReactNode;
  header?: React.ReactNode;
  title?: React.ReactNode;
  showTitle?: boolean;
  itemVariant?: "default" | "member";
  closeOnSelect?: boolean;
  cancelLabel?: React.ReactNode;
  cancelVariant?: "default" | "outline";
  confirmLabel?: React.ReactNode;
  closeOnCancel?: boolean;
  showCloseIcon?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  closeOnConfirm?: boolean;
  confirmDisabled?: boolean;
  showDivider?: boolean;
  showBottomGradient?: boolean;
  className?: string;
};

function normalizeDescription(description?: Description) {
  if (!description) return [];
  return Array.isArray(description) ? description : [description];
}

function BottomSheet({
  open,
  onOpenChange,
  items = [],
  content,
  header,
  title = "작업 메뉴",
  showTitle = false,
  itemVariant = "default",
  closeOnSelect = true,
  cancelLabel = "취소",
  cancelVariant = "outline",
  confirmLabel,
  closeOnCancel = true,
  showCloseIcon = false,
  onCancel,
  onConfirm,
  closeOnConfirm = true,
  confirmDisabled = false,
  showDivider = true,
  showBottomGradient = false,
  className,
}: BottomSheetProps) {
  const handleCancel = () => {
    onCancel?.();
    if (closeOnCancel) {
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    if (closeOnConfirm) {
      onOpenChange(false);
    }
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
          "mx-auto w-full data-[vaul-drawer-direction=bottom]:rounded-t-3xl border-none bg-background p-0",
          "shadow-[0_-2px_10px_0_#0000001A]",
          className,
        )}
      >
        <DrawerTitle className="sr-only">{title}</DrawerTitle>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-2">
            {header}
            {showTitle && (
              <h2 className="mb-2 h-7 w-fit whitespace-nowrap typography-title-lg-sb text-black">
                {title}
              </h2>
            )}
            {content ?? (
              <div className="flex flex-col gap-2.5 pb-3.5">
                {items.map((item) => {
                  const descriptionLines = normalizeDescription(
                    item.description,
                  );
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
                          : "rounded-full px-1 pr-8 hover:bg-accent",
                        itemVariant === "default" &&
                          (hasDescription
                            ? "h-auto min-h-11 py-2 typography-label-base-reg"
                            : "h-11 typography-label-base-sb"),
                        item.className,
                      )}
                    >
                      <span
                        className={cn(
                          "min-w-0 text-left",
                          itemVariant === "member" && "w-fit",
                        )}
                      >
                        <span
                          className={cn(
                            "block",
                            itemVariant === "member"
                              ? "w-fit typography-label-base-reg text-[#09090B]"
                              : "truncate",
                          )}
                        >
                          {item.label}
                        </span>
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {showDivider && <div className="mx-5 h-px bg-border" />}

          {showBottomGradient && (
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-35"
              style={{
                background:
                  "linear-gradient(180deg, rgba(252, 252, 252, 0) 0%, #FCFCFC 60%)",
              }}
            />
          )}

          <div className="relative z-10 h-22.75 px-5 pt-4">
            <div className={cn("flex", confirmLabel ? "gap-2" : "")}>
              {closeOnCancel ? (
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant={cancelVariant}
                    size="L"
                    onClick={handleCancel}
                    className={cn(
                      "rounded-2xl",
                      cancelVariant === "outline" &&
                        "border-border typography-label-base-sb text-foreground hover:bg-transparent",
                      cancelVariant === "default" && "typography-label-base-sb",
                      confirmLabel ? "flex-1" : "w-full",
                    )}
                  >
                    {showCloseIcon && (
                      <span className="inline-flex size-6 items-center justify-center">
                        <X className="size-6 text-[#1C2024]" strokeWidth={2} />
                      </span>
                    )}
                    <span
                      className={cn(
                        "typography-label-base-sb",
                        cancelVariant === "outline"
                          ? "text-[#1C2024]"
                          : "text-white",
                      )}
                    >
                      {cancelLabel}
                    </span>
                  </Button>
                </DrawerClose>
              ) : (
                <Button
                  type="button"
                  variant={cancelVariant}
                  size="L"
                  onClick={handleCancel}
                  className={cn(
                    "rounded-2xl",
                    cancelVariant === "outline" &&
                      "border-border typography-label-base-sb text-foreground hover:bg-transparent",
                    cancelVariant === "default" && "typography-label-base-sb",
                    confirmLabel ? "flex-1" : "w-full",
                  )}
                >
                  {showCloseIcon && (
                    <span className="inline-flex size-6 items-center justify-center">
                      <X className="size-6 text-[#1C2024]" strokeWidth={2} />
                    </span>
                  )}
                  <span
                    className={cn(
                      "typography-label-base-sb",
                      cancelVariant === "outline"
                        ? "text-[#1C2024]"
                        : "text-white",
                    )}
                  >
                    {cancelLabel}
                  </span>
                </Button>
              )}

              {confirmLabel && (
                <Button
                  type="button"
                  variant="default"
                  size="L"
                  disabled={confirmDisabled}
                  onClick={handleConfirm}
                  className="h-11 flex-1 rounded-2xl"
                >
                  {confirmLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { BottomSheet };
export type { BottomSheetProps };
