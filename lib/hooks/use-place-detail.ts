"use client"

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query"
import type { AxiosError } from "axios"

import {
  getPlaceDetail,
  type PickPassResponse,
  type PlaceDetail,
  type UpdatePlacePreferenceRequest,
  type UpdatePlaceMemoRequest,
  updatePlacePreference,
  updatePlaceMemo,
} from "@/lib/api/place"

export const placeDetailQueryKey = (collectionId: string, placeId: string) =>
  ["place-detail", collectionId, placeId] as const

type UsePlaceDetailOptions = {
  collectionId?: string
  collectionPlaceId?: string
  enabled?: boolean
  queryOptions?: Omit<
    UseQueryOptions<PlaceDetail, AxiosError>,
    "queryKey" | "queryFn" | "enabled"
  >
}

export const usePlaceDetail = (options: UsePlaceDetailOptions) => {
  const { collectionId, collectionPlaceId, enabled = true, queryOptions } = options
  const canFetch = Boolean(collectionId && collectionPlaceId && enabled)

  return useQuery<PlaceDetail, AxiosError>({
    queryKey: placeDetailQueryKey(collectionId ?? "", collectionPlaceId ?? ""),
    queryFn: () => getPlaceDetail(collectionId!, collectionPlaceId!),
    enabled: canFetch,
    ...queryOptions,
  })
}

type UseUpdatePlaceMemoOptions = {
  collectionId?: string
  collectionPlaceId?: string
  mutationOptions?: Omit<UseMutationOptions<void, AxiosError, UpdatePlaceMemoRequest>, "mutationFn">
}

export const useUpdatePlaceMemo = (options: UseUpdatePlaceMemoOptions) => {
  const queryClient = useQueryClient()
  const { collectionId, collectionPlaceId, mutationOptions } = options

  return useMutation<void, AxiosError, UpdatePlaceMemoRequest>({
    mutationFn: (payload) => {
      if (!collectionId || !collectionPlaceId) {
        throw new Error("collectionId and collectionPlaceId are required")
      }

      return updatePlaceMemo(collectionId, collectionPlaceId, payload)
    },
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (collectionId && collectionPlaceId) {
        queryClient.setQueryData<PlaceDetail>(
          placeDetailQueryKey(collectionId, collectionPlaceId),
          (old) => (old ? { ...old, memo: variables.memo } : old),
        )
      }
      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

type UseUpdatePlacePreferenceOptions = {
  collectionId?: string
  collectionPlaceId?: string
  mutationOptions?: Omit<
    UseMutationOptions<PickPassResponse, AxiosError, UpdatePlacePreferenceRequest>,
    "mutationFn"
  >
}

export const useUpdatePlacePreference = (options: UseUpdatePlacePreferenceOptions) => {
  const queryClient = useQueryClient()
  const { collectionId, collectionPlaceId, mutationOptions } = options

  return useMutation<PickPassResponse, AxiosError, UpdatePlacePreferenceRequest>({
    mutationFn: (payload) => {
      if (!collectionId || !collectionPlaceId) {
        throw new Error("collectionId and collectionPlaceId are required")
      }

      return updatePlacePreference(collectionId, collectionPlaceId, payload)
    },
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (collectionId && collectionPlaceId) {
        queryClient.setQueryData<PlaceDetail>(
          placeDetailQueryKey(collectionId, collectionPlaceId),
          (old) =>
            old
              ? {
                  ...old,
                  pickCount: data.pickCount,
                  passCount: data.passCount,
                  pickedMembers: data.pickedMembers,
                  passedMembers: data.passedMembers,
                  myPreference: data.myPreference,
                }
              : old,
        )
      }
      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}
