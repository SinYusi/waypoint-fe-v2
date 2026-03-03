"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { reissue } from "@/lib/api/auth";

export const useAuthInit = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsReady(true);
      return;
    }

    reissue()
      .then((data) => {
        localStorage.setItem("accessToken", data.access_token);
        setIsReady(true);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return { isReady };
};
