import type { ExpenseGroupResponse, PlaceCategory } from "@/types/budget";
import BudgetPlaceCard from "@/components/card/BudgetPlaceCard";
import BudgetCandidateCard from "@/components/card/BudgetCandidateCard";
import BudgetCandidateGroup from "@/components/card/BudgetCandidateGroup";
import { type PlaceType } from "@/components/card/PlaceTypeIcon";

interface ExpenseGroupItemProps {
  group: ExpenseGroupResponse;
  onSelectCandidates?: () => void;
}

const getPlaceType = (category: PlaceCategory | null | undefined): PlaceType =>
  (category?.level2?.name as PlaceType) ?? "기타";

const ExpenseGroupItem = ({ group, onSelectCandidates }: ExpenseGroupItemProps) => {
  // BLOCK 타입
  if (group.type === "BLOCK") {
    // 후보지 있고 미확정 → 후보지 그룹 (view)
    if (group.block_status === "PENDING" && group.candidates?.length) {
      const cards = group.candidates.map((c) => ({
        placeName: c.block?.name ?? "알 수 없음",
        items: c.items,
        placeType: getPlaceType(c.block?.category),
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
          items={group.selected.items}
          placeType={getPlaceType(group.selected.block?.category)}
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
          items={group.selected.items}
          placeType={getPlaceType(group.selected.block?.category)}
        />
      );
    }
  }

  // ADDITIONAL 타입 (추가 지출) — 헤더 없이 항목만 표시
  if (group.type === "ADDITIONAL" && group.selected?.items.length) {
    return <BudgetPlaceCard items={group.selected.items} />;
  }

  return null;
};

export default ExpenseGroupItem;
