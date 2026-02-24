import { cn } from "@/lib/utils/utils";
import { Laugh, Smile, Angry, type LucideProps } from "lucide-react";

type ReactionType = "good" | "normal" | "bad";

const reactionIconMap: Record<
  ReactionType,
  React.ComponentType<LucideProps>
> = {
  good: Laugh,
  normal: Smile,
  bad: Angry,
};

interface PlaceReactionItemProps {
  type: ReactionType;
  count: number;
  active?: boolean;
  variant?: "default" | "ghost";
  onClick?: () => void;
}

const PlaceReactionItem = ({
  type,
  count,
  active = false,
  variant = "default",
  onClick,
}: PlaceReactionItemProps) => {
  const Icon = reactionIconMap[type];

  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-2 py-1",
        active ? "text-foreground" : "text-secondary",
        variant === "default" ? "bg-background" : "",
      )}
      onClick={onClick}
    >
      <Icon className="size-5" />
      <span className="typography-body-sm-sb">{count}</span>
    </button>
  );
};

export default PlaceReactionItem;
export type { ReactionType };
