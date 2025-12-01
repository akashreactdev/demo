"use client";
import React, { useState } from "react";
import moment from "moment";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CommonButton from "@/components/CommonButton";
import { useRouterLoading } from "@/hooks/useRouterLoading";

const ScheduleMeeting: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTime, setSelectedTime] = useState<string | null>("08:45 am");

  const timeSlots = [
    "08:45 am",
    "09:30 am",
    "10:00 am",
    "11:45 am",
    "12:30 pm",
    "01:00 pm",
    "02:00 pm",
    "02:30 pm",
    "03:45 pm",
  ];

  return (
    <Box sx={{ padding: isMobile ? "30px" : "50px" }}>
      <Stack>
        <Typography fontWeight={400} variant={isMobile ? "h2" : "h1"}>
          Book your interview
        </Typography>
        <Typography variant="h6">
          Congratulations! You’ve been invited to an interview
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
        justifyContent={"center"}
        marginTop={"30px"}
        gap={4}
        width={"100%"}
        alignItems={{ md: "center", sm: "center", xs: "center" }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <StaticDatePicker
            defaultValue={moment()}
            slotProps={{ actionBar: { actions: [] } }}
            sx={{
              width: "max-content",
              borderRadius: "10px",
              paddingTop: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .MuiPaper-root": {
                borderRadius: "10px",
              },
              "& .MuiPickersToolbar-root": {
                display: "none",
              },
            }}
          />
          <Stack
            justifyContent={"center"}
            alignItems={{ md: "center", lg: "flex-start" }}
          >
            <Typography variant="h2" fontWeight={400}>
              Pick a time
            </Typography>
            <Grid2
              container
              maxWidth={"400px"}
              rowSpacing={3}
              columnSpacing={3}
              marginTop={"30px"}
            >
              {timeSlots.map((time, index) => (
                <Grid2 key={index} size={{ lg: 4, xl: 4, md: 4, sm: 4, xs: 6 }}>
                  <Box>
                    <CommonButton
                      buttonText={time}
                      buttonTextStyle={{ fontSize: "16px", fontWeight: "500" }}
                      sx={{
                        borderRadius: "50px",
                        backgroundColor:
                          time === selectedTime ? "#F9D835" : "#eceef2",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedTime(time)}
                    />
                  </Box>
                </Grid2>
              ))}
            </Grid2>
            <Typography variant="caption" marginTop={"30px"}>
              *All times are in Greenwich Mean Time (GMT) – UK
            </Typography>
          </Stack>
        </LocalizationProvider>
      </Stack>
      <Stack direction={"row"} justifyContent={"end"} marginTop={4}>
        <Box width={"max-content"}>
          <CommonButton
            buttonText="Book & complete"
            onClick={() => navigateWithLoading("/booking-confirmed")}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default ScheduleMeeting;
