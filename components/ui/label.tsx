import * as React from "react";
import { Pencil } from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";

type LabelProps = React.ComponentProps<"label"> & {
  required?: boolean;
  onEdit?: () => void;
};

function Label({
  className,
  required,
  onEdit,
  children,
  ...props
}: LabelProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <label
        data-slot="label"
        className="inline-flex items-center gap-2 typography-label-base-bold text-foreground"
        {...props}
      >
        {children}
        {required && <span className="text-sky-500">*</span>}
      </label>

      {onEdit && (
        <Button type="button" variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="size-[18px]" />
        </Button>
      )}
    </div>
  );
}

export { Label };
export type { LabelProps };
