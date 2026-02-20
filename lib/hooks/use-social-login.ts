"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { socialLogin, type SocialLoginProvider } from "@/lib/api/auth";

type Options = Omit<
  UseMutationOptions<void, Error, SocialLoginProvider>,
  "mutationFn"
>;

export const useSocialLogin = (options?: Options) => {
  return useMutation<void, Error, SocialLoginProvider>({
    mutationFn: socialLogin,
    ...options,
  });
};
