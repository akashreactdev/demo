"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Main = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/sign-in");
  }, [router]);

  return <div />;
};

export default Main;
