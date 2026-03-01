interface CandidatePinProps {
  index: number;
}

const CandidatePin = ({ index }: CandidatePinProps) => {
  return (
    <div className="inline-flex flex-col items-center">
      {/* 본체 - 검은 원 + 흰 테두리 */}
      <div className="size-8 rounded-full bg-black border-3 border-white flex items-center justify-center shadow-lg">
        <span className="typography-body-sm-bold text-white leading-none">
          {index}
        </span>
      </div>

      {/* 꼬리 - 흰색 삼각형 */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "7px solid white",
          marginTop: "-1px",
        }}
      />
    </div>
  );
};

export default CandidatePin;
