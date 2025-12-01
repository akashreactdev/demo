import React from "react";
import { useMediaQuery, SxProps, Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronRightSharpIcon from "@mui/icons-material/ChevronRightSharp";
//relative path imports
import CommonButton from "../CommonButton";

interface ViewAllButtonProps {
  title: string;
  onClick?: () => void;
  isIcon?: boolean;
  sx?: SxProps<Theme>;
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({
  title,
  onClick,
  isIcon = true,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <CommonButton
      buttonText={title}
      variant="contained"
      endIcon={isIcon && <ChevronRightSharpIcon />}
      sx={{
        height: isMobile ? "38px !important" : "40px",
        width: "max-content",
        ...sx,
      }}
      buttonTextStyle={{
        fontSize: "12px !important",
        fontWeight: 400,
      }}
      onClick={onClick}
    />
  );
};

export default ViewAllButton;
