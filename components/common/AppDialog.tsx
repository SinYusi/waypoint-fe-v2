"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AppDialogProps {
  /** 다이얼로그를 여는 트리거 요소 (선택 — controlled 모드에서는 생략 가능) */
  trigger?: React.ReactNode;
  /** controlled open 상태 */
  open?: boolean;
  /** open 상태 변경 핸들러 */
  onOpenChange?: (open: boolean) => void;
  /** 제목 */
  title: string;
  /** 부제목 (선택) */
  description?: string;
  /** 제목/부제목 아래 자유롭게 삽입할 콘텐츠 (선택) */
  children?: React.ReactNode;
  /** 하단 버튼 텍스트 (생략 시 버튼 미노출) */
  actionLabel?: string;
  /** 하단 버튼 클릭 핸들러 */
  onAction?: () => void;
  /** DialogContent에 추가할 className */
  contentClassName?: string;
}

const AppDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  actionLabel,
  onAction,
  contentClassName,
}: AppDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className={cn("px-0 pb-0 gap-0", contentClassName)}
      >
        {/* 우측 상단 X 버튼 */}
        <DialogClose className="absolute top-4 right-4">
          <X size={20} className="text-foreground" />
          <span className="sr-only">닫기</span>
        </DialogClose>

        {/* 헤더 */}
        <DialogHeader className="px-6 pt-2 pb-4 items-start">
          <DialogTitle className="typography-display-lg-bold">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="typography-action-sm-leg text-[#71717a] whitespace-pre-line">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* 본문 */}
        {children && <div className="px-6 pb-6">{children}</div>}

        {/* 하단 버튼 */}
        {actionLabel && (
          <div className="px-5 pb-5">
            <Button
              className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white typography-action-sm-bold"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
