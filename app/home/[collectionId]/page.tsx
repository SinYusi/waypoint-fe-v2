"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { useCollection } from "@/lib/hooks/collection/use-collection";
import { useCollectionPlaces } from "@/lib/hooks/collection/use-collection-places";
import NavigationBar from "@/components/layout/NavigationBar";
import PlaceEmptyIllust from "@/public/illust/place-empty.svg";
import { Button } from "@/components/ui/button";

const CollectionDetailPage = () => {
  const params = useParams<{ collectionId: string }>();
  const collectionId = useMemo(
    () => params.collectionId,
    [params.collectionId],
  );

  const { data: collection } = useCollection(collectionId);
  const { data: placesData } = useCollectionPlaces(collectionId);

  const title = collection?.title ?? "";
  const places = placesData?.pages.flatMap((page) => page.contents) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="center"
        showBackButton
        title={title}
        showNotificationButton
      />
      {places.length === 0 ? (
        <main className="flex flex-col flex-1 items-center justify-center pb-18 gap-5 mx-5">
          <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-[#f5f5f5]">
            <PlaceEmptyIllust className="absolute w-54 h-48" />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h1 className="typography-display-lg-bold">
              우리의 첫 번째 장소를 담아보세요
            </h1>
            <p className="typography-action-sm-reg text-center">
              꿈꾸는 장소들을 하나 둘 모으다 보면, <br />
              이번 여행이 더 기다려질 거에요!
            </p>
          </div>
          <Button className="mt-7 bg-sky-500 typography-action-base-bold w-full">
            장소 추가하기
          </Button>
        </main>
      ) : null}
      <NavigationBar className="fixed bottom-0 z-10 inset-x-0" />
    </div>
  );
};

export default CollectionDetailPage;
