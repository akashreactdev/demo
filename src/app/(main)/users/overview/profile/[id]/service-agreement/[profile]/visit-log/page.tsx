"use client";
import React from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonChip from "@/components/CommonChip";
import CommonConfirmation from "@/components/CommonConfirmation";
import CommonNoteCard from "@/components/CommonNoteCard";
import { information } from "@/constants/profile";

const visit_information = [
  {
    label: "Date of visit",
    value: "9th January 2000",
  },
  {
    label: "Time of visit",
    value: "09:30AM",
  },
  {
    label: "Time of visit ended",
    value: "10:30AM",
  },
];

const carer_information = [
  {
    label: "Title",
    value: "Mr",
  },
  {
    label: "Name",
    value: "Lorri Haines",
  },
  {
    label: "Date of birth",
    value: "9th January 1960",
  },
  {
    label: "Location",
    value: "Heartfordshire",
  },
];

const VisitLog = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Visit log #03
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          You are currently previewing a visit log. Please find the details
          below.
        </Typography>
      </CommonCard>

      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Client information
                </Typography>
                <Box mt={2}>
                  <KeyValueDetails items={information} />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Sign off status
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  This indicates whether the client agreed to or declined the
                  visit.
                </Typography>
                <Box>
                  <Stack
                    mt={isMobile ? 2 : 3}
                    direction={"row"}
                    alignItems={"center"}
                    spacing={isMobile ? 1 : 3}
                  >
                    <CommonChip
                      title="Declined"
                      textStyle={{ color: "#9C3C3C" }}
                      style={{ backgroundColor: "#F4A6A6" }}
                    />
                    <Box>
                      <Typography variant="caption" fontWeight={400}>
                        Date verified
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

                <Box mt={4}>
                  <CommonConfirmation
                    question="Did the carer attend this visit?"
                    options={["Yes", "No"]}
                    onSelect={(answer: string) =>
                      console.log("Selected:", answer)
                    }
                    sx={{ padding: isMobile ? "7px 20px" : "7px 40px" }}
                  />
                </Box>

                <Box mt={4}>
                  <CommonNoteCard
                    title="Reason"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                  />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Carer information
                </Typography>
                <Box mt={2}>
                  <KeyValueDetails items={carer_information} />
                </Box>
              </CommonCard>
            </Box>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Visit information
                </Typography>

                <Box mt={2}>
                  <KeyValueDetails items={visit_information} />
                </Box>

                <Box mt={2}>
                  <CommonNoteCard
                    title="Notes from carer"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
                  />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default VisitLog;
