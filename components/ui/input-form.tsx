import * as React from "react";
import { Search, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/utils";

type InputFormProps = React.ComponentProps<"input"> & {
  error?: boolean;
  hideIcon?: boolean;
  icon?: LucideIcon;
  iconClassName?: string;
  iconClick?: () => void;
};

function InputForm({
  className,
  error,
  hideIcon = false,
  icon: Icon = Search,
  iconClassName,
  iconClick,
  ...props
}: InputFormProps) {
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
        className,
      )}
    >
      <input
        className={cn(
          "w-full bg-transparent outline-none",
          "typography-body-sm-reg text-foreground",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed",
        )}
        {...props}
      />
      {!hideIcon &&
        (iconClick ? (
          <button
            type="button"
            onClick={iconClick}
            className="shrink-0"
            aria-label="아이콘 버튼"
          >
            <Icon
              className={cn("size-5 text-muted-foreground", iconClassName)}
            />
          </button>
        ) : (
          <Icon
            className={cn(
              "size-5 shrink-0 text-muted-foreground",
              iconClassName,
            )}
          />
        ))}
    </div>
  );
}

export { InputForm };
export type { InputFormProps };
