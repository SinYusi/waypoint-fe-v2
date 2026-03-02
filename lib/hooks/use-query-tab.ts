"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UseQueryTabOptions<T extends string> {
  key?: string;
  defaultValue: T;
  allowedValues: readonly T[];
  removeWhenDefault?: boolean;
  scroll?: boolean;
}

const useQueryTab = <T extends string>({
  key = "tab",
  defaultValue,
  allowedValues,
  removeWhenDefault = true,
  scroll = true,
}: UseQueryTabOptions<T>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = useMemo(() => {
    const raw = searchParams.get(key);
    const isAllowed = (v: string | null): v is T =>
      !!v && (allowedValues as readonly string[]).includes(v);
    return isAllowed(raw) ? raw : defaultValue;
  }, [searchParams, key, allowedValues, defaultValue]);

  const setTab = useCallback(
    (next: T) => {
      if (next === tab) return;

      const sp = new URLSearchParams(searchParams.toString());

      if (removeWhenDefault && next === defaultValue) sp.delete(key);
      else sp.set(key, next);

      const query = sp.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll });
    },
    [
      tab,
      searchParams,
      removeWhenDefault,
      defaultValue,
      key,
      router,
      pathname,
      scroll,
    ],
  );

  return { tab, setTab };
};

export default useQueryTab;
