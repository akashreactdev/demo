"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material";

interface CommonChipProps {
  variant?: "primary" | "default";
  title?: string;
  style?: SxProps<Theme>;
  textStyle?: React.CSSProperties;
  onClick?: () => void;
}

const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<CommonChipProps>(({ variant, theme }) => ({
  backgroundColor:
    variant === "primary"
      ? theme.inProgress.background.primary
      : theme.pending.background.secondary,
  border: `1px solid ${
    variant === "primary" ? theme.inProgress.main : theme.pending.secondary
  }`,
  borderRadius: "8px",
  padding: "8px 16px",
  display: "inline-flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    padding: "6px 10px",
  },
}));

const CommonChip: React.FC<CommonChipProps> = ({
  variant = "default",
  title,
  style,
  textStyle,
  onClick,
}) => {
  return (
    <StyledChip onClick={onClick} variant={variant} sx={style}>
      <Typography sx={textStyle} variant="caption" fontWeight={400}>
        {title}
      </Typography>
    </StyledChip>
  );
};

export default CommonChip;
