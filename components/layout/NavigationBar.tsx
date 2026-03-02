"use client";

import { cn } from "@/lib/utils/utils";
import { useRouter, usePathname } from "next/navigation";
import CollectionIcon from "@/public/icons/collection.svg";
import ProjectIcon from "@/public/icons/project.svg";
import MyIcon from "@/public/icons/my.svg";
import PlanMode from "@/components/common/PlanMode";
import PlanAddPlace from "@/components/common/PlanAddPlace";

const NAV_ITEMS = [
  { label: "보관함", path: "/home", Icon: CollectionIcon },
  { label: "여행계획", path: "/projects", Icon: ProjectIcon },
  { label: "마이페이지", path: "/my", Icon: MyIcon },
];

type NavigationBarVariant = "default" | "variant2" | "variant3";

interface NavigationBarProps {
  className?: string;
  variant?: NavigationBarVariant;
  activeMode?: "planMode" | "budget";
  onPlanModeClick?: () => void;
  onBudgetClick?: () => void;
  onAddPlaceClick?: () => void;
}

const NavigationBar = ({
  className = "",
  variant = "default",
  activeMode = "planMode",
  onPlanModeClick,
  onBudgetClick,
  onAddPlaceClick,
}: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  /* ── variant3 ── */
  if (variant === "variant3") {
    return (
      <div
        className={cn("relative w-full h-18", className)}
        style={{
          background:
            "linear-gradient(180deg, rgba(252, 252, 252, 0) 0%, #FCFCFC 78%)",
        }}
      >
        {/* Bottom_nav floating pill */}
        <div
          className="absolute inset-x-5 inset-y-2.5 flex items-center rounded-full px-1.5"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.08)",
          }}
        >
          {/* Overlay pill: PlanMode default + PlanMode variant2 (full width, equal halves) */}
          <div
            className="flex flex-1 items-center gap-2 rounded-full p-1 h-10"
            style={{ background: "rgba(214, 214, 214, 0.4)" }}
          >
            <PlanMode
              text="여행 일정"
              variant={activeMode === "planMode" ? "default" : "variant2"}
              className="flex-1"
              onClick={onPlanModeClick}
            />
            <PlanMode
              text="예산"
              variant={activeMode === "budget" ? "default" : "variant2"}
              className="flex-1"
              onClick={onBudgetClick}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ── variant2 ── */
  if (variant === "variant2") {
    return (
      <div
        className={cn("relative w-full h-18", className)}
        style={{
          background:
            "linear-gradient(180deg, rgba(252, 252, 252, 0) 0%, #FCFCFC 78%)",
        }}
      >
        {/* Bottom_nav floating pill */}
        <div
          className="absolute inset-x-5 inset-y-2.5 flex items-center rounded-full px-1.5"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.08)",
          }}
        >
          {/* Overlay pill: PlanMode default + PlanMode variant2 */}
          <div
            className="flex flex-1 items-center gap-2 rounded-full p-1 h-10"
            style={{ background: "rgba(214, 214, 214, 0.4)" }}
          >
            <PlanMode
              text="여행 일정"
              variant={activeMode === "planMode" ? "default" : "variant2"}
              className="flex-122 min-w-0"
              onClick={onPlanModeClick}
            />
            <PlanMode
              text="예산"
              variant={activeMode === "budget" ? "default" : "variant2"}
              className="flex-66 min-w-0"
              onClick={onBudgetClick}
            />
          </div>

          {/* Vertical divider */}
          <div className="mx-2 w-px h-10 shrink-0 bg-[#E2E2E2]/50" />

          {/* PlanAddPlace */}
          <PlanAddPlace
            text="장소 추가"
            className="h-10"
            onClick={onAddPlaceClick}
          />
        </div>
      </div>
    );
  }

  return (
    <nav
      className={cn(
        "flex w-full h-18 items-start justify-around rounded-t-2xl px-4 bg-[#1c2024]",
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
            className="w-full h-13 flex items-end justify-center text-primary-foreground"
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
