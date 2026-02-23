"use client";

import { useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { usePlaceSearch } from "@/lib/hooks/use-place-search";
import { useAddCollectionPlace } from "@/lib/hooks/collection/use-add-collection-place";
import SearchAiIllust from "@/public/illust/search-ai.svg";
import { SearchIcon, YoutubeIcon } from "lucide-react";
import { toast } from "sonner";

const AddPlacePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const { data } = usePlaceSearch(query);
  const { mutate: addPlace, isPending } = useAddCollectionPlace({
    onSuccess: () => {
      toast("선택한 장소가 보관함에 추가되었습니다.");
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error("이미 보관함에 추가된 장소입니다.");
      }
    },
  });

  const places = data ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        showBackButton
        leftBtnBgVariant="ghost"
        variant="center"
        title="장소 찾기"
        className="fixed top-0 z-10"
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
          <InputForm
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소를 검색해주세요"
          />
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
        <TabsContent value="ai" className="flex flex-col flex-1 mt-0">
          <div className="flex flex-col flex-1 mt-5 items-center pb-24">
            <h1 className="typography-display-lg-bold">
              AI를 통해 장소를 찾아보세요!
            </h1>
            <div className="mt-3 flex flex-col gap-4 rounded-3xl bg-[#f5f5f5] px-5 pt-4 pb-5 items-center w-full">
              <SearchAiIllust />
              <div className="space-y-2">
                <div className="space-y-1">
                  <p className="typography-action-base-bold text-[#757575]">
                    공유 링크를 붙여넣으면 컨텐츠에 소개된
                  </p>
                  <p className="typography-action-base-bold text-[#757575]">
                    장소를 AI가 일괄적으로 모아올 수 있어요!
                  </p>
                </div>
                <div className="flex flex-row gap-1 text-neutral-500 typography-action-sm-reg items-center">
                  <YoutubeIcon />
                  <p>Youtube 롱/숏폼을 통해 분석이 가능해요!</p>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-x-5 bottom-24 h-px bg-[#e2e2e2]" />
          <div className="fixed bottom-0 inset-x-0 px-5 py-4 bg-white">
            <div className="flex items-center gap-4">
              <InputForm
                hideIcon
                className="flex-1"
                placeholder="URL을 여기에 붙여넣어주세요"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="button"
                className="size-11 shrink-0 flex items-center justify-center rounded-xl bg-sky-500"
              >
                <SearchIcon size={20} color="#000" />
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddPlacePage;
