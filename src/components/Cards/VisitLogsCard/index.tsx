"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const StyledWrapper = styled(Box)(({}) => ({
  border: "1px solid #E2E6EB",
  borderRadius: "10px",
  padding: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

interface VisitLogsProps {
  title: string;
  date: string;
  time: string;
  onClick?: () => void;
  sx?: React.CSSProperties;
}

const VisitLogsCard: React.FC<VisitLogsProps> = ({
  title,
  date,
  time,
  onClick,
  sx,
}) => {
  return (
    <StyledWrapper sx={sx}>
      <Box>
        {title && (
          <Typography variant="body1" fontWeight={500}>
            {title}
          </Typography>
        )}
        {date && (
          <Typography variant="caption" component={"p"} fontWeight={400}>
            Date of visit: {date}
          </Typography>
        )}
        {time && (
          <Typography variant="caption" component={"p"} fontWeight={400}>
            Time:{time}
          </Typography>
        )}
      </Box>
      <ChevronRightIcon onClick={onClick} sx={{ cursor: "pointer" }} />
    </StyledWrapper>
  );
};

export default VisitLogsCard;
