"use client";
import React from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Grid2, Stack, Typography } from "@mui/material";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonButton from "@/components/CommonButton";

const approval_details = [
  {
    label: "Type",
    value: "Document",
  },
  {
    label: "Date",
    value: "09 January 2025",
  },
  {
    label: "Status",
    value: "Pending",
  },
  {
    label: "Document type",
    value: "Additional documents",
  },
];

const Profile = () => {
  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Guernsey Cheshire Home
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          This shows an approval request from Guernsey Cheshire Home. Please
          find the details below.
        </Typography>
      </CommonCard>

      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, xs: 12, sm: 12 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography fontSize={"18px"} fontWeight={500}>
                Approval details
              </Typography>
              <Box sx={{ marginTop: "40px" }}>
                <KeyValueDetails items={approval_details} />
              </Box>
              <Stack
                mt={4}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                spacing={2}
                width={"100%"}
              >
                <CommonButton
                  buttonText="Decline"
                  sx={{
                    backgroundColor: "#E2E6EB",
                    maxWidth: "100px",
                    marginTop: "40px",
                  }}
                  buttonTextStyle={{ fontSize: "12px !important" }}
                />
                <CommonButton
                  buttonText="Approve"
                  sx={{ maxWidth: "100px" }}
                  buttonTextStyle={{ fontSize: "12px !important" }}
                />
              </Stack>
            </CommonCard>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, xs: 12, sm: 12 }}>
          <Box mt={4}>
            <CommonCard>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontSize={"22px"} fontWeight={500}>
                  Preview document
                </Typography>
                <DownloadIcon sx={{ height: "24px", width: "24px" }} />
              </Box>
              <Box
                sx={{
                  background: "lightgray",
                  marginTop: "33px",
                  borderRadius: "10px",
                  height: "636px",
                }}
              ></Box>
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Profile;
