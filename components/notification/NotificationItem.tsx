import { X } from "lucide-react";
import NotificationBadge from "./NotificationBadge";
import { type NotificationBadgeVariant } from "./NotificationBadge";

interface NotificationItemProps {
  message: string;
  badgeVariant?: NotificationBadgeVariant;
  onDelete?: () => void;
  onClick?: () => void;
}

const NotificationItem = ({
  message,
  badgeVariant = "default",
  onDelete,
  onClick,
}: NotificationItemProps) => {
  return (
    <div
      className="w-full py-3.5 pr-3 pl-4 rounded-2xl bg-[#F0F0F0] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* 배지 + 메시지 */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          <NotificationBadge variant={badgeVariant} />
          <p className="text-base font-normal leading-6 text-[#1C2024]">
            {message}
          </p>
        </div>

        {/* 삭제 버튼 */}
        <button
          type="button"
          className="shrink-0 flex items-center justify-center size-6 cursor-pointer hover:opacity-60 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          aria-label="알림 삭제"
        >
          <X size={24} strokeWidth={2} color="#000000" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
