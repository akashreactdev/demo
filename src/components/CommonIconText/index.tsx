"use client";
import React from "react";
import Image from "next/image";
import { SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const StyledBox = styled(Box)(({ theme }) => ({
  height: "55px",
  marginTop: "10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: `1px solid ${theme.palette.mode === "light" ? "#E2E6EB" : "#424242"}`,
  paddingInline: "16px",
}));

interface CommonIconTextProps {
  icon?: string;
  title?: string | React.ReactNode;
  endIcon?: boolean | React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

const CommonIconText: React.FC<CommonIconTextProps> = ({
  icon,
  title,
  endIcon,
  sx,
  onClick,
}) => {
  return (
    <StyledBox sx={sx}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {icon && (
          <Image
            src={icon}
            alt={typeof title === "string" ? title : "icon"}
            height={24}
            width={24}
          />
        )}
        {title && <Typography variant="body1">{title}</Typography>}
      </Stack>
      {endIcon &&
        (typeof endIcon === "boolean" ? (
          <RemoveRedEyeOutlinedIcon
            onClick={onClick}
            sx={{ fontSize: "20px", cursor: "pointer" }}
          />
        ) : (
          endIcon
        ))}
    </StyledBox>
  );
};

export default CommonIconText;
