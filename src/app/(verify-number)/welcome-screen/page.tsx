"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { welcomeScreenApi } from "@/services/api/authApi";
import CircularProgress from "@mui/material/CircularProgress";

interface welcomeScreenResponse {
  data: {
    success: boolean;
    message?: string;
    data: {
      message?: string;
    };
  };
}

const WelcomeScreenPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryParams = useSearchParams();
  const [contactId, setContactId] = useState<string>("");
  const [requestAccepted, setRequestAccepted] = useState<boolean>(false);
  const [userName, setuserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const contactID = queryParams.get("contactId");
    const acceptedRequestValue = queryParams.get("isRequestAccepted");
    const name = queryParams.get("userName");
    if (contactID) {
      setContactId(contactID);
    }
    if (acceptedRequestValue !== null) {
      const booleanValue = JSON.parse(acceptedRequestValue.toLowerCase());
      setRequestAccepted(booleanValue);
    }
    if (name) {
      setuserName(name);
    }
  }, [queryParams]);
  console.log(contactId, "contactId");
  console.log(requestAccepted, "requestAccepted");
  console.log(userName, "userName");

  const handleAcceptRequest = async (
    id: string,
    acceptRequest: boolean,
    name: string
  ) => {
    setIsLoading(true);
    try {
      const response = (await welcomeScreenApi(
        id,
        acceptRequest,
        name
      )) as welcomeScreenResponse;
      console.log(response, "response");
      if (response?.data?.success) {
        setIsLoading(false);
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (queryParams && contactId && requestAccepted && userName) {
      handleAcceptRequest(contactId, requestAccepted, userName);
    }
  }, [contactId, queryParams, requestAccepted, userName]);

  return (
    <Box>
      {isLoading ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"calc(100vh - 300px)"}
        >
          <CircularProgress size={50} color={"primary"} />
        </Box>
      ) : (
        <Box>
          <Typography
            textAlign={"center"}
            fontWeight={400}
            variant={isMobile ? "h2" : "h1"}
            fontSize={"36px"}
          >
            Welcome to Zorbee Health
          </Typography>
          <Typography textAlign={"center"} variant="h6">
            Your account has been reviewed and successfully approved by our
            team.
          </Typography>
          <Stack
            sx={{
              backgroundColor: "#FDF9F3",
              mt: { sm: "36px", xs: "20px" },
              padding: { sm: "40px 60px 40px 60px", xs: "20px 40px 20px 40px" },
            }}
            gap={"23px"}
          >
            <Box textAlign={"center"}>
              <Image
                src={"/assets/svg/assessment/check_icon.svg"}
                alt={"smile_type_conversation"}
                height={95}
                width={95}
              />
            </Box>
            <Stack rowGap={"12px"}>
              <Typography variant="h6" fontSize={"23px"} fontWeight={500}>
                You’re all set!
              </Typography>
              <Typography variant="h6">
                Congratulations on joining {capitalizeFirstLetter(userName)}{" "}
                trusted contact list, you will be notified of their location and
                alerted in case of an emergency.
              </Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default WelcomeScreenPage;
