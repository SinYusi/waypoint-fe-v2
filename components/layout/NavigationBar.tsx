"use client";

import { cn } from "@/lib/utils/utils";
import { useRouter, usePathname } from "next/navigation";
import CollectionIcon from "@/public/icons/collection.svg";
import ProjectIcon from "@/public/icons/project.svg";
import MyIcon from "@/public/icons/my.svg";

const NAV_ITEMS = [
  { label: "보관함", path: "/home", Icon: CollectionIcon },
  { label: "플래너", path: "/projects", Icon: ProjectIcon },
  { label: "마이페이지", path: "/my", Icon: MyIcon },
];

interface NavigationBarProps {
  className?: string;
}

const NavigationBar = ({ className = "" }: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex w-full h-[72px] items-start justify-around bg-[#1c2024] rounded-t-2xl px-4",
        className,
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.path || pathname.startsWith(item.path + "/");
        const Icon = item.Icon;

        return (
          <div
            key={item.path}
            className="w-full h-[52px] flex items-end justify-center text-primary-foreground"
          >
            <button
              onClick={() => router.push(item.path)}
              className="flex flex-col gap-0.5 items-center justify-center transition-colors"
            >
              <Icon />

              <span
                className={`${isActive ? "typography-nav-xl-bold" : "typography-nav-xl-reg"}`}
              >
                {item.label}
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
};

export default NavigationBar;
