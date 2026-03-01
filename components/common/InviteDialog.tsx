"use client";

import { useEffect } from "react";
import { Copy, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import AppDialog from "@/components/common/AppDialog";
import { useCreateCollectionInvitation } from "@/lib/hooks/collection/use-create-collection-invitation";
import { useCreatePlanInvitation } from "@/lib/hooks/plan/use-create-plan-invitation";

interface InviteDialogProps {
  variant: "COLLECTION" | "PLAN";
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InviteDialog = ({ variant, id, open, onOpenChange }: InviteDialogProps) => {
  const collectionInvitation = useCreateCollectionInvitation();
  const planInvitation = useCreatePlanInvitation();

  const { mutate: generateInvitation, data: invitation, isPending, reset } =
    variant === "COLLECTION" ? collectionInvitation : planInvitation;

  useEffect(() => {
    if (open) {
      generateInvitation(id);
    } else {
      reset();
    }
  }, [open, id, variant]);

  const handleCopy = async () => {
    if (!invitation?.url) return;
    await navigator.clipboard.writeText(invitation.url);
    toast("초대 링크가 복사되었습니다", {
      icon: <Copy className="size-6" />,
    });
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="여행 멤버 초대하기"
      description="우리 여행에 함께할 멤버를 초대해요!"
      actionLabel="초대 링크 복사하기"
      onAction={handleCopy}
    >
      <div className="flex flex-col items-center gap-4">
        {isPending ? (
          <Loader2 size={40} className="animate-spin text-[#a1a1aa]" />
        ) : (
          <UserPlus className="text-foreground size-21" strokeWidth={1} />
        )}

        <p className="typography-action-sm-reg text-center text-foreground break-all">
          {isPending
            ? "링크를 생성하는 중이에요..."
            : (invitation?.url ?? "링크 생성에 실패했어요.")}
        </p>
      </div>
    </AppDialog>
  );
};

export default InviteDialog;
