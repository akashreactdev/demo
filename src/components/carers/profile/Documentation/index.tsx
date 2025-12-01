import React from "react";
import { Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CommonCard from "@/components/Cards/Common";
import CommonIconText from "@/components/CommonIconText";
import ApproveButton from "../ApproveButton";
import CommonButton from "@/components/CommonButton";

interface DocumentItem {
  title: string | null | undefined;
  expiryDate?: string;
  requiresApproval?: boolean;
  isApproved?: boolean | null;
  url?: string | null;
  header?: string | null;
  key?: string | null;
}

interface DocumentationsProps {
  documents: DocumentItem[];
  additionalDocuments?: DocumentItem[];
  identificationDocuments?: DocumentItem[];
  onApprovalClick?: (documentType: string, index: number) => void;
  isShowButton?: boolean | null;
  onRejectClick?: (documentType: string, index: number) => void;
  documentType?: string | number | null;
  isDocumentVerification?: boolean | null;
}

const Documentations: React.FC<DocumentationsProps> = ({
  documents,
  additionalDocuments = [],
  onApprovalClick,
  identificationDocuments = [],
  onRejectClick,
  isShowButton,
  documentType,
  isDocumentVerification = false,
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
    documentType: string,
    icon: string
  ) => (
    <Box key={index} mt={2}>
      <CommonIconText
        icon={icon ? icon : "/assets/svg/carers/profile/single_neutral.svg"}
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
          sx={{ display: "flex", justifyContent: "flex-start", mt: 2, gap: 2 }}
        >
          {doc.isApproved === null && (
            <CommonButton
              buttonText="Pending verification"
              sx={{
                cursor: "default",
                width: "max-content",
                height: "30px",
                backgroundColor: theme.declined.background.primary,
              }}
              buttonTextStyle={{
                color: theme.declined.main,
                fontSize: "12px",
              }}
              startIcon={
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: theme.declined.main }}
                />
              }
            />
          )}
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
              sx={{
                cursor: "default",
                backgroundColor: theme.accepted.background.primary,
                borderColor: theme.accepted.main,
              }}
              buttonTextStyleSx={{ color: theme.accepted.main }}
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
              sx={{
                cursor: "default",
                backgroundColor: theme.declined.background.primary,
                borderColor: theme.declined.main,
              }}
              buttonTextStyleSx={{ color: theme.declined.main }}
            />
          )}
        </Box>
      )}
      {isDocumentVerification && doc.isApproved === null && (
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", mt: 2, gap: 2 }}
        >
          <CommonButton
            buttonText="Pending verification"
            sx={{
              cursor: "default",
              width: "max-content",
              height: "30px",
              backgroundColor: theme.declined.background.primary,
            }}
            buttonTextStyle={{
              color: theme.declined.main,
              fontSize: "12px",
            }}
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
        DBS Document
      </Typography>

      {/* DBS */}
      {documents.length > 0 && (
        <Box mt={5}>
          <Typography mb={1} variant="h6" fontWeight={500}>
            Documentation
          </Typography>
          <Divider />
          {documents.map((doc, index) =>
            renderDocument(
              doc,
              index,
              "DBScertificate",
              "/assets/svg/carers/profile/single_neutral.svg"
            )
          )}
        </Box>
      )}

      {/* Additional */}
      {additionalDocuments.length > 0 && (
        <Box mt={5}>
          <Typography mb={1} variant="h6" fontWeight={500}>
            Additional documents
          </Typography>
          <Divider />
          {additionalDocuments.map((doc, index) =>
            renderDocument(
              doc,
              index,
              "additionalDocument",
              "/assets/svg/carers/profile/single_neutral.svg"
            )
          )}
        </Box>
      )}

      {/* Identification */}
      {identificationDocuments.length > 0 && (
        <Box mt={5}>
          <Typography mb={1} variant="h6" fontWeight={500}>
            Identification
          </Typography>
          <Divider />
          <Box
            sx={{
              border: "1px solid #E2E6EB",
              paddingInline: "20px",
              height: "50px",
              width: "100%",
              mt: 2,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography>{documentType || "N/A"}</Typography>
          </Box>
          {identificationDocuments.map((doc, index) => (
            <Box key={index} mt={3}>
              <Typography mb={1}>{doc.header}</Typography>
              {renderDocument(
                doc,
                0,
                doc?.key || "N/A",
                "/assets/svg/carers/profile/carer_link.svg"
              )}
            </Box>
          ))}
        </Box>
      )}
    </CommonCard>
  );
};

export default Documentations;
