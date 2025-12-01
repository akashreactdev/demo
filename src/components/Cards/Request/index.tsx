"use client";
import React from "react";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

interface RequestCardProps {
  path?: string | undefined;
  title?: string;
  subtitle?: string;
  subtitle2?: React.ReactNode;
  onClickRightButton?: () => void;
}

const StyledBox = styled(Box)(() => ({
  padding: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #E2E6EB",
}));

const RequestCard: React.FC<RequestCardProps> = ({
  path,
  title,
  subtitle,
  subtitle2,
  onClickRightButton,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <StyledBox>
      <Stack direction="row" alignItems="center" spacing={2}>
        {!isMobile && path && (
          <Image src={path} alt={path} height={40} width={40} />
        )}
        <Box>
          <Typography fontWeight={500}>{title}</Typography>
          {subtitle && (
            <Typography variant="caption" component={"p"} fontWeight={400}>
              {subtitle}
            </Typography>
          )}
          {subtitle2 && (
            <Typography variant="caption" component={"p"} fontWeight={400}>
              {subtitle2}
            </Typography>
          )}
        </Box>
      </Stack>
      <KeyboardArrowRightOutlinedIcon
        sx={{ cursor: "pointer" }}
        onClick={onClickRightButton}
      />
    </StyledBox>
  );
};

export default RequestCard;
