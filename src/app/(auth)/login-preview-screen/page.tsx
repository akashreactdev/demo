"use client";
import React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouterLoading } from "@/hooks/useRouterLoading";

const LoginPreviewScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { navigateWithLoading } = useRouterLoading();
  return (
    <Box>
      <Typography
        textAlign={"center"}
        fontWeight={500}
        variant={isMobile ? "h2" : "h1"}
        fontSize={"36px"}
      >
        Zorbee
        <Typography
          component="span"
          variant={isMobile ? "h2" : "h1"}
          fontSize={"36px"}
          fontWeight={400}
        >
          Health
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6" fontSize={"20px"}>
        The New Pulse of Digital Healthcare
      </Typography>
      <Stack flexDirection={"row"} gap={2} mt={5}>
        <Box
          component={"button"}
          sx={{
            padding: "30px",
            border: "none",
            backgroundColor: theme?.palette?.common?.white,
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            width : "50%"
          }}
          onClick={() => navigateWithLoading("/sign-in")}
        >
          <Image
            src={"/assets/svg/logos/zorbee_icon.svg"}
            alt="logo"
            height={50}
            width={50}
          />
          <Typography variant="body1" textAlign={"center"} fontWeight={500}>
            Log in to Zorbee Health Admin
          </Typography>
        </Box>
        <Box
          component="a"
          href="https://dev-pay.zorbee.io/admin/dashboard?isFromSuperAdmin=true"
          sx={{
            padding: "30px",
            border: "none",
            backgroundColor: theme?.palette?.common?.white,
            borderRadius: "10px",
            cursor: "pointer",
            color: theme?.palette?.common?.black,
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            width : "50%"
          }}
        >
          <Image
            src={"/assets/svg/logos/zorbee_icon.svg"}
            alt="logo"
            height={50}
            width={50}
          />
          <Typography variant="body1" textAlign={"center"} fontWeight={500}>
            Log in to Zorbee Pay
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoginPreviewScreen;
