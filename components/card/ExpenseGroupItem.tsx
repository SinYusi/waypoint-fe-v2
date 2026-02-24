import type { ExpenseGroupResponse } from "@/types/budget";
import BudgetPlaceCard from "@/components/card/BudgetPlaceCard";
import BudgetCandidateCard from "@/components/card/BudgetCandidateCard";
import BudgetCandidateGroup from "@/components/card/BudgetCandidateGroup";

interface ExpenseGroupItemProps {
  group: ExpenseGroupResponse;
  onSelectCandidates?: () => void;
}

const ExpenseGroupItem = ({ group, onSelectCandidates }: ExpenseGroupItemProps) => {
  // BLOCK 타입
  if (group.type === "BLOCK") {
    // 후보지 있고 미확정 → 후보지 그룹 (view)
    if (group.block_status === "PENDING" && group.candidates?.length) {
      const cards = group.candidates.map((c) => ({
        placeName: c.block?.name ?? "알 수 없음",
        feeLabel: c.items[0]?.name,
        amount: c.items[0]?.cost ?? 0,
        placeType: "기타" as const,
      }));
      return (
        <BudgetCandidateGroup
          mode="view"
          cards={cards}
          onSelectCandidates={onSelectCandidates}
        />
      );
    }

    // 확정 + 후보지 여러 개 → 다시 선택하기
    if (
      group.block_status === "FIXED" &&
      group.selected &&
      (group.candidate_count ?? 0) > 1
    ) {
      return (
        <BudgetCandidateCard
          placeName={group.selected.block?.name ?? ""}
          feeLabel={group.selected.items[0]?.name}
          amount={group.selected.items[0]?.cost ?? 0}
          placeType="기타"
          candidateCount={group.candidate_count ?? 0}
          onSelectClick={onSelectCandidates}
        />
      );
    }

    // 확정 단일 or DIRECT
    if (group.selected) {
      return (
        <BudgetPlaceCard
          placeName={group.selected.block?.name ?? ""}
          feeLabel={group.selected.items[0]?.name}
          amount={group.selected.items[0]?.cost ?? 0}
          placeType="기타"
        />
      );
    }
  }

  // ADDITIONAL 타입 (추가 지출)
  if (group.type === "ADDITIONAL" && group.selected) {
    const { items } = group.selected;

    if (items.length === 1) {
      return (
        <BudgetPlaceCard
          placeName={items[0].name}
          amount={items[0].cost}
          placeType="기타"
        />
      );
    }

    const cards = items.map((item) => ({
      placeName: item.name,
      amount: item.cost,
      placeType: "기타" as const,
    }));
    return <BudgetCandidateGroup mode="edit" cards={cards} />;
  }

  return null;
};

export default ExpenseGroupItem;
