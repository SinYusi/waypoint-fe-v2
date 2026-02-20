import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import PlanModeIcon from "@/public/icons/plan-mode.svg";

type PlanModeProps = {
	variant?: "default" | "variant2";
	text: string;
	className?: string;
};

export default function PlanMode({
	variant = "default",
	text,
	className,
}: PlanModeProps) {
	const isVariant2 = variant === "variant2";

	return (
		<div className={cn("h-8 w-21.5", className)}>
			<Button
				type="button"
				variant="outline"
				size="S"
				icon={
					<PlanModeIcon aria-hidden className="size-4 opacity-40" />
				}
				className={cn(
					"h-8 w-full rounded-full px-2.5 py-0.5 typography-nav-xl-bold text-foreground hover:text-foreground",
					isVariant2
						? "border-transparent bg-transparent hover:bg-transparent"
						: "border-border bg-background hover:bg-background",
				)}
			>{text}</Button>
		</div>
	);
}
