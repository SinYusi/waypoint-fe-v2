import { apiClient } from "@/lib/api/client"

export type LoginProvider = "GOOGLE" | "KAKAO" | "NAVER"

export type DevLoginRequest = {
  provider: LoginProvider
  provider_id: string
  nickname: string
  picture?: string
  email?: string
}

export type DevLoginResponse = {
  access_token: string
  expires_in: string
}

export async function devLogin(payload: DevLoginRequest) {
  const { data } = await apiClient.post<DevLoginResponse>("/dev/auth/login", payload)
  return data
}
