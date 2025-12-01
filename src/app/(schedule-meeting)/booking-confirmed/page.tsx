"use client";
import React, { useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";

const BookingConfirmation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  return (
    <Box sx={{ padding: isMobile ? "30px" : "30px 50px" }}>
      {!isCompleted ? (
        <Box>
          <Stack>
            <Typography fontWeight={400} variant={isMobile ? "h2" : "h1"}>
              Interview confirmed
            </Typography>
            <Typography variant="h6">
              We’re looking forward to meeting you!
            </Typography>
          </Stack>
          <Stack mt={4} spacing={2}>
            <Typography fontWeight={400} variant={"h4"}>
              Thank you for booking your interview.
            </Typography>
            <Typography variant={"body1"}>
              Your PEAP Expert Interview at 10:30am on 08th May 2025 has been
              scheduled.
            </Typography>
          </Stack>
          <Stack mt={3} spacing={2}>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <Image
                src={"/assets/svg/schedule-meeting/projector_meeting.svg"}
                alt={"smile_type_conversation"}
                height={50}
                width={50}
                style={{
                  backgroundColor: "#F9D835",
                  padding: "12px",
                  borderRadius: "50px",
                }}
              />
              <Typography
                variant={"caption"}
                fontSize={"14px"}
                fontWeight={"400"}
              >
                Peap expert interview
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <Image
                src={"/assets/svg/schedule-meeting/calendar.svg"}
                alt={"smile_type_conversation"}
                height={50}
                width={50}
                style={{
                  backgroundColor: "#F9D835",
                  padding: "12px",
                  borderRadius: "50px",
                }}
              />
              <Typography
                variant={"caption"}
                fontSize={"14px"}
                fontWeight={"400"}
              >
                Fri, 24th Sep 2024
                <br />
                10:30am - 11:00am (GMT -UK)
              </Typography>
            </Stack>
            <Box
              display={"flex"}
              justifyContent={"start"}
              alignItems={"center"}
              width={"max-content"}
              sx={{ cursor: "pointer" }}
            >
              <Typography
                variant={"caption"}
                fontSize={"14px"}
                fontWeight={"400"}
                color="#F9D835"
              >
                Peap expert interview
              </Typography>
              <ArrowRightAltIcon sx={{ color: "#F9D835" }} />
            </Box>
          </Stack>
          <CommonCard sx={{ maxWidth: "500px", padding: "20px", mt: "15px" }}>
            <Typography variant={"body1"} fontSize={"14px"} fontWeight={"400"}>
              Thank you for scheduling your interview with us! We look forward
              to discussing your potential role and answering any questions you
              may have.
            </Typography>
            <Typography
              variant={"body1"}
              mt={2}
              fontSize={"14px"}
              fontWeight={"400"}
            >
              If you need assistance before the meeting, feel free to reach out
              to us at info@shoorah.io, and our team will be happy to help.
            </Typography>
          </CommonCard>
          <Stack direction={"row"} justifyContent={"end"} marginTop={3}>
            <Box width={"max-content"}>
              <CommonButton
                buttonText="Complete"
                onClick={() => setIsCompleted(true)}
              />
            </Box>
          </Stack>
        </Box>
      ) : (
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          height={`calc(100vh - 200px)`}
        >
          <Stack>
            <Typography fontWeight={400} variant={isMobile ? "h2" : "h1"}>
              Interview Confirmed
            </Typography>
            <Typography
              variant="caption"
              textAlign={"center"}
              fontSize={"18px"}
              fontWeight={"400"}
            >
              Congratulations!
            </Typography>
          </Stack>
          <CommonCard
            sx={{
              maxWidth: "500px",
              padding: "20px",
              mt: "30px",
              textAlign: "center",
            }}
          >
            <Image
              src={"/assets/svg/schedule-meeting/checkmark.svg"}
              alt={"smile_type_conversation"}
              height={80}
              width={80}
              style={{
                backgroundColor: "#F9D835",
                padding: "12px",
                borderRadius: "50px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            />
            <Typography
              variant={"body1"}
              fontSize={"14px"}
              fontWeight={"400"}
              mt={2}
            >
              Your PEAP expert interview with one of our Shoorah staff members
              has been successfully booked!
            </Typography>
            <Typography
              variant={"body1"}
              fontSize={"14px"}
              fontWeight={"400"}
              mt={2}
            >
              You should have received a confirmation email with your selected
              date and time. We look forward to meeting you!
            </Typography>
          </CommonCard>
        </Stack>
      )}
    </Box>
  );
};

export default BookingConfirmation;
