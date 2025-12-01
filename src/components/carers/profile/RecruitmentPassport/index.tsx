import React from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonChip from "@/components/CommonChip";
import CommonNoteCard from "@/components/CommonNoteCard";
import moment from "moment";
interface VerificationStatusProps {
  status?: boolean | null;
  date?: string | null;
  value?: string | null;
}

const RecruitmentPassport: React.FC<VerificationStatusProps> = ({
  status,
  date,
  value,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const getStatusDetails = () => {
    if (status === true) {
      return {
        title: "Approved",
        textColor: theme.accepted.main,
        backgroundColor: theme.accepted.background.primary,
        border: `1px solid ${theme.accepted.main}`,
      };
    } else if (status === false) {
      return {
        title: "Failed",
        textColor: theme.declined.main,
        backgroundColor: theme.declined.background.primary,
        border: `1px solid ${theme.declined.main}`,
      };
    } else {
      return {
        title: "Pending",
        textColor: theme.pending.main,
        backgroundColor: theme.pending.background.primary,
        border: `1px solid ${theme.pending.main}`,
      };
    }
  };
  const statusDetails = getStatusDetails();
  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Recruitment passport
      </Typography>
      <Typography variant="caption" fontWeight={400}>
        Here is the current status of this Zorbee recruitment passport
      </Typography>
      <Stack
        mt={isMobile ? 2 : 3}
        direction={"row"}
        alignItems={"center"}
        spacing={isMobile ? 1 : 3}
      >
        <CommonChip
          title={statusDetails.title}
          textStyle={{ color: statusDetails.textColor }}
          style={{
            backgroundColor: statusDetails.backgroundColor,
            border: statusDetails.border,
            borderRadius: "3px",
          }}
        />
        {/* {status !== null && ( */}
          <Box>
            <Typography variant="caption" fontWeight={400}>
              Date verified
            </Typography>
            <Typography component={"p"} variant="caption" fontWeight={500}>
              {date ? moment(date).format("Do MMMM YYYY | HH.mmA") : "N/A"}
            </Typography>
          </Box>
        {/* )} */}
      </Stack>
      {value && (
        <Box mt={4}>
          <Typography variant="h6" fontWeight={500}>
            Application feedback
          </Typography>
          <CommonNoteCard
            title=""
            description=""
            rows={1}
            value={value ? value : ""}
            disabled={true}
          />
        </Box>
      )}
    </CommonCard>
  );
};

export default RecruitmentPassport;
