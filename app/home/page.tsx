"use client";

import CollectionCard from "@/components/card/CollectionCard";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";
import { Button } from "@/components/ui/button";
import { useCollections } from "@/lib/hooks/collection/use-collections";
import { useDeleteCollection } from "@/lib/hooks/collection/use-delete-collection";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { cn } from "@/lib/utils/utils";
import CollectionEmptyIllust from "@/public/illust/collection-empty.svg";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useAuthInit } from "@/lib/hooks/use-auth-init";

const HomePage = () => {
  const router = useRouter();
  const { isReady } = useAuthInit();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useCollections({ size: 10 }, { enabled: isReady });

  const collections = useMemo(() => {
    return data?.pages.flatMap((p) => p.contents) ?? [];
  }, [data]);

  const errorMessage =
    error?.response?.data?.detail ?? "보관함을 불러오지 못했어요.";

  const isEmpty = !isLoading && !isError && collections.length === 0;

  const handleCreate = () => router.push("/home/create");

  const handleFetchNext = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const loadMoreRef = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage && !isLoading && !isError,
    onIntersect: handleFetchNext,
  });

  const openDeleteDialog = (collectionId: string) => {
    setDeleteTargetId(collectionId);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const {
    mutate: deleteMutate,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteCollection({
    onSuccess: () => {
      closeDeleteDialog();
    },
  });

  const deleteErrorMessage =
    deleteError?.response?.data?.detail ??
    deleteError?.message ??
    "삭제에 실패했어요.";

  const handleConfirmDelete = () => {
    if (!deleteTargetId || isDeleting) return;

    deleteMutate({ collectionId: deleteTargetId });
  };

  if (!isReady) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {/* 헤더(알림) */}
      <Header
        showNotificationButton
        rightBtnBgVariant="glass"
        className="fixed top-0 z-10 inset-x-0"
      />

      <main
        className={cn(
          "flex flex-col flex-1 mt-15 px-5 pt-5 pb-36",
          isEmpty && "items-center justify-center gap-12",
        )}
      >
        {/* 타이틀 */}
        {!isLoading && !isError && !isEmpty && (
          <h2 className="typography-display-2xl">
            여행하고 싶은 곳들을
            <br />
            차곡차곡
          </h2>
        )}

        {/* 로딩 */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center typography-display-lg-reg text-muted-foreground">
            보관함을 불러오는 중...
          </div>
        )}

        {/* 에러 */}
        {isError && (
          <div className="flex flex-col flex-1 gap-3 items-center justify-center typography-display-lg-reg">
            <p className="typography-body-base text-destructive">
              {errorMessage}
            </p>
            <Button onClick={() => refetch()}>다시 시도</Button>
          </div>
        )}

        {isEmpty ? (
          <>
            {/* 컬렉션이 없을 경우 */}
            <div className="flex flex-col gap-5 items-center">
              <CollectionEmptyIllust />
              <div className="flex flex-col text-center gap-2">
                <h2 className="typography-display-xl">
                  우리만의 장소 보관함 만들기
                </h2>
                <p className="typography-body-sm-md">
                  함께 꿈꾸는 여행지들을 보관함에 담고,
                  <br />
                  서로 가고 싶은 곳들을 자유롭게 나눠볼까요?
                </p>
              </div>
            </div>
            <Button onClick={handleCreate} className="w-full">
              새 보관함 만들기
            </Button>
          </>
        ) : (
          <>
            {/* 컬렉션 목록 */}
            {!isLoading && !isError && collections.length > 0 && (
              <>
                <div className="flex flex-col gap-8 pt-8 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                  {collections.map((c) => (
                    <div key={c.collection_id}>
                      <CollectionCard
                        title={c.title ?? ""}
                        memberCount={c.member_count}
                        imageSrc={c.thumbnail}
                        className="max-w-full"
                        onClick={() => router.push(`/home/${c.collection_id}`)}
                        onEdit={() =>
                          router.push(`/home/${c.collection_id}/edit`)
                        }
                        onDelete={() => openDeleteDialog(c.collection_id)}
                      />
                    </div>
                  ))}
                </div>
                <div ref={loadMoreRef} className="h-10" />
              </>
            )}
          </>
        )}
      </main>

      {/* 하단 고정 버튼 */}
      {!isLoading && !isError && !isEmpty && (
        <div className="fixed bottom-14 px-4 pb-9 w-full bg-gradient-bottom-fade">
          <Button className="w-full" onClick={handleCreate}>
            <Plus /> 보관함 추가하기
          </Button>
        </div>
      )}

      {/* 네비게이션 바 */}
      <NavigationBar className="fixed bottom-0 z-10 inset-x-0" />

      {/* 삭제 확인 다이얼로그 */}
      <AppAlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setDeleteTargetId(null);
        }}
        title="정말 이 보관함을 삭제하시겠어요?"
        description={
          deleteError
            ? `삭제에 실패했어요.\n${deleteErrorMessage}`
            : "삭제한 보관함은 다시 복구가 불가능합니다.\n그래도 정말 보관함을 삭제하시겠어요?"
        }
        cancelLabel="취소"
        actionLabel="삭제하기"
        onCancel={closeDeleteDialog}
        onAction={handleConfirmDelete}
      />
    </div>
  );
};

export default HomePage;
