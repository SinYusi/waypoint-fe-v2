"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils/utils";

type HeaderBtnBgVariant = "solid" | "glass" | "ghost";

interface HeaderBtnProps {
  bgVariant?: HeaderBtnBgVariant;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

const HeaderBtn = ({
  bgVariant = "solid",
  icon: Icon,
  label,
  onClick,
}: HeaderBtnProps) => {
  return (
    <Button
      variant="ghost"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-full size-11 p-2.5",
        bgVariant === "solid" && "bg-[#FAFAFA]",
        bgVariant === "glass" && "bg-[#FAFAFA]/60 backdrop-blur-sm",
        bgVariant === "ghost" && "bg-transparent backdrop-blur-xl",
      )}
    >
      {Icon && <Icon className="size-6 text-foreground" />}
    </Button>
  );
};

export default HeaderBtn;
export type { HeaderBtnBgVariant };
