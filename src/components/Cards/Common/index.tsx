"use client";
import React from "react";
import { SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const StyledWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: "32px",
  borderRadius: "16px",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

interface CommonCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const CommonCard = ({ children, sx }: Readonly<CommonCardProps>) => {
  return <StyledWrapper sx={sx}>{children}</StyledWrapper>;
};

export default CommonCard;
