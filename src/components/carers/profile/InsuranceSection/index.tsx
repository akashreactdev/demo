import React from "react";
// import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CommonCard from "@/components/Cards/Common";
import CommonIconText from "@/components/CommonIconText";
import ApproveButton from "../ApproveButton";
// import CheckIcon from "@mui/icons-material/Check";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import CommonChip from "@/components/CommonChip";
import { Divider } from "@mui/material";
import CommonButton from "@/components/CommonButton";

interface DocumentItem {
  title: string | null | undefined;
  expiryDate?: string;
  requiresApproval?: boolean;
  isApproved?: boolean | null;
  url?: string | null;
}

interface InsuranceSectionProps {
  documents: DocumentItem[];
  onApprovalClick?: (documentType: string, index: number) => void;
  isShowButton?: boolean | null;
  onRejectClick?: (documentType: string, index: number) => void;
  smoker?: boolean | null;
  rightToWorkInUK?: boolean | null;
  selfEmployeedPosition?: boolean | null;
  taxReferenceNo?: boolean | null;
  taxNo?: string | number | null;
  isDocumentVerification?: boolean | null;
}

const StyledInputBox = styled(Box)(({}) => ({
  border: "1px solid #E2E6EB",
  padding: "10px",
  borderRadius: "10px",
}));

const InsuranceSection: React.FC<InsuranceSectionProps> = ({
  documents,
  onApprovalClick,
  onRejectClick,
  isShowButton,
  // smoker,
  rightToWorkInUK,
  // selfEmployeedPosition,
  // taxReferenceNo,
  taxNo,
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
    documentType: string
  ) => (
    <Box key={index} mt={2}>
      <CommonIconText
        icon={"/assets/svg/carers/profile/carer_link.svg"}
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
              title="decline"
              onClick={() =>
                onRejectClick && onRejectClick(documentType, index)
              }
            />
          ) : (
            <ApproveButton
              title="declined"
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
        Insurance
      </Typography>
      <Box
      // sx={{
      //   marginBlock: 2,
      //   display: "flex",
      //   alignItems: "center",
      // }}
      >
        {/* <Box sx={{ display: "inline-block" }}>
          {rightToWorkInUK === false || rightToWorkInUK === undefined ? (
            <Box
              sx={{
                height: "30px",
                width: "30px",
                border: `1px solid ${theme.ShadowAndBorder.border2}`,
                borderRadius: "10px",
              }}
            />
          ) : (
            <Box
              sx={{
                height: "30px",
                width: "30px",
                border: `1px solid ${theme.ShadowAndBorder.border2}`,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon
                sx={{ color: theme.palette.common.black, fontSize: 24 }}
              />
            </Box>
          )}
        </Box> */}
        <Box mt={4}>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            The right to work in the UK
          </Typography>
          <Divider sx={{ marginBlock: 2 }} />
          <CommonChip
            title={rightToWorkInUK ? "Yes" : "No"}
            variant="primary"
            style={{
              backgroundColor: theme?.palette?.common?.white,
              border: `1px solid ${theme.ShadowAndBorder.border2}`,
              marginTop: 1,
            }}
            textStyle={{ fontWeight: 500 }}
          />
        </Box>
      </Box>
      {/* <Box
        sx={{
          marginBlock: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "inline-block" }}>
          {selfEmployeedPosition === false ||
          selfEmployeedPosition === undefined ? (
            <Box
              sx={{
                height: "30px",
                width: "30px",
                border: `1px solid ${theme.ShadowAndBorder.border2}`,
                borderRadius: "10px",
              }}
            />
          ) : (
            <Box
              sx={{
                height: "30px",
                width: "30px",
                border: `1px solid ${theme.ShadowAndBorder.border2}`,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon
                sx={{ color: theme.palette.common.black, fontSize: 24 }}
              />
            </Box>
          )}
        </Box>
        <Typography
          sx={{
            marginLeft: "20px",
            fontSize: "15px",
            lineHeight: "16px",
            textAlign: "justify",
          }}
        >
          I understand that this is a self employed position?
        </Typography>
      </Box>
      <Box
        sx={{
          marginBlock: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "inline-block" }}>
          {smoker === false || smoker === undefined ? (
            <Box
              sx={{
                height: "30px",
                width: "30px",
                border: `1px solid ${theme.ShadowAndBorder.border2}`,
                borderRadius: "10px",
              }}
            />
          ) : (
            <Box
              sx={{
                height: "30px",
                width: "30px",
                border: `1px solid ${theme.ShadowAndBorder.border2}`,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon
                sx={{ color: theme.palette.common.black, fontSize: 24 }}
              />
            </Box>
          )}
        </Box>
        <Typography
          sx={{
            marginLeft: "20px",
            fontSize: "15px",
            lineHeight: "16px",
            textAlign: "justify",
          }}
        >
          I am a smoker
        </Typography>
      </Box>
      <Box
        sx={{
          marginBlock: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "inline-block" }}>
          {taxReferenceNo === false || taxReferenceNo === undefined ? (
            <Box
              sx={{
                height: "30px",
                width: "30px",
                border: `1px solid ${theme.ShadowAndBorder.border2}`,
                borderRadius: "10px",
              }}
            />
          ) : (
            <Box
              sx={{
                height: "30px",
                width: "30px",
                border: `1px solid ${theme.ShadowAndBorder.border2}`,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon
                sx={{ color: theme.palette.common.black, fontSize: 24 }}
              />
            </Box>
          )}
        </Box>
        <Typography
          sx={{
            marginLeft: "20px",
            fontSize: "15px",
            lineHeight: "16px",
            textAlign: "justify",
          }}
        >
          I have a unique tax reference number
        </Typography>
      </Box> */}
      <Box mt={5}>
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          Tax reference number
        </Typography>
        <Divider sx={{ marginBlock: 2 }} />
        <StyledInputBox mt={3}>
          <Typography
            variant="body1"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              minHeight: "25px",
            }}
          >
            {taxNo ? taxNo : "N/A"}
          </Typography>
        </StyledInputBox>
      </Box>
      {documents.length > 0 && (
        <Box mt={5}>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Documentation
          </Typography>
          <Divider sx={{ mt: 2 }} />
          <Box mt={3}>
            {documents.map((doc, index) =>
              renderDocument(doc, index, "insuranceDocument")
            )}
          </Box>
        </Box>
      )}
    </CommonCard>
  );
};

export default InsuranceSection;
