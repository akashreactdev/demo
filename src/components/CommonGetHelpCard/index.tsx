import React from "react";
import { Box, Typography } from "@mui/material";
import theme from "@/theme";

interface CommonGetHelpCardProps {
  title?: string;
  description?: string;
  DateAndTime: string;
  onClick?: () => void;
  selectedMail?: boolean;
}

const CommonGetHelpCard: React.FC<CommonGetHelpCardProps> = ({
  title,
  description,
  DateAndTime,
  onClick,
  selectedMail,
}) => {
  return (
    <Box
      sx={{
        padding: "19px 32px",
        background: selectedMail ? "#ECF2FB" : theme.palette.common.white,
        borderRadius: "10px",
        cursor: "pointer",
        border: selectedMail
          ? `1px solid #518ADD`
          : `1px solid ${theme.palette.common.white}`,
      }}
      onClick={onClick}
    >
      <Typography variant="h6" fontSize={"18px"} fontWeight={500}>
        {title}
      </Typography>
      <Typography marginTop={"6px"} fontSize={"16px"} variant="body1">
        {description}
      </Typography>
      <Typography mt={2} fontSize={"16px"}>
        {DateAndTime}
      </Typography>
    </Box>
  );
};

export default CommonGetHelpCard;
