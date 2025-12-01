"use client";
import React from "react";
import { useLoading } from "@/context/LoadingContext";
import {
  Backdrop,
  // CircularProgress,
  // Typography,
} from "@mui/material";
import Image from "next/image";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <Backdrop
      open={isLoading}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 1,
        flexDirection: "column",
      }}
    >
      {/* <CircularProgress color="inherit" />
       */}
      <Image
        src={"/assets/svg/logos/zorbee_icon.svg"}
        alt={"smile_type_conversation"}
        height={100}
        width={100}
      />
      {/* <Typography
        variant="body1"
        sx={{ mt: 2 }}
      >
        {loadingText || "Loading..."}
      </Typography> */}
    </Backdrop>
  );
}
