"use client";
import React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import { Button, IconButton, Stack, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import Specalisations from "@/components/carers/profile/Specalisations";
import ProfileCard from "@/components/Cards/Profile";
import CommonNoteCard from "@/components/CommonNoteCard";
import TeamMemberCard from "@/components/TeamMemberCard";
import Documentation from "@/components/carers/Documentation";
import CommonChip from "@/components/CommonChip";
import { useRouterLoading } from "@/hooks/useRouterLoading";

const ActiveStatus = styled(Box)(({}) => ({
  padding: "8px 16px",
  border: "1px solid #6A9F69",
  backgroundColor: "#C8E4C0",
  borderRadius: "8px",
}));

const documents = [
  {
    title: "DBS Certificate",
    requiresApproval: true,
  },
  {
    title: "DBS Certificate",
    requiresApproval: true,
  },
];

const data = [
  {
    icon: "/assets/svg/dashboard/users.svg",
    title: "Engagement rate",
    description: "+12% vs last 30 days",
    count: "98%",
  },
  {
    icon: "/assets/svg/dashboard/hospital.svg",
    title: "Response Rate",
    description: "+12% vs last 30 days",
    count: "98%",
  },
  {
    icon: "/assets/svg/provider/profile/Calendar-1--Streamline-Ultimate.svg",
    title: "Pricing",
    description: "+12% vs last 30 days",
    count: "£1200/Week",
  },
  {
    icon: "/assets/svg/dashboard/currency.svg",
    title: "Availability status",
    description: "+12% vs last 30 days",
    count: "Yes",
  },
];

const provider_informations = [
  {
    label: "Business name",
    value: "Guernsey Cheshire Home",
  },
  {
    label: "Contact number",
    value: "+44 7781 109030",
  },
  {
    label: "Email",
    value: "guernsey@care.gg",
  },
  {
    label: "Address",
    value: "Rohais, Guernsey, GY1 1FB",
  },
  {
    label: "AddrService area",
    value: "5 mile radiusess",
  },
];

const Profile: React.FC = () => {
const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Typography variant="h6" fontWeight={500}>
              Guernsey Cheshire Home | Care home
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            {!isMobile && (
              <>
                <Box>
                  <Typography variant="caption" fontWeight={400}>
                    Last active
                  </Typography>
                  <Typography
                    component={"p"}
                    variant="caption"
                    fontWeight={500}
                  >
                    5th February 2025
                  </Typography>
                </Box>
                <ActiveStatus>
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    color={"#6A9F69"}
                  >
                    Active
                  </Typography>
                </ActiveStatus>
              </>
            )}
            <IconButton>
              <MoreVertSharpIcon style={{ color: "#000000" }} />
            </IconButton>
          </Stack>
        </Stack>

        {isMobile && (
          <Stack
            mt={2}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box>
              <Typography variant="caption" fontWeight={400}>
                Last active
              </Typography>
              <Typography component={"p"} variant="caption" fontWeight={500}>
                5th February 2025
              </Typography>
            </Box>
            <ActiveStatus>
              <Typography variant="caption" fontWeight={500} color={"#6A9F69"}>
                Active
              </Typography>
            </ActiveStatus>
          </Stack>
        )}

        <Box mt={4} width={"100%"} height={"100%"}>
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
                    description={ele.description}
                  />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </CommonCard>

      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Provider information
                </Typography>

                <Box mt={4}>
                  <Image
                    src={"/assets/images/Rectangle.jpg"}
                    alt="profile-pic"
                    height={182}
                    width={182}
                  />
                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecorationLine: "underline",
                      mt: 1,
                    }}
                  >
                    Replace logo
                  </Typography>
                  <Box mt={2}>
                    <ApproveButton />
                  </Box>

                  <Box mt={4}>
                    <KeyValueDetails items={provider_informations} />
                  </Box>
                </Box>
                <Box mt={4}>
                  <Typography variant="h6" fontWeight={500}>
                    About
                  </Typography>
                  <Typography
                    mb={2}
                    variant="subtitle2"
                    fontSize={"12px"}
                    fontWeight={500}
                  >
                    This is the providers description of their service(s).
                  </Typography>
                  <CommonNoteCard value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <Specalisations
                title="Services"
                specialisations={[{name : "Residential Care", value: 1}]}
              />
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={500}>
                    Team members
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() =>
                      navigateWithLoading("/providers/overview/team-members")
                    }
                    sx={{ color: "black" }}
                  >
                    View all
                  </Button>
                </Box>
                {[1, 2].map((ele, index) => {
                  return (
                    <Box key={index}>
                      <TeamMemberCard
                        name={"Reuben Hale"}
                        jobRole={"Nurse"}
                        email={"Reubenhale@care.gg"}
                        status={"Active"}
                        permission={"Admin"}
                      />
                    </Box>
                  );
                })}
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box mt={4}>
              <Documentation Documentations={documents} />
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Pricing
                </Typography>
                <Box mt={"22px"} sx={{ display: "flex", gap: 2 }}>
                  <img
                    src="/assets/svg/carers/overview/currency_pound.svg"
                    alt="currency pound"
                    height={20}
                    width={20}
                  />
                  <Typography>£1200 per week</Typography>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Availability
                </Typography>

                <Box mt={3}>
                  <Typography mb={2} fontSize={"12px"}>
                    Do they currently have availability?
                  </Typography>
                  <CommonChip title={"Yes"} variant="primary" />
                </Box>
                <Box mt={3}>
                  <Typography mb={2} fontSize={"12px"}>
                    Vacant beds
                  </Typography>
                  <CommonChip title={"20"} variant="primary" />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Provider video
                </Typography>
                <Box
                  mt={4}
                  sx={{
                    background: "#E2E6EB",
                    height: "309px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <img
                    src="/On-Error-Sad--Streamline-Ultimate.svg"
                    alt="img"
                    height={"50px"}
                    width={"50px"}
                  />
                  <Typography mt={1} maxWidth={"120px"} fontSize={"12px"}>
                    The provider has not added a video.
                  </Typography>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={2}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Header image
                </Typography>

                <Box mt={4}>
                  <img
                    src="/assets/images/RectangleFullImg.jpg"
                    alt="profile-pic"
                    width={"100%"}
                  />
                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecorationLine: "underline",
                      mt: 1,
                    }}
                  >
                    Replace image
                  </Typography>
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      <Box mt={4}>
        <CommonCard>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={500}>
              Image gallery
            </Typography>
            <Button
              sx={{
                fontSize: "20px",
                border: "1px solid #518ADD",
                background: "#ECF2FB",
                padding: "0px 20px !important",
                color: "#518ADD",
              }}
            >
              +
            </Button>
          </Box>
          <Grid2 container spacing={8} mt={4}>
            {/* <Box sx={{display:"flex" , justifyContent:"space-between" }}> */}
            <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
              <img
                src="/assets/images/RectangleFullImg.jpg"
                alt="profile-pic"
                width={"100%"}
              />
              <Typography
                sx={{
                  cursor: "pointer",
                  textDecorationLine: "underline",
                  mt: 1,
                }}
              >
                Replace image
              </Typography>
            </Grid2>
            <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
              <img
                src="/assets/images/RectangleFullImg.jpg"
                alt="profile-pic"
                width={"100%"}
              />
              <Typography
                sx={{
                  cursor: "pointer",
                  textDecorationLine: "underline",
                  mt: 1,
                }}
              >
                Replace image
              </Typography>
            </Grid2>
          </Grid2>
          {/* </Box> */}
        </CommonCard>
      </Box>
    </Box>
  );
};

export default Profile;
