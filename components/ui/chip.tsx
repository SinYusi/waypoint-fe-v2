import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/utils";

const chipVariants = cva(
  "inline-flex h-8 cursor-pointer items-center justify-center rounded-xl px-3 py-1.5 typography-body-sm-reg transition-colors",
  {
    variants: {
      variant: {
        primary:
          "border border-border bg-transparent text-foreground hover:border-transparent hover:bg-secondary-hover",
        active: "bg-foreground typography-body-sm-bold text-white",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type ChipProps = React.ComponentProps<"button"> &
  VariantProps<typeof chipVariants>;

function Chip({ className, variant = "primary", ...props }: ChipProps) {
  return (
    <button
      type="button"
      data-slot="chip"
      data-variant={variant}
      className={cn(chipVariants({ variant }), className)}
      {...props}
    />
  );
}

function Chips({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chips"
      className={cn("flex w-full max-w-83.75 flex-wrap gap-x-4.5 gap-y-3.25", className)}
      {...props}
    />
  );
}

export { Chip, Chips, chipVariants };
export type { ChipProps };