"use client";
import React from "react";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  border: "1px solid #518ADD",
  borderRadius: "10px",
  marginTop: "40px",
  [theme.breakpoints.down("sm")]: {
    marginTop: "20px",
  },
}));

const StyledHeading = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  backgroundColor: "#ECF2FB",
  borderBottom: "1px solid #518ADD",
  padding: "12px",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
}));

const StyledContent = styled(Box)(({}) => ({
  padding: "12px",
}));

const StyledInputBox = styled(Box)(({}) => ({
  border: "1px solid #E2E6EB",
  padding: "10px",
  borderRadius: "10px",
  width: "120px",
}));

interface CareTypeProps {
  path: string;
  heading: string;
  title: string;
  ratePerHours?: number | string | null;
  ratePerWeek?: number | string | null;
  walkingRate?: number | string | null;
}

const CareType: React.FC<CareTypeProps> = ({
  path,
  heading,
  title,
  ratePerHours,
  ratePerWeek,
  walkingRate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isAllEmpty = (
    (!ratePerHours || ratePerHours === "" || ratePerHours === null) &&
    (!ratePerWeek || ratePerWeek === "" || ratePerWeek === null) &&
    (!walkingRate || walkingRate === "" || walkingRate === null)
  );

  if (isAllEmpty) {
    return null;
  }

  return (
    <StyledBox>
      <StyledHeading>
        <Image src={path} alt={heading} height={24} width={24} />
        <Typography variant="body1" fontWeight={400}>
          {heading}
        </Typography>
      </StyledHeading>
      <StyledContent>
        <Typography variant="body1" fontWeight={500}>
          {title}
        </Typography>
        <Box mt={2}>
          <Box>
            {ratePerHours !== null && ratePerHours !== "" && (
            heading === "Overnight care" ? (
              <Stack direction={"row"} mt={2} alignItems={"center"} spacing={3}>
                <StyledInputBox>
                  <Typography variant="body1">£{ratePerHours ?? 0}</Typography>
                </StyledInputBox>
                <Typography variant="body1" fontWeight={500}>
                  £/hour per {!isMobile && <br />} 8 hours
                </Typography>
              </Stack>
            ) : (
              <Stack direction={"row"} alignItems={"center"} spacing={3}>
                <StyledInputBox>
                  <Typography variant="body1">£{ratePerHours ?? 0}</Typography>
                </StyledInputBox>
                <Typography variant="body1" fontWeight={500}>
                  £/hour
                </Typography>
              </Stack>
            ))}
            {ratePerWeek !== null && ratePerWeek !== "" && (
              <Stack mt={2} direction={"row"} alignItems={"center"} spacing={3}>
                <StyledInputBox>
                  <Typography variant="body1">£{ratePerWeek ?? 0}</Typography>
                </StyledInputBox>
                <Typography variant="body1" fontWeight={500}>
                  £/week
                </Typography>
              </Stack>
            )}
            {walkingRate !== null && walkingRate !== "" && (
              <Stack mt={2} direction={"row"} alignItems={"center"} spacing={3}>
                <StyledInputBox>
                  <Typography variant="body1">£{walkingRate ?? 0}</Typography>
                </StyledInputBox>
                <Typography variant="body1" fontWeight={500}>
                  £/ rate per hour {!isMobile && <br />}
                  (waking)
                </Typography>
              </Stack>
            )}
          </Box>
        </Box>
      </StyledContent>
    </StyledBox>
  );
};

export default CareType;
