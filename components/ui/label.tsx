import * as React from "react";
import { Pencil, Check } from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";

type LabelProps = React.ComponentProps<"label"> & {
  required?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  labelClassName?: string;
};

function Label({
  className,
  required,
  isEditing,
  onEdit,
  onSave,
  labelClassName,
  children,
  ...props
}: LabelProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <label
        data-slot="label"
        className={cn(
          "inline-flex items-center gap-2 typography-label-base-bold text-foreground",
          labelClassName,
        )}
        {...props}
      >
        {children}
        {required && <span className="text-sky-500">*</span>}
      </label>

      {isEditing && onSave && (
        <Button
          type="button"
          variant="ghost"
          size="S"
          onClick={onSave}
          className="cursor-pointer"
        >
          <Check className="size-4.5" />
        </Button>
      )}

      {!isEditing && onEdit && (
        <Button
          type="button"
          variant="ghost"
          size="S"
          onClick={onEdit}
          className="cursor-pointer"
        >
          <Pencil className="size-4.5" />
        </Button>
      )}
    </div>
  );
}

export { Label };
export type { LabelProps };
