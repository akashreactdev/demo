"use client";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import PersonalBio from "@/components/carers/profile/PersonalBio";
import Documentations from "@/components/carers/profile/Documentation";
import CommonNoteCard from "@/components/CommonNoteCard";
import CommonChip from "@/components/CommonChip";

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
    label: "Years of experience",
    value: "5 years",
  },
  {
    label: "Location",
    value: "Hertfordshire",
  },
];


const references = [
  {
    fullName: "Reuben Hale",
    email: "Reubenhale@shoorah.io",
    contactNo: "+44 7781 109030",
    referenceRelation: "Previous manager",
    referenceRelationDuration: "5 years",
  },
  {
    fullName: "Reuben Hale",
    email: "Reubenhale@shoorah.io",
    contactNo: "+44 7781 109030",
    referenceRelation: "Previous manager",
    referenceRelationDuration: "5 years",
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
    requiresApproval: true,
  },
];

const ViewAccount: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isAssessmentStatus, setIsAssessmentStatus] = useState<boolean>(false);

  useEffect(() => {
    setIsAssessmentStatus(true);
  }, []);

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Account Information
              </Typography>
              <Box mt={4}>
                <KeyValueDetails items={account_informations} />
              </Box>
            </CommonCard>
            <Box mt={4}>
              <CommonCard>
                <Typography fontWeight={500} variant="h6">
                  References
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  These are the carer profiles pending verification. You can
                  check the verification status, as another admin may have
                  already initiated the process.
                </Typography>
                <Box mt={3}>
                  <Box>
                    {references?.map((ele, index) => {
                      const items = [
                        {
                          label: "Name",
                          value: ele.fullName || "N/A",
                        },
                        { label: "Email", value: ele.email || "N/A" },
                        { label: "Contact No", value: ele.contactNo || "N/A" },
                        {
                          label: "How they know this person",
                          value: ele.referenceRelation || "N/A",
                        },
                        {
                          label: "How long they’ve known this person",
                          value: ele.referenceRelationDuration || "N/A",
                        },
                      ];

                      return (
                        <Box key={index} mb={3}>
                          <Typography fontWeight={500} variant="h6">
                            Reference {index + 1}
                          </Typography>
                          <Box mt={2}>
                            <KeyValueDetails items={items} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </CommonCard>
            </Box>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <Box mt={4}>
            <PersonalBio
              value={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              }
            />
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
                Assessment status
              </Typography>
              <Typography variant="caption" fontWeight={400}>
                Here is the current status of this Zorbee account assessment
              </Typography>
              <Box>
                <Stack
                  mt={isMobile ? 2 : 3}
                  direction={"row"}
                  alignItems={"center"}
                  spacing={isMobile ? 1 : 3}
                >
                  <CommonChip
                    title={isAssessmentStatus ? "Approved" : "Failed"}
                    textStyle={{
                      color: isAssessmentStatus ? theme.accepted.main : theme.declined.main,
                    }}
                    style={{
                      backgroundColor: isAssessmentStatus
                        ? theme.accepted.background.primary
                        : theme.declined.background.primary,
                    }}
                  />

                  <Box>
                    <Typography variant="caption" fontWeight={400}>
                      Date
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="caption"
                      fontWeight={500}
                    >
                      5th February 2025 | 19.30PM
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              {!isAssessmentStatus && (
                <Box mt={4}>
                  <CommonNoteCard
                    title="Assessment feedback"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                  />
                </Box>
              )}
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ViewAccount;
