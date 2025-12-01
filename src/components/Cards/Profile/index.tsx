"use client";
import React from "react";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ProfileProps {
  path?: string;
  alt?: string;
  title?: string;
  count?: string | number;
  description?: string;
}

const StyledCard = styled(Box)(({}) => ({
  borderRadius: "10px",
  padding: "22px",
  width: "100%",
  display: "flex",
  gap: "16px",
  backgroundColor: "#E2E6EB",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  height: "60px",
  width: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: theme.palette.common.white,
}));

const ProfileCard: React.FC<ProfileProps> = ({
  title,
  count,
  description,
  path,
}) => {
  return (
    <StyledCard justifyContent={"space-between"} height={"100%"}>
      <Box>
        {title && (
          <Typography variant="caption" fontWeight={400}>
            {title}
          </Typography>
        )}
        {count && (
          <Typography variant="h6" fontWeight={500}>
            {count}
          </Typography>
        )}
        {description && (
          <Typography
            component={"p"}
            variant="caption"
            color="#6A9F69"
            fontWeight={400}
          >
            {description}
          </Typography>
        )}
      </Box>
      {path && (
        <StyledBox>
          <Image src={path} alt={path} height={30} width={30} />
        </StyledBox>
      )}
    </StyledCard>
  );
};

export default ProfileCard;
