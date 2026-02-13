"use client"

import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { devLogin, type DevLoginRequest, type DevLoginResponse } from "@/lib/api/auth"

type UseDevLoginOptions = {
  persistToken?: boolean
  mutationOptions?: Omit<
    UseMutationOptions<DevLoginResponse, AxiosError, DevLoginRequest>,
    "mutationFn"
  >
}

export function useDevLogin(options?: UseDevLoginOptions) {
  const persistToken = options?.persistToken ?? true

  return useMutation<DevLoginResponse, AxiosError, DevLoginRequest>({
    mutationFn: devLogin,
    ...options?.mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (persistToken && typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", data.access_token)
      }

      options?.mutationOptions?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}
