"use client"

import { Button } from "@/components/ui/button"
import { useDevLogin } from "@/lib/hooks/use-dev-login"

const DEFAULT_DEV_LOGIN_PAYLOAD = {
  provider: "GOOGLE" as const,
  provider_id: "dev-user-1",
  nickname: "개발테스트유저",
}

export default function DevLoginButton() {
  const { mutate, isPending, isSuccess, data, error } = useDevLogin()

  const handleDevLogin = () => {
    mutate(DEFAULT_DEV_LOGIN_PAYLOAD)
  }

  const errorMessage =
    (error?.response?.data as { message?: string } | undefined)?.message ??
    error?.message ??
    "로그인에 실패했습니다."

  return (
    <section className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-900">개발 서버 로그인</p>
      <Button type="button" onClick={handleDevLogin} disabled={isPending} className="w-full">
        {isPending ? "로그인 중..." : "임시 개발 로그인"}
      </Button>

      {isSuccess && (
        <p className="text-xs text-emerald-600">
          로그인 성공 (만료: {data.expires_in}s, 토큰 앞 12자리: {data.access_token.slice(0, 12)})
        </p>
      )}

      {error && <p className="text-xs text-rose-600">{errorMessage}</p>}
    </section>
  )
}
