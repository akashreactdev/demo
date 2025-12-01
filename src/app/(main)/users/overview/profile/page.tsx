"use client";
import React from "react";
import Image from "next/image";
import {
  Box,
  Grid2,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
//relative path imorts
import ProfileCard from "@/components/Cards/Profile";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonCard from "@/components/Cards/Common";
import RequestCard from "@/components/Cards/Request";
import DownloadDocumentButton from "@/components/DownloadDocumentBtn";
import ViewAllButton from "@/components/ViewAllButton";
import { useRouterLoading } from "@/hooks/useRouterLoading";

const ActiveStatus = styled(Box)(({theme}) => ({
  padding: "8px 16px",
  border: `1px solid ${theme.accepted.main}`,
  backgroundColor: theme.accepted.background.primary,
  borderRadius: "8px",
}));

const data = [
  {
    icon: "/assets/svg/dashboard/users.svg",
    title: "Overall bookings",
    count: "12",
  },
  {
    icon: "/assets/svg/dashboard/hospital.svg",
    title: "Active agreements",
    count: "2",
  },
  {
    icon: "/assets/svg/dashboard/hospital.svg",
    title: "Total saftey alerts",
    count: "2",
  },
  {
    icon: "/assets/svg/dashboard/currency.svg",
    title: "Support tickets",
    count: "N/A",
  },
];

const account_informations = [
  {
    label: "Title",
    value: "Mr",
  },
  {
    label: "Name",
    value: "Reuben Hale",
  },
  {
    label: "Date of birth",
    value: "9th January 2000",
  },
  {
    label: "Email",
    value: "Reubenhale@shoorah.io",
  },
  {
    label: "Gender",
    value: "Male",
  },
  {
    label: "Address",
    value: "Hertfordshire",
  },
  {
    label: "Login method",
    value: "Email",
  },
];

const cardData = [
  {
    title: "Care plan",
    description:
      "View this user's care plan, which has been created by them and not by the carer or clinician.",
    buttontext: "View care plan",
    redirectionRoute:
      "/carers/overview/profile/trent-graham/client-list/care-plan",
  },
  {
    title: "Medical history",
    description:
      "View this user's medical history, which has been created by them and not by the carer or clinician.",
    buttontext: "View medical history",
    redirectionRoute:
      "/carers/overview/profile/trent-graham/client-list/medical-history",
  },
  {
    title: "Medication log",
    description:
      "View all the medication that has been administered by the carer/clinician, along with any scanned prescriptions provided by the user.",
    buttontext: "View medication log",
    redirectionRoute:
      "/carers/overview/profile/trent-graham/client-list/medication-log",
  },
  {
    title: "Health report",
    description:
      "View this user's health report. This data can be manually entered by the user, carer/clinician, or collected via a wearable device.",
    buttontext: "View health report",
    redirectionRoute:
      "/carers/overview/profile/trent-graham/client-list/health-report",
  },
];

const Profile = () => {
  const theme = useTheme();
const { navigateWithLoading } = useRouterLoading();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleActionItemClick = () => {
    navigateWithLoading("/users/overview/profile/service-agreement");
  };

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Image
              src={`/assets/images/profile.jpg`}
              alt="user-profile-pic"
              height={60}
              width={60}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="h6" fontWeight={500}>
              Reuben Hale
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            {!isTablet && (
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  5th February 2025
                </Typography>
              </Box>
            )}
            {!isTablet && (
              <ActiveStatus>
                <Typography
                  variant="caption"
                  fontWeight={500}
                  color={theme.accepted.main}
                >
                  Active
                </Typography>
              </ActiveStatus>
            )}
            {!isTablet && (
              <DownloadDocumentButton title="Download user report" />
            )}
            <IconButton>
              <MoreVertSharpIcon style={{ color: theme.palette.common.black }} />
            </IconButton>
          </Stack>
        </Stack>

        {isTablet && !isMobile && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  5th February 2025
                </Typography>
              </Box>
              <ActiveStatus>
                <Typography
                  variant="caption"
                  fontWeight={500}
                  color={theme.accepted.main}
                >
                  Active
                </Typography>
              </ActiveStatus>
            </Stack>
            <DownloadDocumentButton title="Download user report" />
          </Stack>
        )}

        {isMobile && (
          <Box mt={2}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              spacing={2}
            >
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  5th February 2025
                </Typography>
              </Box>
              <ActiveStatus>
                <Typography
                  variant="caption"
                  fontWeight={500}
                  color={theme.accepted.main}
                >
                  Active
                </Typography>
              </ActiveStatus>
            </Stack>
            <DownloadDocumentButton title="Download user report" />
          </Box>
        )}

        <Box mt={4} width={"100%"}>
          <Grid2 container spacing={2}>
            {data.map((ele, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ lg: 3, xl: 3, md: 6, sm: 6, xs: 12 }}
                >
                  <ProfileCard
                    path={ele.icon}
                    alt={ele.icon}
                    title={ele.title}
                    count={ele.count}
                  />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </CommonCard>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Account information
              </Typography>
              <Box mt={5}>
                <KeyValueDetails items={account_informations} />
              </Box>
              <Typography
                fontSize={"12px"}
                mt={5}
                sx={{ textDecorationLine: "underline" }}
              >
                Edit information
              </Typography>
            </CommonCard>
          </Box>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Active service agreements
              </Typography>
              <Box mt={4}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                  onClickRightButton={handleActionItemClick}
                />
              </Box>
              <Box mt={3}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                  onClickRightButton={handleActionItemClick}
                />
              </Box>
            </CommonCard>
          </Box>

          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Completed service agreements
              </Typography>
              <Box mt={4}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                />
              </Box>
              <Box mt={3}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                />
              </Box>
              <Box mt={3}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                />
              </Box>
              <Box mt={4}>
                <ViewAllButton title="View all" />
              </Box>
            </CommonCard>
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          {cardData.map((ele, index) => (
            <Box key={index}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  {ele.title}
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  {ele.description}
                </Typography>
                <Box mt={4}>
                  <ViewAllButton
                    title={ele.buttontext}
                    onClick={() => {
                      navigateWithLoading(ele.redirectionRoute);
                    }}
                  />
                </Box>
              </CommonCard>
            </Box>
          ))}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Profile;
