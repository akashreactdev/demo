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
  padding: "30px",
  objectFit: "cover",
}));

const ScheduleMeetingLayout = ({ children }: { children: React.ReactNode }) => {
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
        </Box>
        <Box height={"90%"} width={"100%"} display={"flex"} mt={2}>
          <Box
            width={"100%"}
            sx={{
              overflowY: {
                xs: "scroll",
                sm: "scroll",
                md: "scroll",
                lg: "hidden",
              },
              scrollbarWidth: "thin",
              scrollBehavior: "smooth",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>

      {!isTablet && (
        <Box position={"relative"} height={"100%"} width={"35%"}>
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

export default ScheduleMeetingLayout;
