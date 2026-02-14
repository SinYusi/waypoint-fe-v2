"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils/utils";

type Align = "start" | "center" | "end";

interface DropdownProps {
  /** 버튼 안에 표시될 라벨(텍스트/JSX) */
  label: React.ReactNode;
  /** DropdownMenuContent 내부 구성 (Item/Divider) */
  children: React.ReactNode;
  align?: Align;
  contentClassName?: string;
  widthClassName?: string;
}

interface DropdownItemProps {
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface DropdownDividerProps {
  className?: string;
}

const Dropdown = ({
  label,
  children,
  align = "start",
  contentClassName,
  widthClassName = "w-[148px]",
}: DropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-11 px-3 py-2 typography-body-sm-md flex items-center justify-between bg-popover rounded-[12px] border-[1px] border-border",
            widthClassName,
          )}
        >
          {label}
          <ChevronDown size={16} className="ml-2 shrink-0 text-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className={cn(
          "rounded-[12px] mt-1 [&_[data-slot='dropdown-menu-item']]:rounded-[6px]",
          widthClassName,
          contentClassName,
        )}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DropdownItem = ({
  onClick,
  isActive,
  className,
  children,
}: DropdownItemProps) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        className,
        isActive && "bg-accent text-accent-foreground typography-body-sm-sb",
      )}
    >
      {children}
    </DropdownMenuItem>
  );
};

const DropdownDivider = ({ className }: DropdownDividerProps) => {
  return <div className={cn("h-px bg-border mx-2 my-1", className)} />;
};

export default Dropdown;
export { DropdownItem, DropdownDivider };
