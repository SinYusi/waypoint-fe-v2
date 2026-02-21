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
  onClick?: () => void;
}

const PlaceReactionItem = ({
  type,
  count,
  active = false,
  onClick,
}: PlaceReactionItemProps) => {
  const Icon = reactionIconMap[type];
  const color = active ? "#1c2024" : "#a3a3a3";

  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-[8px] bg-white px-2 py-1"
      onClick={onClick}
    >
      <Icon className="size-4" style={{ color }} />
      <span className="typography-body-sm-bold" style={{ color }}>
        {count}
      </span>
    </button>
  );
};

export default PlaceReactionItem;
export type { ReactionType };
