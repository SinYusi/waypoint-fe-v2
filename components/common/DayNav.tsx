"use client";

import { cn } from "@/lib/utils/utils";
import * as React from "react";

type DayNavItem = {
  /** 고유 값 (ex: "1", "day-1", 1 등) */
  value: string;
  /** 버튼에 표시할 라벨 (ex: "Day 1") */
  label: React.ReactNode;
  /** 비활성화 여부(옵션) */
  disabled?: boolean;
};

interface DayNavProps {
  /** 버튼 목록 */
  items: DayNavItem[];
  /** 선택값 (controlled) */
  value?: string;
  /** 초기 선택값 (uncontrolled) */
  defaultValue?: string;
  /** 선택 변경 콜백 */
  onValueChange?: (nextValue: string) => void;

  className?: string;
  /** 버튼 className (공통) */
  itemClassName?: string;
  /** 선택된 버튼 className */
  activeItemClassName?: string;
  /** 비선택 버튼 className */
  inactiveItemClassName?: string;

  ariaLabel?: string;
}

const DayNav = ({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  itemClassName,
  activeItemClassName,
  inactiveItemClassName,
  ariaLabel = "Day navigation",
}: DayNavProps) => {
  const isControlled = value !== undefined;
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const [internalValue, setInternalValue] = React.useState<string>(() => {
    // defaultValue 우선, 없으면 첫 번째 item
    return defaultValue ?? items[0]?.value ?? "";
  });

  const selectedValue = isControlled ? value! : internalValue;

  // 선택 시 해당 버튼이 보이도록 자동 스크롤
  React.useEffect(() => {
    const el = buttonRefs.current[selectedValue];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedValue]);

  const handleSelect = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "flex h-10 items-center gap-2 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.value === selectedValue;

        return (
          <button
            key={item.value}
            type="button"
            ref={(el) => {
              buttonRefs.current[item.value] = el;
            }}
            disabled={item.disabled}
            onClick={() => handleSelect(item.value)}
            className={cn(
              "h-10 shrink-0 rounded-xl px-3",
              isActive
                ? "bg-foreground text-primary-foreground typography-body-sm-bold"
                : "bg-transparent border border-border typography-body-sm-reg",
              itemClassName,
              isActive ? activeItemClassName : inactiveItemClassName,
            )}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};

export default DayNav;
