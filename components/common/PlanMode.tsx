import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

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
					<Image
						src="/icons/plan-mode.svg"
						alt=""
						width={16}
						height={16}
						aria-hidden
						className="opacity-40"
					/>
				}
				className={cn(
					"h-8 w-full rounded-full border-border px-2.5 py-0.5 typography-nav-xl-bold text-foreground hover:text-foreground",
					isVariant2
						? "bg-transparent hover:bg-transparent"
						: "bg-background hover:bg-background",
				)}
			>{text}</Button>
		</div>
	);
}
