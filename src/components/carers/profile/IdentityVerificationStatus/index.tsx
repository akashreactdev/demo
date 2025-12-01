import React from "react";
import { Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonIconText from "@/components/CommonIconText";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import CommonButton from "@/components/CommonButton";
interface VerificationStatusProps {
  status?: boolean | null;
  date?: string | null;
  firstDocument?: string | null;
  secondDocument?: string | null;
  onApprovalClick?: (index: string) => void;
  onRejectClick?: (index: string) => void;
  showButton?: boolean | null;
  documentType?: string | null;
  isVerification?: boolean | null;
  isIdFrontApproved?: boolean | null;
  isIdBackApproved?: boolean | null;
}

const IdentityVerificationStatus: React.FC<VerificationStatusProps> = ({
  firstDocument,
  secondDocument,
  status,
  onApprovalClick,
  onRejectClick,
  showButton = false,
  documentType,
  isVerification = false,
  isIdFrontApproved,
  isIdBackApproved,
}) => {
  const theme = useTheme();

  const cleanFileName = (document?: string | null) => {
    const fullPath = document;
    const lastSegment = (fullPath && fullPath.split("/document/").pop()) || "";
    const match = lastSegment.match(/^(.+?\.[a-zA-Z0-9]{2,5})/);
    return match ? match[1] : lastSegment;
  };

  const handleDocumentClick = (url?: string | null) => {
    if (url) {
      const documentUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${url}`;
      window.open(documentUrl, "_blank");
    }
  };
  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Identity verification
      </Typography>
      <Stack direction={"column"} sx={{ mt: 4 }}>
        <Box mb={3}>
          <Typography mb={1} variant="h6" fontWeight={500}>
            Document type
          </Typography>
          <Divider />
        </Box>
        <Typography mb={2} variant="h6" fontWeight={500}>
          {documentType || "N/A"}
        </Typography>
        {firstDocument && (
          <CommonIconText
            icon={"/assets/svg/carers/profile/single_neutral.svg"}
            title={
              cleanFileName(firstDocument).length > 30
                ? cleanFileName(firstDocument).slice(0, 30) + "..."
                : cleanFileName(firstDocument)
            }
            endIcon={true}
            onClick={() => handleDocumentClick(firstDocument)}
          />
        )}
        {isVerification && isIdFrontApproved === null && (
          <Box mt={2}>
            <CommonButton
              buttonText="Pending verification"
              sx={{
                cursor: "default",
                width: "max-content",
                height: "35px",
                backgroundColor: theme.declined.background.primary,
              }}
              buttonTextStyle={{ color: theme.declined.main, fontSize: "12px" }}
              startIcon={
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: theme.declined.main }}
                />
              }
            />
          </Box>
        )}
        {secondDocument && (
          <CommonIconText
            icon={"/assets/svg/carers/profile/single_neutral.svg"}
            title={
              cleanFileName(secondDocument).length > 30
                ? cleanFileName(secondDocument).slice(0, 30) + "..."
                : cleanFileName(secondDocument)
            }
            endIcon={true}
            onClick={() => handleDocumentClick(secondDocument)}
            sx={{ mt: 2 }}
          />
        )}
        {isVerification && isIdBackApproved === null && (
          <Box mt={2}>
            <CommonButton
              buttonText="Pending verification"
              sx={{
                cursor: "default",
                width: "max-content",
                height: "35px",
                backgroundColor: theme.declined.background.primary,
              }}
              buttonTextStyle={{ color: theme.declined.main, fontSize: "12px" }}
              startIcon={
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: theme.declined.main }}
                />
              }
            />
          </Box>
        )}
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
              title="Declined"
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

export default IdentityVerificationStatus;
