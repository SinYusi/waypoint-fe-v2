import { Plus } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

type PlanAddPlaceProps = Omit<
	ButtonProps,
	"variant" | "size" | "icon" | "rightIcon" | "children"
> & {
	text?: string;
	className?: string;
};

export default function PlanAddPlace({
	text = "장소 추가",
	className,
	...props
}: PlanAddPlaceProps) {
	return (
		<Button
			type="button"
			variant="default"
			size="S"
			icon={<Plus aria-hidden className="size-4 text-black/40" strokeWidth={2} />}
			className={cn(
				"h-8 w-23.5 cursor-pointer rounded-full py-2 pl-3 pr-4 typography-nav-xl-bold text-white hover:bg-primary",
				className,
			)}
			{...props}
		>
			{text}
		</Button>
	);
}
