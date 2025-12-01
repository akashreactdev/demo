import React from "react";
import { Box, Divider, Typography } from "@mui/material";
//relative path imports
import CommonCard from "../Cards/Common";
import CommonIconText from "../CommonIconText";
interface DocumentItem {
  title: string | null | undefined;
  expiryDate?: string;
  // requiresApproval?: boolean;
  // isApproved?: boolean | null;
  url?: string | null;
}

interface DocumentationsProps {
  documents: DocumentItem[];
  // additionalDocuments?: DocumentItem[];
  // insuranceDocuments?: DocumentItem[];
  // onApprovalClick?: (documentType: string, index: number) => void;
  // isShowButton?: boolean | null;
  // onRejectClick?: (documentType: string, index: number) => void;
}

const CommonAttachmentCard: React.FC<DocumentationsProps> = ({ documents }) => {
  const handleDocumentClick = (url?: string | null) => {
    if (url) {
      const documentUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${url}`;
      window.open(documentUrl, "_blank");
    }
  };

  const renderDocument = (doc: DocumentItem, index: number) => (
    <Box key={index} mt={2}>
      <CommonIconText
        icon={
          "/assets/svg/carers/profile/Paginate-Filter-Text--Streamline-Ultimate.svg"
        }
        title={doc.title}
        endIcon={true}
        onClick={() => handleDocumentClick(doc.url)}
      />
    </Box>
  );
  return (
    <Box>
      <CommonCard>
        {documents.length > 0 && (
          <Box>
            <Typography mb={1} variant="h6" fontWeight={500}>
              Attachment
            </Typography>
            <Divider />
            {documents.map((doc, index) => renderDocument(doc, index))}
          </Box>
        )}
      </CommonCard>
    </Box>
  );
};

export default CommonAttachmentCard;
