import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberActionMenuProps {
  memberId: string;
  onKick: (memberId: string) => void;
  onAssignOwner: (memberId: string) => void;
}

const MemberActionMenu = ({
  memberId,
  onKick,
  onAssignOwner,
}: MemberActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Ellipsis size={18} className="text-[#757575]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onKick(memberId)}>
          내보내기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAssignOwner(memberId)}>
          보관함 소유자로 지정
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberActionMenu;
