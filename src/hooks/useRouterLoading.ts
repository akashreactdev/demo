"use client";
import { useRef } from "react";
import { useLoading } from "@/context/LoadingContext";
import { useRouter, usePathname } from "next/navigation";

export function useRouterLoading() {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading, setTargetValue } = useLoading();
  const navigatingRef = useRef(false);
  const targetPath = useRef<string | null>(null);

  const navigateWithLoading = (
    href: string,
    loadingText: string = "Loading..."
  ) => {
    if (href !== pathname) {
      startLoading(loadingText);
      navigatingRef.current = true;
      targetPath.current = href;
      setTargetValue(targetPath.current);
      router.push(href);
    }
  };

  return { navigateWithLoading, router };
}
