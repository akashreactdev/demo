"use client";
import React from "react";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface OverviewProps {
  path?: string;
  alt?: string;
  title?: string;
  count?: string | number | null;
}

const StyledWrapper = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  backgroundColor: theme.palette.common.white,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  height: "56px",
  width: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50px",
  backgroundColor: theme.palette.primary.main,
}));

const OverviewCard: React.FC<OverviewProps> = ({ path, title, count }) => {
  return (
    <StyledWrapper>
      {path && (
        <StyledBox>
          <Image src={path} alt={path} height={30} width={30} />
        </StyledBox>
      )}
      <Box>
        {title && <Typography variant="body2">{title}</Typography>}
        {count && <Typography variant="h4">{count}</Typography>}
      </Box>
    </StyledWrapper>
  );
};

export default OverviewCard;
