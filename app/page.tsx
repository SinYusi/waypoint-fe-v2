"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    router.replace(token ? "/home" : "/onboarding");
  }, [router]);

  return null;
}
