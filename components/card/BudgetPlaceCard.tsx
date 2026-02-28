import PlaceTypeIcon, { type PlaceType } from "@/components/card/PlaceTypeIcon";

export interface ExpenseItem {
  name: string;
  cost: number;
}

interface BudgetPlaceCardProps {
  placeName?: string;
  items: ExpenseItem[];
  placeType?: PlaceType;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const BudgetPlaceCard = ({
  placeName,
  items,
  placeType,
  selected = false,
  onClick,
  className,
}: BudgetPlaceCardProps) => {
  return (
    <article
      onClick={onClick}
      className={`w-full overflow-hidden rounded-2xl border bg-background shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] ${selected ? "border-[#0EA5E9]" : "border-border"} ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
    >
      {placeName && placeType && (
        <header className="flex items-start justify-between px-4 pt-3.5 pb-3">
          <div className="flex min-w-0 items-center gap-2 pr-1.5">
            <h3 className="typography-display-lg-bold truncate text-[#020618]">
              {placeName}
            </h3>
          </div>
          <div className="shrink-0">
            <PlaceTypeIcon type={placeType} />
          </div>
        </header>
      )}

      <div className={`flex flex-col gap-1 px-4 pb-3.5 ${placeName ? "pt-1" : "pt-3.5"}`}>
        {items.length === 0 ? (
          <div className="flex h-6 w-full items-center justify-end gap-2 pr-1">
            <span className="typography-body-base text-[#757575]">지출없음</span>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex w-full items-center justify-between pr-1">
              <span className="typography-body-sm-reg text-muted-foreground">
                {item.name}
              </span>
              <div className="flex h-6 items-center justify-end gap-0.5 text-foreground">
                <span className="typography-body-base h-6 whitespace-nowrap leading-6">
                  {item.cost.toLocaleString("ko-KR")}
                </span>
                <span className="typography-body-sm-reg h-6 leading-6">원</span>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

export default BudgetPlaceCard;
