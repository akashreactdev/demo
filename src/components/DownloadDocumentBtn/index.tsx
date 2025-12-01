import React from "react";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
//relative path imports
import CommonButton from "../CommonButton";

interface DocumentButtonProps {
  title: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const DownloadDocumentButton: React.FC<DocumentButtonProps> = ({
  title,
  onClick,
  isLoading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <CommonButton
      buttonText={title}
      variant="contained"
      startIcon={
        isLoading ? (
          <CircularProgress size={18} sx={{ color: "#000", mr: 1 }} />
        ) : (
          <FileDownloadOutlinedIcon />
        )
      }
      onClick={onClick}
      sx={{
        height: "40px",
        width: isMobile ? "100% !important" : "max-content !important",
        backgroundColor: "#E2E6EB",
        marginTop: isMobile ? "16px" : "0",
      }}
      buttonTextStyle={{ fontSize: "12px !important", fontWeight: 400 }}
    />
  );
};

export default DownloadDocumentButton;
