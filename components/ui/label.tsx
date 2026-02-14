import * as React from "react"
import { Pencil, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type LabelProps = React.ComponentProps<"label"> & {
  required?: boolean
  isEditing?: boolean
  onEdit?: () => void
  onSave?: () => void
}

function Label({
  className,
  required,
  isEditing,
  onEdit,
  onSave,
  children,
  ...props
}: LabelProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        className
      )}
    >
      <label
        data-slot="label"
        className="inline-flex items-center gap-2 typography-label-base-bold text-foreground"
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
        >
          <Pencil className="size-4.5" />
        </Button>
      )}
    </div>
  )
}

export { Label }
export type { LabelProps }
