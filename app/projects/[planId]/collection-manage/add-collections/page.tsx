"use client";

import CheckBoxField from "@/components/common/CheckBoxField";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useCollections } from "@/lib/hooks/collection/use-collections";
import { useAddPlanCollections } from "@/lib/hooks/plan-collection/use-add-plan-collections";
import { usePlanCollections } from "@/lib/hooks/plan-collection/use-plan-collections";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import CollectionEmptyIllust from "@/public/illust/collection-empty.svg";
import { Plus, UsersRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const AddCollectionsPage = () => {
  const router = useRouter();
  const { planId } = useParams<{ planId: string }>();

  // 플랜에 이미 연결된 컬렉션 조회
  const {
    data: planCollections,
    isLoading: isPlanCollectionsLoading,
    isError: isPlanCollectionsError,
    error: planCollectionsError,
  } = usePlanCollections(planId);

  // 컬렉션 목록 조회
  const {
    data,
    isLoading: isCollectionsLoading,
    isError: isCollectionsError,
    error: collectionsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollections({ size: 10 });

  const isLoading = isCollectionsLoading || isPlanCollectionsLoading;
  const isError = isCollectionsError || isPlanCollectionsError;
  const error = collectionsError ?? planCollectionsError;

  // 플랜에 컬렉션 추가
  const { mutate: addPlanCollections, isPending: isAdding } =
    useAddPlanCollections({
      onSuccess: () => {
        router.back();
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.detail ?? "보관함을 추가하지 못했어요.",
        );
      },
    });

  // 이미 연결된 컬렉션들
  const addedIdSet = useMemo(() => {
    const ids = planCollections?.map((c) => c.collection_id) ?? [];
    return new Set(ids);
  }, [planCollections]);

  // 전체 목록 flat + 이미 추가된 거 제외
  const collections = useMemo(() => {
    const all = data?.pages.flatMap((p) => p.contents) ?? [];

    return all.filter((c) => !addedIdSet.has(c.collection_id));
  }, [data, addedIdSet]);

  // 체크 상태 관리
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleId = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((v) => v !== id);
    });
  };

  const handleFetchNext = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const loadMoreRef = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage && !isLoading && !isError,
    onIntersect: handleFetchNext,
  });

  const handleAdd = () => {
    if (isLoading || isError || isAdding || selectedIds.length === 0) return;

    addPlanCollections({
      planId,
      body: { collection_ids: selectedIds },
    });
  };

  return (
    <div className="flex flex-col pt-20 gap-2.5">
      <Header
        variant="center"
        title="보관함 불러오기"
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed top-0 inset-x-0 bg-background z-50"
      />

      <main className="flex flex-1 flex-col px-5 pt-3 pb-3.5 gap-3.5 mb-13">
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center text-muted-foreground">
            보관함 불러오는 중...
          </div>
        ) : isError ? (
          <div className="fixed inset-0 flex items-center justify-center text-destructive">
            {error?.response?.data.detail ?? "알 수 없는 오류"}
          </div>
        ) : collections.length === 0 ? (
          <div className="fixed top-15 inset-0 flex flex-col gap-5 items-center justify-center -mt-15">
            <CollectionEmptyIllust />
            <div className="flex flex-col gap-2 items-center justify-center">
              <h2 className="typography-display-lg-bold">
                아직 보관함이 없어요
              </h2>
              <span className="typography-body-sm-md text-center">
                가고 싶은 여행 장소를 담아 <br />
                보관함을 만들어보세요
              </span>
            </div>
            <Button
              size="M"
              onClick={() => router.push("/home/create")}
              className="typography-action-sm-bold"
            >
              보관함 만들기
            </Button>
          </div>
        ) : (
          <>
            {collections.map((c) => (
              <CheckBoxField
                key={c.collection_id}
                id={c.collection_id}
                name="collection"
                label={c.title ?? ""}
                icon={UsersRound}
                iconClassName="w-4 h-4"
                description={`${c.member_count}명 참여 중`}
                checked={selectedIds.includes(c.collection_id)}
                onCheckedChange={(checked) =>
                  toggleId(c.collection_id, checked)
                }
              />
            ))}
            <div ref={loadMoreRef} className="h-10" />
          </>
        )}
      </main>

      {/* 하단 고정 버튼 */}
      <footer className="fixed bottom-0 inset-x-0 flex flex-col">
        <div className="w-full h-12 bg-[linear-gradient(180deg,rgba(252,252,252,0)_0%,rgba(252,252,252,1)_100%)] -mb-px" />
        <div className="w-full h-22.75 px-5 pt-4 pb-5 bg-background drop-shadow-[0px_-0.75px_0px_0px_#DEDEDE]">
          <Button
            variant="default"
            disabled={
              isLoading || isError || isAdding || selectedIds.length === 0
            }
            className="w-full"
            onClick={handleAdd}
          >
            <Plus className="text-foreground opacity-40" />
            보관함 추가하기
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default AddCollectionsPage;
