"use client";
import { usePathname, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  Suspense,
} from "react";

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
  setTargetValue: (value: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

function LoadingProviderContent({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [targetValue, setTargetValue] = useState("");

  const pathName = usePathname();
  const searchParams = useSearchParams();

  // const fullPath = useMemo(() => {
  //   const queryString = searchParams?.toString();
  //   return queryString ? `${pathName}?${queryString}` : pathName;
  // }, [pathName, searchParams]);
  const fullPath = useMemo(() => {
    if (!searchParams) return pathName;

    if (pathName.includes("cms")) {
      const decodedParams = Array.from(searchParams.entries())
        .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
        .join("&");
      return decodedParams ? `${pathName}?${decodedParams}` : pathName;
    }
    const queryString = searchParams.toString();
    return queryString ? `${pathName}?${queryString}` : pathName;
  }, [pathName, searchParams]);

  const startLoading = (text?: string) => {
    setLoadingText(text || "Loading...");
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setTargetValueHandler = (value: string) => {
    setTargetValue(value);
  };

  useEffect(() => {
    if (targetValue && targetValue === fullPath) {
      stopLoading();
    }
  }, [fullPath, targetValue]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingText,
        startLoading,
        stopLoading,
        setTargetValue: setTargetValueHandler,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingProviderContent>{children}</LoadingProviderContent>
    </Suspense>
  );
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used inside LoadingProvider");
  }
  return context;
}
