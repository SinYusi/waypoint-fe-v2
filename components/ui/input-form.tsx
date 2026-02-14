import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

type InputFormProps = React.ComponentProps<"input"> & {
  error?: boolean
}

function InputForm({ className, error, ...props }: InputFormProps) {
  return (
    <div
      data-slot="input-form"
      data-error={error || undefined}
      aria-invalid={error || undefined}
      className={cn(
        "flex items-center gap-2 h-11 w-full rounded-xl bg-muted px-3 py-2",
        "outline-none border border-transparent",
        "transition-all",
        "has-focus:border-sky-500 has-focus:ring-2 has-focus:ring-sky-500/25",
        "has-disabled:cursor-not-allowed has-disabled:bg-border has-disabled:opacity-100",
        "aria-invalid:border-destructive aria-invalid:ring-0",
        className
      )}
    >
      <input
        className={cn(
          "w-full bg-transparent outline-none",
          "typography-body-sm-reg text-foreground",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed"
        )}
        {...props}
      />
      <Search className="size-5 shrink-0 text-muted-foreground" />
    </div>
  )
}

export { InputForm }
export type { InputFormProps }
