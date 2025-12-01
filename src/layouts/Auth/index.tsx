"use client";
import React from "react";
import Image from "next/image";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";

const StyledWrapper = styled(Box)(() => ({
  height: "100vh",
  width: "100%",
  overflow: "hidden",
  display: "flex",
}));

const StyledImage = styled(Image)(() => ({
  position: "absolute",
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  padding : "30px",
  objectFit: "cover",
}));

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledWrapper>
      <Box
        height={"100%"}
        width={isTablet ? "100%" : "65%"}
        display="flex"
        flexDirection="column"
      >
        <Box
          height={"10%"}
          width={"100%"}
          px={6}
          display={"flex"}
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "center" : "flex-end"}
          justifyContent={isMobile ? "center" : "space-between"}
          textAlign={isMobile ? "center" : "inherit"}
          gap={isMobile ? 1 : 0}
        >
          <Box height={"100%"}>
            <Image
              src={"/assets/svg/logos/new_zorbee_health_logo.svg"}
              alt="zorbee-logo"
              height={100}
              width={200}
            />
          </Box>
          {/* <Typography variant="body2">
            Want to join Zorbee health?{" "}
            <Typography
              sx={{ cursor: "pointer", fontWeight: 500 }}
              component="span"
            >
              Sign up!
            </Typography>
          </Typography> */}
        </Box>
        <Box
          height={"90%"}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{ px: isMobile ? 3 : 0 }}
        >
          <Box width={"100%"} maxWidth={"420px"}>
            {children}
          </Box>
        </Box>
      </Box>

      {!isTablet && (
        <Box
          position={"relative"}
          height={"100%"}
          width={"35%"}
          padding={"30px"}
        >
          <StyledImage
            src={"/assets/images/hero_new.png"}
            alt="hero-image"
            layout="fill"
          />
        </Box>
      )}
    </StyledWrapper>
  );
};

export default AuthLayout;
