"use client";
import React from "react";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ProfileCard from "@/components/Cards/Profile";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import RequestCard from "@/components/Cards/Request";
import VerificationStatus from "@/components/carers/profile/VerificationStatus";
import CardTypeOffered from "@/components/carers/profile/CardTypeOffered";
import ProfileReferences from "@/components/carers/profile/References";
import ProfileInformation from "@/components/carers/profile/Informations";
import BankDetails from "@/components/carers/profile/BankDetails";
import Documentations from "@/components/carers/profile/Documentation";
import CompletedJobs from "@/components/carers/profile/CompletedJobs";
import ActiveJobs from "@/components/carers/profile/ActiveJobs";
import ClientList from "@/components/carers/profile/ClientList";
import PersonalBio from "@/components/carers/profile/PersonalBio";
import Specalisations from "@/components/carers/profile/Specalisations";
import Qualifications from "@/components/carers/profile/Qualifications";

const ActiveStatus = styled(Box)(({theme}) => ({
  padding: "8px 16px",
  border: `1px solid ${theme.accepted.main}`,
  backgroundColor: theme.accepted.background.primary,
  borderRadius: "8px",
}));

interface AccordionItem {
  title: string;
  type: "text" | "chip";
  content: string | string[];
}

const data = [
  {
    icon: "/assets/svg/dashboard/users.svg",
    title: "Rating",
    description: "+12% vs last 30 days",
    count: "4.5/5",
  },
  {
    icon: "/assets/svg/dashboard/hospital.svg",
    title: "Active jobs",
    description: "+12% vs last 30 days",
    count: "56",
  },
  {
    icon: "/assets/svg/dashboard/hospital.svg",
    title: "Completed jobs",
    description: "+12% vs last 30 days",
    count: "102",
  },
  {
    icon: "/assets/svg/dashboard/currency.svg",
    title: "Response rate",
    description: "+12% vs last 30 days",
    count: "98%",
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
    label: "Location",
    value: "Hertfordshire",
  },
];

const profileData: AccordionItem[] = [
  {
    title: "Experience",
    type: "text",
    content: "5 years",
  },
  {
    title: "Right to work in UK",
    type: "chip",
    content: ["Yes"],
  },
  {
    title: "Interests & hobbies",
    type: "chip",
    content: ["Art", "Music", "Gardening", "Film"],
  },
  {
    title: "Clinical duties",
    type: "chip",
    content: [
      "Wound care",
      "Condition management",
      "Vital monitoring",
      "Physical examinations",
    ],
  },
  {
    title: "Languages",
    type: "chip",
    content: ["English", "French"],
  },
];

const documents = [
  {
    title: "DBS Certificate",
    expiryDate: "11.02.2026",
    requiresApproval: false,
  },
];

const additionalDocuments = [
  {
    title: "First Aid Certification",
    requiresApproval: false,
  },
];

const Profile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
              Trent Graham
            </Typography>
          </Stack>
          {isMobile ? (
            <IconButton>
              <MoreVertSharpIcon style={{ color: theme.palette.common.black }} />
            </IconButton>
          ) : (
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Last active
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
              <IconButton>
                <MoreVertSharpIcon style={{ color: theme.palette.common.black }} />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {isMobile && (
          <Stack
            mt={1}
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
              <Typography variant="caption" fontWeight={500} color={theme.accepted.main}>
                Active
              </Typography>
            </ActiveStatus>
          </Stack>
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
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Account information
                </Typography>
                <Box mt={4}>
                  <KeyValueDetails items={account_informations} />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <VerificationStatus />
            </Box>

            <Box mt={4}>
              <Specalisations
                title="Specalisations"
                specialisations={[{ name: "test", value: 1 }]}
              />
            </Box>
            <Box mt={4}>
              <CardTypeOffered />
            </Box>

            <Box mt={4}>
              <ProfileReferences />
            </Box>

            <Box mt={4}>
              <ActiveJobs />
            </Box>

            <Box mt={4}>
              <CompletedJobs />
            </Box>

            <Box mt={4}>
              <ClientList />
            </Box>
          </Grid2>

          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <ProfileInformation
                heading="Profile Information"
                accordionData={profileData}
              />
            </Box>

            <Box mt={4}>
              <PersonalBio />
            </Box>

            <Box mt={4}>
              <Qualifications qualifications={[]} />
            </Box>

            <Box mt={4}>
              <Documentations
                documents={documents}
                additionalDocuments={additionalDocuments}
              />
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Payment requests
                </Typography>
                <Box mt={3}>
                  <RequestCard
                    path="/assets/svg/carers/profile/payment_request.svg"
                    title="Agreement#02"
                    subtitle="Client:Reuben Hale"
                    subtitle2="Requested: 15 Jan 2025"
                  />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <BankDetails descriptions="These details are locked. Unlock them to make changes." />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Profile;
