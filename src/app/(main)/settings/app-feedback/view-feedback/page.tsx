"use client";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonNoteCard from "@/components/CommonNoteCard";

const user_information = [
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
    value: "kathlal@zorbeehealth.io",
  },
];

const ViewFeedBack = () => {
  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Details of feedback from Reuben Hale
        </Typography>
      </CommonCard>

      <Box mt={4}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                User Information
              </Typography>
              <KeyValueDetails items={user_information} />
            </CommonCard>
          </Grid2>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Feedback
              </Typography>
              <Box mt={3}>
                <CommonNoteCard title="Feedback message" rows={2} />
              </Box>
            </CommonCard>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default ViewFeedBack;
