"use client";
import React from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const ThanksScreenPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box>
      <Typography
        textAlign={"left"}
        fontWeight={500}
        variant={isMobile ? "h2" : "h1"}
        fontSize={"32px"}
      >
        Thank you...
      </Typography>
      <Stack
        sx={{
          backgroundColor: "#FDF9F3",
          mt: { sm: "36px", xs: "20px" },
          padding: { sm: "40px 60px 40px 60px", xs: "20px 40px 20px 40px" },
          borderRadius: "15px",
        }}
        gap={"23px"}
      >
        <Typography variant="h6">
          ...for considering Reuben’s request to become a Trusted Contact.
          You’ve chosen not to be added as a Trusted Contact for Reuben at this
          time.
        </Typography>
      </Stack>
    </Box>
  );
};

export default ThanksScreenPage;
