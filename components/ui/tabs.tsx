"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils/utils";

const tabsListVariants = cva(
  "inline-flex items-center rounded-2xl border border-border bg-muted p-1 text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-9 gap-1",
        md: "h-10 gap-1",
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
      style: {
        pill: "",
        underline: "h-auto gap-0 rounded-none border-0 bg-transparent p-0",
      },
    },
    defaultVariants: {
      size: "md",
      fullWidth: false,
      style: "pill",
    },
  },
);

const tabsTriggerVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 typography-action-sm-reg outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-7 text-xs",
        md: "h-8",
      },
      fullWidth: {
        true: "flex-1",
        false: "",
      },
      style: {
        pill: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        underline:
          "h-11 w-36 rounded-none border-b-2 border-b-[#01012E22] px-3 py-1.5 text-base leading-6 font-medium text-[#737373] transition-colors duration-200 ease-out hover:text-[#404040] data-[state=active]:border-b-[#0EA5E9] data-[state=active]:font-bold data-[state=active]:text-[#1C2024] data-[state=active]:hover:text-[#1C2024]",
      },
    },
    defaultVariants: {
      size: "md",
      fullWidth: false,
      style: "pill",
    },
  },
);

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>;

function TabsList({
  className,
  size,
  fullWidth,
  style,
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ size, fullWidth, style }), className)}
      {...props}
    />
  );
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants> & {
    /** 텍스트 왼쪽에 표시할 아이콘. size-6 opacity-40 자동 적용 */
    icon?: React.ReactNode;
  };

function TabsTrigger({
  className,
  size,
  fullWidth,
  style,
  icon,
  children,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ size, fullWidth, style }), className)}
      {...props}
    >
      {icon ? (
        <span className="inline-flex items-center gap-1">
          <span className="size-6 shrink-0 opacity-40 [&_svg]:size-6">{icon}</span>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-3 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsListProps, TabsTriggerProps };
