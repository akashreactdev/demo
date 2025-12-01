"use client";
import React from "react";
import { Box, Grid2, Stack, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonButton from "@/components/CommonButton";
import CommonNoteCard from "@/components/CommonNoteCard";
import {useTheme} from "@mui/material/styles";

const profile_informations = [
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
  const theme = useTheme();
  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Reuben Hale
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          This shows an approval request from Reuben Hale. Please find the
          details below.
        </Typography>
      </CommonCard>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Approval details
            </Typography>
            <Box sx={{ marginTop: "40px" }}>
              <KeyValueDetails items={profile_informations} />
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
                  backgroundColor: theme.pending.secondary,

                  maxWidth: "90px",
                  marginTop: "40px",
                }}
                buttonTextStyle={{ fontSize: "12px !important" }}
              />
              <CommonButton
                buttonText="Approve"
                sx={{ maxWidth: "90px" }}
                buttonTextStyle={{ fontSize: "12px !important" }}
              />
            </Stack>
            <Box mt={4} sx={{ marginTop: "40px" }}>
              <CommonNoteCard
                title="Internal notes"
                rows={1.2}
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              />
            </Box>
          </CommonCard>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <CommonCard>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" fontWeight={500}>
                Preview document
              </Typography>
              <DownloadIcon sx={{ height: "24px", width: "24px" }} />
            </Box>
            <Box
              sx={{
                background: "lightgray",
                marginTop: "40px",
                borderRadius: "10px",
                height: "636px",
              }}
            ></Box>
          </CommonCard>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Profile;
