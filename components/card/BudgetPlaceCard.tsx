import PlaceTypeIcon, { type PlaceType } from "@/components/card/PlaceTypeIcon";

interface BudgetPlaceCardProps {
  placeName: string;
  feeLabel?: string;
  amount: number;
  placeType: PlaceType;
  className?: string;
}

const BudgetPlaceCard = ({
  placeName,
  feeLabel = "입장료",
  amount,
  placeType,
  className,
}: BudgetPlaceCardProps) => {
  return (
    <article
      className={`h-23 w-full max-w-78 overflow-hidden rounded-2xl border border-border bg-background shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] ${className ?? ""}`}
    >
      <header className="flex h-12.5 items-start justify-between px-4 pt-3.5 pb-3">
        <div className="flex min-w-0 items-center gap-2 pr-1.5">
          <h3 className="typography-display-lg-bold truncate text-[#020618]">
            {placeName}
          </h3>
        </div>
        <div className="shrink-0">
          <PlaceTypeIcon type={placeType} />
        </div>
      </header>

      <div className="flex h-10.5 items-start px-4 pt-1 pb-3.5">
        <div className="flex w-full items-center justify-between pr-1">
          <span className="typography-body-sm-reg text-muted-foreground">
            {feeLabel}
          </span>
          <div className="flex h-6 w-16 items-center justify-end gap-0.5 text-foreground">
            <span className="typography-body-base h-6 whitespace-nowrap leading-6">
              {amount.toLocaleString("ko-KR")}
            </span>
            <span className="typography-body-sm-reg h-5 w-3.25 leading-5">원</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BudgetPlaceCard;
