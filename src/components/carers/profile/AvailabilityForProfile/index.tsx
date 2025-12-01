import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import { CareSchedule } from "@/types/carerProfileType";

interface AvailabilityProps {
  data?: CareSchedule[];
}

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  border: "1px solid #518ADD",
  borderRadius: "10px",
  marginTop: "40px",
  [theme.breakpoints.down("sm")]: {
    marginTop: "20px",
  },
}));

const StyledHeading = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  backgroundColor: "#ECF2FB",
  borderBottom: "1px solid #518ADD",
  padding: "12px",
  paddingLeft: "25px",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
}));

const StyledContent = styled(Box)(({}) => ({
  padding: "12px",
  paddingLeft: "25px",
}));

const AvailabilityForProfile: React.FC<AvailabilityProps> = ({ data }) => {
  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Availability
      </Typography>

      <Stack spacing={3} mt={3}>
        {data?.map((ele, index) => (
          <StyledBox key={index}>
            <StyledHeading>
              <Typography variant="body1" fontWeight={400}>
                {ele?.careDays?.name}
              </Typography>
            </StyledHeading>
            <StyledContent>
              {ele?.timeSlots?.map((time, index1) => (
                <Typography
                  key={index1}
                  variant="body1"
                  fontWeight={400}
                  fontSize={"12px"}
                >
                  {time?.name}
                </Typography>
              ))}
            </StyledContent>
          </StyledBox>
        ))}
      </Stack>
    </CommonCard>
  );
};

export default AvailabilityForProfile;
