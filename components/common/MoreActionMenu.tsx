"use client";

import { Ellipsis } from "lucide-react";
import HeaderBtn, { HeaderBtnBgVariant } from "../layout/HeaderBtn";
import { SelectDropdown, SelectDropdownItem } from "../ui/select-dropdown";
import { BottomSheet, BottomSheetItem } from "../ui/bottom-sheet";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useEffect, useMemo, useState } from "react";

type Description = React.ReactNode | React.ReactNode[];

export type MoreActionItem = {
  id: string;
  label: React.ReactNode;
  description?: Description;
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
};

interface MoreActionMenuProps {
  headerBtnBgVariant?: HeaderBtnBgVariant;
  headerBtnClassName?: string;
  label: string;
  items: MoreActionItem[];
  /** BottomSheet 옵션(선택) */
  sheetTitle?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onCancel?: () => void;
  mobileQuery?: string;
}

const MoreActionMenu = ({
  headerBtnBgVariant = "ghost",
  headerBtnClassName,
  label,
  items,
  sheetTitle = "작업 메뉴",
  cancelLabel = "취소",
  onCancel,
  mobileQuery,
}: MoreActionMenuProps) => {
  const isMobile = useMediaQuery(mobileQuery ?? "(max-width: 1024px)");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const dropdownItems: SelectDropdownItem[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        icon: item.icon,
        disabled: item.disabled,
        onSelect: item.onSelect,
      })),
    [items],
  );

  const bottomSheetItems: BottomSheetItem[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        icon: item.icon,
        disabled: item.disabled,
        onSelect: item.onSelect,
      })),
    [items],
  );

  if (isMobile) {
    return (
      <>
        <HeaderBtn
          icon={Ellipsis}
          bgVariant={headerBtnBgVariant}
          label={label}
          className={headerBtnClassName}
          onClick={() => setOpen(true)}
        />

        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          items={bottomSheetItems}
          title={sheetTitle}
          cancelLabel={cancelLabel}
          onCancel={onCancel}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="inline-flex" role="button" aria-label={label}>
          <HeaderBtn
            icon={Ellipsis}
            bgVariant={headerBtnBgVariant}
            label={label}
            className={headerBtnClassName}
          />
        </span>
      </DropdownMenuTrigger>
      <SelectDropdown items={dropdownItems} />
    </DropdownMenu>
  );
};

export default MoreActionMenu;
