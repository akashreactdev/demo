import React from "react";
import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CommonCard from "@/components/Cards/Common";
import CommonIconText from "@/components/CommonIconText";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import CommonButton from "@/components/CommonButton";

interface DocumentItem {
  title: string | null | undefined;
  expiryDate?: string;
  requiresApproval?: boolean;
  isApproved?: boolean | null;
  url?: string | null;
}

interface DocumentationsProps {
  documents: DocumentItem[];
  additionalDocuments?: DocumentItem[];
  onApprovalClick?: (documentType: string, index: number) => void;
  isShowButton?: boolean | null;
  onRejectClick?: (documentType: string, index: number) => void;
  isVerificationButton?: boolean | null;
}

const Insurances: React.FC<DocumentationsProps> = ({
  documents,
  additionalDocuments = [],
  onApprovalClick,
  onRejectClick,
  isShowButton,
  isVerificationButton = false,
}) => {
  const theme = useTheme();
  const handleDocumentClick = (url?: string | null) => {
    if (url) {
      const documentUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${url}`;
      window.open(documentUrl, "_blank");
    }
  };

  const renderDocument = (
    doc: DocumentItem,
    index: number,
    documentType: string
  ) => (
    <Box key={index} mt={2}>
      <CommonIconText
        icon={"/assets/svg/carers/profile/single_neutral.svg"}
        title={doc.title}
        endIcon={true}
        onClick={() => handleDocumentClick(doc.url)}
      />
      {doc?.expiryDate !== null &&
        doc.expiryDate !== undefined &&
        doc.expiryDate !== "N/A" && (
          <Box mt={2}>
            <Typography variant="body1">Document expiry date</Typography>
            <Box
              sx={{
                border: "1px solid #E2E6EB",
                paddingInline: "20px",
                height: "50px",
                width: "100%",
                mt: 1,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography>{doc.expiryDate}</Typography>
            </Box>
          </Box>
        )}
      {isShowButton && (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}
        >
          {doc.isApproved === false || doc.isApproved === null ? (
            <ApproveButton
              sx={{ backgroundColor: "#F9D835", border: "none" }}
              onClick={() =>
                onApprovalClick && onApprovalClick(documentType, index)
              }
            />
          ) : (
            <ApproveButton
              title="Approved"
              sx={{ cursor: "default", backgroundColor: "#C8E4C0" }}
              buttonTextStyleSx={{ color: "#6A9F69" }}
            />
          )}
          {doc.isApproved === true || doc.isApproved === null ? (
            <ApproveButton
              title="Decline"
              onClick={() =>
                onRejectClick && onRejectClick(documentType, index)
              }
            />
          ) : (
            <ApproveButton
              title="Declined"
              sx={{ cursor: "default", backgroundColor: "#F4A6A6" }}
              buttonTextStyleSx={{ color: "#9C3C3C" }}
            />
          )}
        </Box>
      )}
      {isVerificationButton && doc.isApproved === null && (
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
    </Box>
  );

  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Insurance
      </Typography>
      {documents.length > 0 && (
        <Box mt={5}>
          <Typography mb={1} variant="h6" fontWeight={500}>
            Insurance check
          </Typography>
          <Divider />
          {documents.map((doc, index) =>
            renderDocument(doc, index, "DBScertificate")
          )}
        </Box>
      )}

      {additionalDocuments.length > 0 && (
        <Box mt={2}>
          <Divider />
          {additionalDocuments.map((doc, index) =>
            renderDocument(doc, index, "additionalDocument")
          )}
        </Box>
      )}
    </CommonCard>
  );
};

export default Insurances;
