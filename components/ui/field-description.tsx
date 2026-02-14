import * as React from "react";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils/utils";

type FieldDescriptionProps = {
  className?: string;
  children: React.ReactNode;
  error?: boolean;
};

function FieldDescription({
  className,
  children,
  error,
}: FieldDescriptionProps) {
  if (error) {
    return (
      <p
        data-slot="field-error"
        className={cn(
          "inline-flex items-center gap-1 typography-body-sm-sb text-destructive",
          className,
        )}
      >
        <CircleAlert className="size-4 shrink-0" />
        {children}
      </p>
    );
  }

  return (
    <p
      data-slot="field-description"
      className={cn("typography-body-sm-md text-muted-foreground", className)}
    >
      {children}
    </p>
  );
}

export { FieldDescription };
export type { FieldDescriptionProps };
