"use client";

import { useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { usePlaceSearch } from "@/lib/hooks/use-place-search";
import { useAddCollectionPlace } from "@/lib/hooks/collection/use-add-collection-place";

const AddPlacePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [query, setQuery] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const { data } = usePlaceSearch(query);
  const { mutate: addPlace, isPending } = useAddCollectionPlace({
    onSuccess: () => router.back(),
  });

  const places = data ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        showBackButton
        leftBtnBgVariant="ghost"
        variant="center"
        title="장소 찾기"
        className="fixed top-0 z-10 bg-white"
      />
      <Tabs
        defaultValue="search"
        className="flex flex-col flex-1 pt-15 px-5 gap-5"
      >
        <TabsList style="underline" fullWidth>
          <TabsTrigger value="search" style="underline" fullWidth>
            장소 검색하기
          </TabsTrigger>
          <TabsTrigger value="ai" style="underline" fullWidth>
            AI로 장소 찾기
          </TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="flex flex-col flex-1 mt-0">
          <InputForm value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="fixed inset-x-5 top-[188px] bottom-24 overflow-y-auto border-b border-[#e2e2e2]">
            <div className="flex flex-col gap-4 pb-5">
              {places.map((place) => {
                const isSelected = selectedPlaceId === place.place_id;
                return (
                  <button
                    key={place.place_id}
                    type="button"
                    className={`w-full text-left rounded-2xl bg-[#f5f5f5] px-5 py-4 ${
                      isSelected
                        ? "border-2 border-sky-500"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() =>
                      setSelectedPlaceId(isSelected ? null : place.place_id)
                    }
                  >
                    <p className="typography-action-base-bold">{place.name}</p>
                    <p className="typography-body-sm-reg text-neutral-500 mt-1">
                      {place.address}
                    </p>
                  </button>
                );
              })}
              {query.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full typography-action-sm-reg text-neutral-500"
                  onClick={() => router.push(`${pathname}/manual`)}
                >
                  장소를 찾지 못하시겠나요?
                </Button>
              )}
            </div>
          </div>
          <div className="fixed bottom-0 inset-x-0 px-5 py-4 bg-white">
            <Button
              className="w-full bg-sky-500 typography-action-base-bold disabled:opacity-40"
              disabled={!selectedPlaceId || isPending}
              onClick={() => {
                if (selectedPlaceId) {
                  addPlace({ collectionId, place_id: selectedPlaceId });
                }
              }}
            >
              장소 추가하기
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="ai" className="flex flex-col flex-1 mt-0" />
      </Tabs>
    </div>
  );
};

export default AddPlacePage;
