"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { usePlaceSearch } from "@/lib/hooks/use-place-search";
import { useAddCollectionPlace } from "@/lib/hooks/collection/use-add-collection-place";
import { useCreateExtractionJob } from "@/lib/hooks/collection/use-create-extraction-job";
import { useLatestExtractionJob } from "@/lib/hooks/collection/use-latest-extraction-job";
import { useDeleteExtractionJob } from "@/lib/hooks/collection/use-delete-extraction-job";
import { useAddExtractionJobPlaces } from "@/lib/hooks/collection/use-add-extraction-job-places";
import { deleteExtractionJob } from "@/lib/api/collection";
import type { FailureCode, FromUrlStatus } from "@/types/extraction-job";
import SearchAiIllust from "@/public/illust/search-ai.svg";
import {
  ArrowLeft,
  MapPinIcon,
  SearchIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import ColorYoutubeIcon from "@/public/icons/colorYoutubeIcon.svg";
import { toast } from "sonner";
import Link from "next/link";
import CheckBox from "@/components/common/CheckBox";

const STATUS_LABEL: Record<FromUrlStatus, string> = {
  PENDING: "대기 중이에요...",
  EXTRACTING: "장소를 추출하는 중이에요...",
  SEARCHING: "장소를 검색하는 중이에요...",
  COMPLETED: "장소 추출이 완료됐어요!",
  FAILED: "장소 추출에 실패했어요.",
  RETRY_WAITING: "잠시 후 재시도할게요...",
};

const FAILURE_LABEL: Record<FailureCode, string> = {
  CONTENT_NOT_FOUND: "콘텐츠를 찾을 수 없어요.",
  NO_PLACE_EXTRACTED: "분석했지만 장소를 찾지 못했어요.",
  VIDEO_TOO_SHORT: "분석할 수 없는 영상이에요.",
  VIDEO_TOO_LONG: "영상 길이가 너무 길어요.",
  UNEXPECTED_ERROR: "예기치 못한 오류가 발생했어요.",
  YOUTUBE_API_ERROR: "유튜브 오류가 발생했어요. 잠시 후 재시도할게요.",
  GENAI_ERROR: "AI 오류가 발생했어요. 잠시 후 재시도할게요.",
};

const AddPlacePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isJobActive, setIsJobActive] = useState(false);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const jobRef = useRef<{ collectionId: string; jobId: string } | null>(null);
  const { data } = usePlaceSearch(query);
  const { mutate: createJob, isPending: isCreatingJob } =
    useCreateExtractionJob({
      onSuccess: () => setIsJobActive(true),
      onError: (error) => {
        if (error.response?.data?.code === "JOB_IN_PROGRESS") {
          setIsJobActive(true);
        } else {
          toast.error("장소 추출 요청에 실패했어요.");
        }
      },
    });
  const { data: jobData } = useLatestExtractionJob(collectionId, {
    enabled: isJobActive,
  });
  const { mutate: deleteJob } = useDeleteExtractionJob({
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["extractionJobLatest", collectionId],
      });
      setIsJobActive(false);
      setSelectedPlaceIds([]);
    },
  });
  const { mutate: addExtractionPlaces, isPending: isAddingExtractionPlaces } =
    useAddExtractionJobPlaces({
      onSuccess: () => {
        toast("선택한 장소가 보관함에 추가되었습니다.");
        queryClient.removeQueries({
          queryKey: ["extractionJobLatest", collectionId],
        });
        queryClient.invalidateQueries({
          queryKey: ["collectionPlaces", { collectionId }],
        });
        setIsJobActive(false);
        setSelectedPlaceIds([]);
      },
      onError: () => {
        toast.error("장소 추가에 실패했어요.");
      },
    });
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

  useEffect(() => {
    if (isJobActive && jobData?.job_id) {
      jobRef.current = { collectionId, jobId: jobData.job_id };
    }
    if (!isJobActive) {
      jobRef.current = null;
    }
  }, [isJobActive, jobData?.job_id]);

  useEffect(() => {
    return () => {
      if (jobRef.current) {
        deleteExtractionJob(jobRef.current.collectionId, jobRef.current.jobId);
        queryClient.removeQueries({
          queryKey: ["extractionJobLatest", jobRef.current.collectionId],
        });
      }
    };
  }, []);

  useEffect(() => {
    if (
      selectedPlaceId &&
      !places.some((p) => p.place_id === selectedPlaceId)
    ) {
      setSelectedPlaceId(null);
    }
  }, [places]);

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
              {query.trim().length > 0 && (
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
          {isJobActive &&
          jobData?.status === "COMPLETED" &&
          jobData.result.places.length === 0 ? (
            <>
              <div className="flex flex-col flex-1 mt-5 items-center pb-24">
                <h1 className="typography-display-lg-bold self-center">
                  AI를 통해 장소를 찾아보세요!
                </h1>
                <div className="mt-3 flex flex-col gap-3 rounded-3xl bg-[#f5f5f5] px-5 py-6 items-center w-full">
                  <p className="typography-action-base-bold text-center">
                    {FAILURE_LABEL["NO_PLACE_EXTRACTED"]}
                  </p>
                  <Button
                    className="typography-action-sm-reg"
                    onClick={() => {
                      if (jobData?.job_id) {
                        deleteJob({ collectionId, jobId: jobData.job_id });
                      } else {
                        setIsJobActive(false);
                      }
                    }}
                  >
                    다시 요청하기
                  </Button>
                </div>
              </div>
            </>
          ) : isJobActive && jobData?.status === "COMPLETED" ? (
            <>
              <div className="fixed inset-x-5 top-[104px] bottom-19 overflow-y-auto">
                <div className="flex flex-col gap-5 pb-5 pt-5">
                  <div className="flex flex-col gap-3">
                    <h1 className="typography-display-lg-bold">
                      콘텐츠에서 장소 정보를 추출했어요.
                    </h1>

                    {/* 요약 박스 */}
                    <div className="rounded-xl bg-card p-3 pb-0 flex flex-col gap-3">
                      <p className="typography-action-sm-reg text-foreground">
                        {jobData.result.summary}
                      </p>
                      <Link
                        href={jobData.result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between py-3 border-t border-border"
                      >
                        <div className="flex items-center gap-1 min-w-0">
                          <ColorYoutubeIcon className="shrink-0" />
                          <p className="typography-caption-xs-reg text-muted-foreground truncate">
                            {jobData.result.author_name} -{" "}
                            {jobData.result.title}
                          </p>
                        </div>
                        <SquareArrowOutUpRight
                          size={18}
                          className="shrink-0 text-muted-foreground"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* 장소 목록 헤더 */}
                  <div className="flex gap-2 items-center">
                    <p className="typography-display-lg-bold">추출된 장소</p>
                    <p className="typography-display-base-reg">
                      ({jobData.result.places.length}개)
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <CheckBox
                      checked={
                        selectedPlaceIds.length ===
                          jobData.result.places.length &&
                        jobData.result.places.length > 0
                      }
                      onCheckedChange={(checked) =>
                        setSelectedPlaceIds(
                          checked
                            ? jobData.result.places.map((p) => p.place_id)
                            : [],
                        )
                      }
                    />
                    <p className="typography-action-base-reg text-[#020628]">
                      전체 선택
                    </p>
                  </div>

                  {/* 장소 아이템 */}
                  {jobData.result.places.map((place) => {
                    const isChecked = selectedPlaceIds.includes(place.place_id);
                    return (
                      <div
                        key={place.place_id}
                        className="w-full text-left rounded-2xl bg-[#f5f5f5] px-5 py-3 flex items-center gap-3"
                        onClick={() =>
                          setSelectedPlaceIds((prev) =>
                            isChecked
                              ? prev.filter((id) => id !== place.place_id)
                              : [...prev, place.place_id],
                          )
                        }
                      >
                        <CheckBox checked={isChecked} />
                        <div className="flex flex-col gap-1 min-w-0">
                          <p className="typography-label-base-sb truncate">
                            {place.name}
                          </p>
                          <p className="typography-body-sm-reg text-neutral-500 truncate flex gap-1">
                            <MapPinIcon size={18} />
                            {place.address}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="fixed bottom-0 inset-x-0 px-5 py-4 flex items-center gap-1">
                <button
                  type="button"
                  className="size-11 shrink-0 flex items-center justify-center"
                  onClick={() => {
                    if (jobData?.job_id) {
                      deleteJob({ collectionId, jobId: jobData.job_id });
                    } else {
                      setIsJobActive(false);
                    }
                  }}
                >
                  <ArrowLeft size={24} />
                </button>
                <Button
                  className="flex-1 typography-action-base-bold disabled:opacity-40 text-primary-foreground"
                  disabled={
                    selectedPlaceIds.length === 0 || isAddingExtractionPlaces
                  }
                  onClick={() => {
                    if (jobData?.job_id) {
                      addExtractionPlaces({
                        collectionId,
                        jobId: jobData.job_id,
                        place_ids: selectedPlaceIds,
                      });
                    }
                  }}
                >
                  선택한 장소 추가하기
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col flex-1 mt-5 items-center pb-24">
                <h1 className="typography-display-lg-bold">
                  AI를 통해 장소를 찾아보세요!
                </h1>
                {isJobActive && jobData ? (
                  <div className="mt-3 flex flex-col gap-3 rounded-3xl bg-[#f5f5f5] px-5 py-6 items-center w-full">
                    <p className="typography-action-base-bold text-center">
                      {jobData.status === "FAILED" && jobData.failure_code
                        ? FAILURE_LABEL[jobData.failure_code]
                        : STATUS_LABEL[jobData.status]}
                    </p>
                    {jobData.status === "FAILED" && (
                      <Button
                        className="typography-action-sm-reg"
                        onClick={() =>
                          deleteJob({ collectionId, jobId: jobData.job_id })
                        }
                      >
                        다시 요청하기
                      </Button>
                    )}
                  </div>
                ) : (
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
                        <p>Youtube 롱/숏폼을 통해 분석이 가능해요!</p>
                      </div>
                    </div>
                  </div>
                )}
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
                    disabled={!url.trim() || isCreatingJob}
                    className="size-11 shrink-0 flex items-center justify-center rounded-xl bg-sky-500 disabled:opacity-40"
                    onClick={() => createJob({ collectionId, url })}
                  >
                    <SearchIcon size={20} color="#000" />
                  </button>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddPlacePage;
