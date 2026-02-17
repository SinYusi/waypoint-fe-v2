"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useCollection } from "@/lib/hooks/collection/use-collection";
import { useCollectionPlaces } from "@/lib/hooks/collection/use-collection-places";
import { useCollectionMembers } from "@/lib/hooks/collection/use-collection-members";
import NavigationBar from "@/components/layout/NavigationBar";
import PlaceEmptyIllust from "@/public/illust/place-empty.svg";
import { Button } from "@/components/ui/button";
import PlaceListHeader, {
  type PlaceListHeaderValue,
} from "@/components/layout/PlaceListHeader";
import PlaceCard from "@/components/card/PlaceCard";
import { PlusIcon } from "lucide-react";

const CollectionDetailPage = () => {
  const router = useRouter();
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;

  const { data: collection } = useCollection(collectionId);
  const { data: placesData } = useCollectionPlaces(collectionId);
  const { data: membersData } = useCollectionMembers(collectionId);

  const title = collection?.title ?? "";
  const places = placesData?.pages.flatMap((page) => page.contents) ?? [];
  const members = membersData
    ? [membersData.me, ...membersData.members].map((m) => ({
        id: m.collection_member_id,
        name: m.nickname ?? "",
      }))
    : [];

  const [listHeader, setListHeader] = useState<PlaceListHeaderValue>({
    sort: "LATEST",
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="center"
        showBackButton
        title={title}
        showNotificationButton
        leftBtnBgVariant="ghost"
        rightBtnBgVariant="ghost"
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
      ) : (
        <>
          <PlaceListHeader
            members={members}
            value={listHeader}
            onChange={(next) => setListHeader((prev) => ({ ...prev, ...next }))}
            title={title}
            placeCount={collection?.place_count}
            collectionMembers={
              membersData ? [membersData.me, ...membersData.members] : undefined
            }
          />
          <main className="flex flex-col gap-4 px-5 pb-40 pt-5">
            {places.map((item) => (
              <PlaceCard
                key={item.collection_place_id}
                title={item.place.name}
                address={item.place.address}
                imageSrc={item.place.photos[0]}
                likeCount={item.pick_pass.picked.count}
                rejectCount={item.pick_pass.passed.count}
                onClick={() =>
                  router.push(
                    `/collection/${collectionId}/place/${item.place.place_id}`,
                  )
                }
              />
            ))}
          </main>
          <div className="fixed bottom-[72px] inset-x-0 z-10 px-5 py-3">
            <Button
              className="w-full bg-sky-500 typography-action-base-bold"
              onClick={() => router.push(`/home/${collectionId}/add-place`)}
              icon={<PlusIcon className="opacity-40" color="#000" />}
            >
              장소 추가하기
            </Button>
          </div>
        </>
      )}
      <NavigationBar className="fixed bottom-0 z-10 inset-x-0" />
    </div>
  );
};

export default CollectionDetailPage;
