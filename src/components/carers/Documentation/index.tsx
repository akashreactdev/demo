import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonIconText from "@/components/CommonIconText";
import ApproveButton from "../profile/ApproveButton";

interface DocumentItem {
  title?: string | null | undefined;
  requiresApproval?: boolean;
  isApproved?: boolean;
  isRejected?: boolean;
  url?: string | null | undefined;
}

interface PersonalBioProps {
  shoButtons?: boolean;
  Documentations?: DocumentItem[];
  onApprovalClick?: (index: number) => void;
  onRejectClick?: (index: number) => void;
}

const Documentation: React.FC<PersonalBioProps> = ({
  Documentations = [],
  onApprovalClick,
  onRejectClick,
  shoButtons,
}) => {
  const handleDocumentClick = (url?: string | null) => {
    if (url) {
      const documentUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${url}`;
      window.open(documentUrl, "_blank");
    }
  };

  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        Documentation
      </Typography>

      <Box mt={2}>
        {Documentations.map((doc, index) => {
          const isApprove = doc.isApproved;
          const isReject = !doc.isApproved;
          return (
            <Box key={index}>
              <CommonIconText
                icon={"/Hyperlink-3--Streamline-Ultimate.svg"}
                title={doc.title ? doc.title : "CQC_registration.PDF"}
                endIcon={true}
                onClick={() => handleDocumentClick(doc.url)}
              />
              {shoButtons && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-end",
                    mt: 1,
                  }}
                >
                  {!isApprove || isApprove === null ? (
                    <ApproveButton
                      onClick={() => onApprovalClick && onApprovalClick(index)}
                    />
                  ) : (
                    <ApproveButton
                      title="Approved"
                      sx={{ cursor: "default", backgroundColor: "#C8E4C0" }}
                      buttonTextStyleSx={{ color: "#6A9F69" }}
                    />
                  )}
                  {!isReject || isApprove === null ? (
                    <ApproveButton
                      title="Decline"
                      onClick={() => onRejectClick && onRejectClick(index)}
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
            </Box>
          );
        })}
      </Box>
    </CommonCard>
  );
};

export default Documentation;
