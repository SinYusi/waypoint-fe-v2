import type { ExpenseGroupResponse, PlaceCategory } from "@/types/budget";
import BudgetPlaceCard from "@/components/card/BudgetPlaceCard";
import BudgetCandidateCard from "@/components/card/BudgetCandidateCard";
import BudgetCandidateGroup from "@/components/card/BudgetCandidateGroup";
import { type PlaceType } from "@/components/card/PlaceTypeIcon";
import type { EditExpenseItem } from "@/components/common/BudgetBottomSheet";

interface ExpenseGroupItemProps {
  group: ExpenseGroupResponse;
  onSelectCandidates?: () => void;
  onCardClick?: (data: { placeName?: string; expenseId?: string; items: EditExpenseItem[] }) => void;
}

const getPlaceType = (category: PlaceCategory | null | undefined): PlaceType =>
  (category?.level2?.name as PlaceType) ?? "기타";

const ExpenseGroupItem = ({ group, onSelectCandidates, onCardClick }: ExpenseGroupItemProps) => {
  // BLOCK 타입
  if (group.type === "BLOCK") {
    // 후보지 있고 미확정 → 후보지 그룹 (view)
    if (group.block_status === "PENDING" && group.candidates?.length) {
      const candidates = group.candidates;
      const cards = candidates.map((c) => ({
        placeName: c.block?.name ?? "알 수 없음",
        expenseId: c.expense_id,
        items: c.items,
        placeType: getPlaceType(c.block?.category),
      }));
      return (
        <BudgetCandidateGroup
          mode="view"
          cards={cards}
          onSelectCandidates={onSelectCandidates}
          onCardClick={onCardClick ? (card) => onCardClick({ placeName: card.placeName, expenseId: card.expenseId, items: card.items }) : undefined}
        />
      );
    }

    // 확정 + 후보지 여러 개 → 다시 선택하기
    // candidate_count는 선택되지 않은 후보만 카운팅하므로, candidates 배열의 존재로 판단
    const hasMultipleCandidates = (group.candidates?.length ?? 0) > 0;
    if (group.block_status === "FIXED" && hasMultipleCandidates) {
      const totalCandidateCount = (group.candidates?.length ?? 0) + (group.selected ? 1 : 0);
      return (
        <BudgetCandidateCard
          placeName={group.selected?.block?.name ?? ""}
          items={group.selected?.items ?? []}
          placeType={getPlaceType(group.selected?.block?.category)}
          candidateCount={totalCandidateCount}
          onSelectClick={onSelectCandidates}
          onClick={onCardClick ? () => onCardClick({ placeName: group.selected?.block?.name, expenseId: group.selected?.expense_id, items: group.selected?.items ?? [] }) : undefined}
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
          onClick={onCardClick ? () => onCardClick({ placeName: group.selected?.block?.name, expenseId: group.selected?.expense_id, items: group.selected!.items }) : undefined}
        />
      );
    }
  }

  // ADDITIONAL 타입 (추가 지출) — 헤더 없이 항목만 표시
  if (group.type === "ADDITIONAL" && group.selected?.items.length) {
    return <BudgetPlaceCard
      items={group.selected.items}
      onClick={onCardClick ? () => onCardClick({ expenseId: group.selected?.expense_id, items: group.selected!.items }) : undefined}
    />;
  }

  return null;
};

export default ExpenseGroupItem;
