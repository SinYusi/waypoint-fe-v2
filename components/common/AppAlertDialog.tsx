"use client";

import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppAlertDialogProps {
  /** 다이얼로그를 여는 트리거 요소 */
  trigger: React.ReactNode;
  /** 제목 */
  title: string;
  /** 부제목 (선택) */
  description?: string;
  /** 제목/부제목 아래 자유롭게 삽입할 콘텐츠 (선택) */
  children?: React.ReactNode;
  /** 취소 버튼 텍스트 */
  cancelLabel?: string;
  /** 취소 버튼 클릭 핸들러 */
  onCancel?: () => void;
  /** 확인 버튼 텍스트 */
  actionLabel: string;
  /** 확인 버튼 클릭 핸들러 */
  onAction?: () => void;
}

const AppAlertDialog = ({
  trigger,
  title,
  description,
  children,
  cancelLabel = "취소",
  onCancel,
  actionLabel,
  onAction,
}: AppAlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="px-0 pb-0 gap-0">
        {/* 헤더 */}
        <AlertDialogHeader className="px-6 pt-2 pb-4 place-items-start text-left">
          <AlertDialogTitle className="typography-display-lg-bold">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="typography-action-sm-reg text-[#71717a] whitespace-pre-line">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {/* 본문 */}
        {children && <div className="px-6 pb-6">{children}</div>}

        {/* 하단 버튼 */}
        <div className="flex flex-row gap-2 px-5 pb-5">
          <AlertDialogPrimitive.Cancel
            onClick={onCancel}
            className={cn(
              "flex-1 h-[44px] rounded-2xl border border-[#e2e2e2] bg-background typography-action-sm-bold",
            )}
          >
            {cancelLabel}
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action
            onClick={onAction}
            className={cn(
              "flex-1 h-[44px] rounded-2xl bg-[#ef4444] hover:bg-[#ef4444]/90 text-white typography-action-sm-bold",
            )}
          >
            {actionLabel}
          </AlertDialogPrimitive.Action>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AppAlertDialog;
