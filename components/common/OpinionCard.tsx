import { Angry, Laugh, Smile } from "lucide-react";

import { Chip, Chips } from "@/components/ui/chip";
import {
  OPINION_STATE_LABEL,
  getTagText,
  type BlockOpinion,
  type OpinionCategoryKey,
  type OpinionState,
} from "@/lib/opinion-bottom-sheet";
import { cn } from "@/lib/utils/utils";

/* --------------------------------------------------------
   의견 유형 표시 (Tab_text Active)
-------------------------------------------------------- */
const TYPE_ICON: Record<OpinionState, React.ReactNode> = {
  POSITIVE: <Laugh />,
  NEUTRAL: <Smile />,
  NEGATIVE: <Angry />,
};

const TYPE_COLOR: Record<OpinionState, string> = {
  POSITIVE: "text-foreground",
  NEUTRAL: "text-foreground",
  NEGATIVE: "text-foreground",
};

const TYPE_ICON_COLOR: Record<OpinionState, string> = {
  POSITIVE: "text-foreground",
  NEUTRAL: "text-foreground",
  NEGATIVE: "text-hover-destructive",
};

function OpinionTypeLabel({ type }: { type: OpinionState }) {
  return (
    <div
      className="flex h-6 items-center gap-1 typography-body-sm-bold"
    >
      <span className={cn("inline-flex size-6 shrink-0 [&_svg]:size-6", TYPE_ICON_COLOR[type])}>
        {TYPE_ICON[type]}
      </span>
      <span className={TYPE_COLOR[type]}>{OPINION_STATE_LABEL[type]}</span>
    </div>
  );
}

/* --------------------------------------------------------
   OpinionCard
-------------------------------------------------------- */
type OpinionCardProps = {
  opinion: BlockOpinion;
  categoryKey: OpinionCategoryKey;
  className?: string;
  showDividerBetweenTagsAndComment?: boolean;
};

function OpinionCard({
  opinion,
  categoryKey,
  className,
  showDividerBetweenTagsAndComment = false,
}: OpinionCardProps) {
  const hasTags = opinion.tag_ids.length > 0;
  const hasComment = Boolean(opinion.comment);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1 rounded-xl bg-card p-3",
        className,
      )}
    >
      {/* Inner frame */}
      <div className="flex flex-col gap-3">
        {/* 의견 유형 헤더 */}
        <div className="flex h-6 items-center gap-3">
          <OpinionTypeLabel type={opinion.type} />
        </div>

        {/* 구분선 */}
        <div className="h-px bg-border" />

        {/* 칩 + 코멘트 영역 */}
        <div className="flex flex-col gap-2">
          {/* 태그 칩 */}
          {hasTags && (
            <Chips className="max-w-full gap-2.5 pb-0">
              {opinion.tag_ids.map((id) => (
                <Chip
                  key={id}
                  variant="primary"
                  className="h-8 w-fit cursor-default gap-2.5 rounded-xl border-border bg-white px-3 py-1.5 typography-body-sm-reg hover:border-border hover:bg-white"
                >
                  {getTagText(categoryKey, opinion.type, id)}
                </Chip>
              ))}
            </Chips>
          )}

          {/* 태그와 직접 입력 코멘트 사이 구분선 */}
          {showDividerBetweenTagsAndComment && hasTags && hasComment && (
            <div className="h-px bg-border" />
          )}

          {/* 직접 입력 코멘트 */}
          {hasComment && (
            <div className="flex w-full flex-col gap-2 rounded-xl bg-white px-3 py-2">
              <p className="text-sm font-normal leading-5 text-foreground">&ldquo;{opinion.comment}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OpinionCard;
export type { OpinionCardProps };
