import Image from "next/image";

const BudgetEmptyState = () => {
  return (
    <>
      {/* Frame 1597881530 */}
      <div className="flex flex-col w-full h-21 pt-1 pb-1 px-1.25 gap-4" />

      {/* Frame 1597881306 */}
      <div className="flex flex-col items-center gap-5 pt-2.25">
        <Image
          src="/illust/budget-empty-illust.svg"
          alt="예산 비어있음"
          width={165}
          height={165}
        />
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-bold leading-7 text-center text-foreground">
            여행 계획이 아직 없어요
          </p>
          <p className="text-sm font-normal leading-5 text-center text-foreground">
            예산을 정하기 위해
            <br />
            여행 일정에 장소를 추가해주세요
          </p>
        </div>
      </div>
    </>
  );
};

export default BudgetEmptyState;
