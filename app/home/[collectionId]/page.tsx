"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useCollection } from "@/lib/hooks/collection/use-collection";
import { useCollectionPlaces } from "@/lib/hooks/collection/use-collection-places";
import { useCollectionMembers } from "@/lib/hooks/collection/use-collection-members";
import { useCollectionPlacePreference } from "@/lib/hooks/collection/use-collection-place-preference";
import NavigationBar from "@/components/layout/NavigationBar";
import PlaceEmptyIllust from "@/public/illust/place-empty.svg";
import { Button } from "@/components/ui/button";
import PlaceListHeader, {
  type PlaceListHeaderValue,
} from "@/components/layout/PlaceListHeader";
import PlaceCard from "@/components/card/PlaceCard";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

const CollectionDetailPage = () => {
  const router = useRouter();
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;

  const [listHeader, setListHeader] = useState<PlaceListHeaderValue>({
    sort: "LATEST",
  });

  const { data: collection } = useCollection(collectionId);
  const { data: placesData, isPending: isPlacesPending } = useCollectionPlaces(collectionId, {
    sort: listHeader.sort,
    added_by: listHeader.addedBy,
  });
  const { data: membersData } = useCollectionMembers(collectionId);
  const { mutate: postPreference } = useCollectionPlacePreference();

  const [isOptionsVisible, setIsOptionsVisible] = useState(true);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        setIsOptionsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setIsOptionsVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const title = collection?.title ?? "";
  const places = placesData?.pages.flatMap((page) => page.contents) ?? [];
  const allMembers = membersData
    ? [
        ...(membersData.me ? [membersData.me] : []),
        ...membersData.members.filter(
          (m) => m.collection_member_id !== membersData.me?.collection_member_id,
        ),
      ]
    : [];
  const members = allMembers.map((m) => ({
    id: m.collection_member_id,
    name: m.nickname ?? "",
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="center"
        showBackButton
        title={title}
        showNotificationButton
        leftBtnBgVariant="ghost"
        rightBtnBgVariant="ghost"
        className="fixed top-0 z-10 inset-x-0 bg-background"
      />
      {isPlacesPending ? (
        <main className="flex flex-col flex-1 items-center justify-center pb-18 pt-15">
          <p className="typography-action-base-reg text-neutral-400">
            보관함을 불러오는 중이에요...
          </p>
        </main>
      ) : places.length === 0 ? (
        <main className="flex flex-col flex-1 items-center justify-center pb-18 gap-5 mx-5 pt-15">
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
          <Button
            className="mt-7 bg-sky-500 typography-action-base-bold w-full"
            onClick={() => router.push(`/home/${collectionId}/add-place`)}
          >
            장소 추가하기
          </Button>
        </main>
      ) : (
        <div className="pt-15">
          <PlaceListHeader
            members={members}
            value={listHeader}
            onChange={(next) => setListHeader((prev) => ({ ...prev, ...next }))}
            title={title}
            placeCount={collection?.place_count}
            collectionMembers={membersData ? allMembers : undefined}
            meRole={membersData?.me?.role}
            collectionId={collectionId}
            className={cn(
              "sticky top-[60px] z-9 bg-white transition-transform duration-300 ease-in-out bg-background",
              !isOptionsVisible && "-translate-y-full",
            )}
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
                myPreference={item.pick_pass.my_preference}
                onLikeClick={() =>
                  postPreference({
                    collectionId,
                    collectionPlaceId: item.collection_place_id,
                    type: "PICK",
                  })
                }
                onRejectClick={() =>
                  postPreference({
                    collectionId,
                    collectionPlaceId: item.collection_place_id,
                    type: "PASS",
                  })
                }
                onClick={() =>
                  router.push(
                    `/collection/${collectionId}/place/${item.collection_place_id}`,
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
        </div>
      )}
      <NavigationBar className="fixed bottom-0 z-10 inset-x-0" />
    </div>
  );
};

export default CollectionDetailPage;
