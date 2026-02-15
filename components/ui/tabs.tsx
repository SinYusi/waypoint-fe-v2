"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

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
        underline: "h-auto rounded-none border-0 bg-transparent p-0",
      },
    },
    defaultVariants: {
      size: "md",
      fullWidth: false,
      style: "pill",
    },
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 typography-action-sm-reg transition-all outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
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
          "h-auto rounded-none border-b-2 border-transparent px-1 py-2 data-[state=active]:border-primary data-[state=active]:text-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      fullWidth: false,
      style: "pill",
    },
  }
)

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("w-full", className)} {...props} />
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>

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
  )
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>

function TabsTrigger({
  className,
  size,
  fullWidth,
  style,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ size, fullWidth, style }), className)}
      {...props}
    />
  )
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
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsListProps, TabsTriggerProps }
