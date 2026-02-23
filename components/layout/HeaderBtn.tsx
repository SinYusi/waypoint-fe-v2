"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils/utils";

type HeaderBtnBgVariant = "solid" | "glass" | "ghost";

interface HeaderBtnProps {
  bgVariant?: HeaderBtnBgVariant;
  icon: LucideIcon;
  label: string;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

const HeaderBtn = ({
  bgVariant = "solid",
  icon: Icon,
  label,
  className,
  iconClassName,
  onClick,
}: HeaderBtnProps) => {
  return (
    <Button
      variant="ghost"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-full size-11 p-2.5 cursor-pointer",
        bgVariant === "solid" && "bg-[#FAFAFA]",
        bgVariant === "glass" && "bg-[#FAFAFA]/60 backdrop-blur-sm",
        bgVariant === "ghost" && "bg-transparent backdrop-blur-xl",
        className,
      )}
    >
      {Icon && <Icon className={cn("size-6 text-foreground", iconClassName)} />}
    </Button>
  );
};

export default HeaderBtn;
export type { HeaderBtnBgVariant };
