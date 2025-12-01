import React from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ChevronRightSharpIcon from "@mui/icons-material/ChevronRightSharp";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ProfileCard from "@/components/Cards/Profile";
import CommonButton from "@/components/CommonButton";

interface ActiveJobProps {
  count?: string | number | undefined;
  handleViewAll?: () => void;
}

const ActiveJobs: React.FC<ActiveJobProps> = ({ count, handleViewAll }) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLaptop = useMediaQuery(theme.breakpoints.down("lg"));



  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Active jobs
      </Typography>
      <Typography variant="caption" fontWeight={400}>
        View a complete list of all active job currently assigned to this career
      </Typography>
      <Box mt={isMobile ? 2 : 4} maxWidth={isLaptop ? "100%" : "60%"}>
        <ProfileCard
          path="/assets/svg/dashboard/hospital.svg"
          alt="hospital-icons"
          title="Active jobs"
          count={count}
          description="+12% vs last 30 days"
        />
      </Box>
      <Box mt={isMobile ? 2 : 4}>
        <CommonButton
          buttonText="View all"
          variant="contained"
          onClick={handleViewAll}
          endIcon={<ChevronRightSharpIcon />}
          sx={{
            height: "40px",
            width: isMobile ? "140px" : "130px",
          }}
          buttonTextStyle={{
            fontSize: "12px  !important",
            fontWeight: 400,
          }}
        />
      </Box>
    </CommonCard>
  );
};

export default ActiveJobs;
