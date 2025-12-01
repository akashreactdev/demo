import React from "react";
import CommonButton from "@/components/CommonButton";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SxProps, Theme } from "@mui/material";

interface ApproveButtonProps {
  title?: string;
  onClick?: () => void;
  variant?: string;
  sx?: SxProps<Theme>;
  buttonTextStyleSx?: React.CSSProperties;
}

const ApproveButton: React.FC<ApproveButtonProps> = ({
  title,
  onClick,
  variant,
  sx = {},
  buttonTextStyleSx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <CommonButton
      onClick={onClick}
      buttonText={title || "Approve"}
      sx={{
        border: "1px solid #E2E6EB",
        backgroundColor:
          variant === "primary" ? theme.palette.primary.main : "#E2E6EB",
        height: isMobile ? "28px !important" : "30px !important",
        width: "max-content",
        ...sx,
      }}
      buttonTextStyle={{
        fontSize: "12px !important",
        fontWeight: 400,
        ...buttonTextStyleSx,
      }}
    />
  );
};

export default ApproveButton;
