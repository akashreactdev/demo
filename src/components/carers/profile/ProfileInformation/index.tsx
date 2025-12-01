import React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import { Divider } from "@mui/material";
import Stack from "@mui/material/Stack";
import ApproveButton from "../ApproveButton";

interface ProfileInformationProps {
  workingStatus?: string | null;
  workInUK?: boolean | null;
  taxReferenceNo?: string | number | boolean | null;
  heading?: string | null;
  status?: boolean | null;
  onApprovalClick?: (index: string) => void;
  onRejectClick?: (index: string) => void;
  showButton?: boolean | null;
}

const RecruitmentPassportProfileInformation: React.FC<
  ProfileInformationProps
> = ({
  workingStatus,
  workInUK,
  heading,
  taxReferenceNo,
  status,
  onApprovalClick,
  onRejectClick,
  showButton = false,
}) => {
  const theme = useTheme();
  // console.log(workInUK, "data", workingStatus, heading);
  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        {heading}
      </Typography>
      <Stack direction={"column"} sx={{ mt: 4 }}>
        <Box>
          <Typography mb={1} variant="h6" fontWeight={500}>
            Current working status?
          </Typography>
          <Divider />
          <Typography mt={2} mb={1} variant="h6" fontWeight={500}>
            {workingStatus || "N/A"}
          </Typography>
        </Box>
        <Box mt={3}>
          <Typography mb={1} variant="h6" fontWeight={500}>
            Right to work in UK
          </Typography>
          <Divider />
          <Typography mt={2} mb={1} variant="h6" fontWeight={500}>
            {workInUK === true ? "Yes" : workInUK === false ? "No" : "N/A"}
          </Typography>
        </Box>
        <Box mt={3}>
          <Typography mb={1} variant="h6" fontWeight={500}>
            Tax reference number
          </Typography>
          <Divider />
          <Typography mt={2} mb={1} variant="h6" fontWeight={500}>
            {taxReferenceNo ? taxReferenceNo : "N/A"}
          </Typography>
        </Box>
      </Stack>
      {showButton && (
        <Box mt={2} sx={{ display: "flex", gap: 2 }}>
          {!status || status === null ? (
            <ApproveButton
              sx={{ backgroundColor: "#F9D835", border: "none" }}
              onClick={() => onApprovalClick && onApprovalClick("0")}
            />
          ) : (
            <ApproveButton
              title="Approved"
              sx={{
                cursor: "default",
                backgroundColor: theme.accepted.background.primary,
              }}
              buttonTextStyleSx={{ color: theme.accepted.main }}
            />
          )}
          {status === true || status === null ? (
            <ApproveButton
              title="Decline"
              onClick={() => onRejectClick && onRejectClick("0")}
            />
          ) : (
            <ApproveButton
              title="declined"
              sx={{
                cursor: "default",
                backgroundColor: theme.declined.background.primary,
              }}
              buttonTextStyleSx={{ color: theme.declined.main }}
            />
          )}
        </Box>
      )}
    </CommonCard>
  );
};

export default RecruitmentPassportProfileInformation;
