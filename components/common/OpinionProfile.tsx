import { Trash2 } from "lucide-react";

import EditIcon from "@/public/icons/edit.svg";
import ProfileImage from "@/components/common/ProfileImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

type OpinionProfileProps = {
  nickname: string;
  picture: string;
  /** 내가 작성한 의견이면 true → 수정/삭제 버튼 표시 */
  isOwn?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

function OpinionProfile({
  nickname,
  picture,
  isOwn = false,
  onEdit,
  onDelete,
  className,
}: OpinionProfileProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between px-2 py-1",
        className,
      )}
    >
      {/* 프로필 영역 */}
      <div className="flex items-center gap-2">
        <ProfileImage size="sm" src={picture} alt={nickname} className="size-9" />
        <span className="typography-body-base text-foreground">{nickname}</span>
      </div>

      {/* 수정/삭제 버튼 — 내 의견일 때만 표시 */}
      {isOwn && (
        <div className="flex items-center">
          <Button
            type="button"
            variant="link"
            onClick={onDelete}
            className="flex size-10 items-center justify-center rounded-2xl px-2 py-2.5 no-underline hover:no-underline"
          >
            <Trash2 className="size-6 text-foreground opacity-40" strokeWidth={2} />
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={onEdit}
            className="flex size-10 items-center justify-center rounded-2xl px-2 py-2.5 no-underline hover:no-underline"
          >
            <EditIcon className="size-6" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default OpinionProfile;
export type { OpinionProfileProps };
