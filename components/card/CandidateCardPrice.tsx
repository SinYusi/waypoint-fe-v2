interface CandidateCardPriceProps {
  amount?: number;
}

const CandidateCardPrice = ({ amount }: CandidateCardPriceProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="typography-body-sm-reg text-muted-foreground">가격</span>
      {amount != null ? (
        <div className="flex items-baseline gap-0.5 text-foreground">
          <span className="typography-action-sm-reg whitespace-nowrap">
            {amount.toLocaleString("ko-KR")}
          </span>
          <span className="typography-action-sm-reg">원</span>
        </div>
      ) : (
        <span className="typography-action-sm-reg text-disabled">미정</span>
      )}
    </div>
  );
};

export default CandidateCardPrice;
