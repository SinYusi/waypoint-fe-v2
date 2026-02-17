"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: null,
        info: null,
        warning: null,
        error: null,
        loading: null,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--success-bg": "var(--success)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-xl)",
        } as React.CSSProperties
      }
      toastOptions={{
        className: [
          "!px-5 !py-3 lg:!py-4.5 !bg-popover",

          // title & description (typo)
          "[&_[data-title]]:!typography-body-sm-bold",
          "[&_[data-description]]:!typography-body-sm-reg [&_[data-description]]:!text-muted-foreground",

          // border (색상)
          "[&[data-type=success]]:!border-success",
          "[&[data-type=error]]:!border-destructive",

          // title (색상)
          "[&[data-type=success]_[data-title]]:!text-success",
          "[&[data-type=error]_[data-title]]:!text-destructive",

          // 버튼
          "[&_[data-button]]:!bg-transparent",
          "[&_[data-button]]:!p-0",
          "[&_[data-button]]:!text-foreground",
        ].join(" "),
      }}
      {...props}
    />
  );
};

export { Toaster };
