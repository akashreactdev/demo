import React from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonChip from "@/components/CommonChip";
import moment from "moment";
import CommonIconText from "@/components/CommonIconText";
interface VerificationStatusProps {
  status?: boolean | null;
  date?: string | null;
  firstDocument?: string | null;
  secondDocument?: string | null;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  date,
  firstDocument,
  secondDocument,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        Identity verification status
      </Typography>
      <Typography variant="caption" fontWeight={400}>
        Via ZorbeePay
      </Typography>
      <Stack
        mt={isMobile ? 2 : 3}
        direction={"row"}
        alignItems={"center"}
        spacing={isMobile ? 1 : 3}
      >
        <CommonChip
          title={
            status === true
              ? "Verified"
              : status === false
              ? "Failed"
              : "Pending"
          }
          textStyle={{
            color:
              status === true
                ? theme.accepted.main
                : status === false
                ? theme.declined.main
                : "",
          }}
          style={{
            backgroundColor:
              status === true
                ? theme.accepted.background.primary
                : status === false
                ? theme.declined.background.primary
                : "",
          }}
        />

        {status !== null && (
          <Box>
            <Typography variant="caption" fontWeight={400}>
              Date verified
            </Typography>
            <Typography component={"p"} variant="caption" fontWeight={500}>
              {date
                ? moment(date).format("Do MMMM YYYY | HH.mmA")
                : "N/A"}
            </Typography>
          </Box>
        )}
      </Stack>
      <Stack direction={"column"} sx={{ mt: 4 }}>
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
      </Stack>
    </CommonCard>
  );
};

export default VerificationStatus;
