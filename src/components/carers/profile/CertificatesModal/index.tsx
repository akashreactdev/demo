"use client";
import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CommonButton from "@/components/CommonButton";
import CommonIconText from "@/components/CommonIconText";
import { Certificate } from "@/types/clinicalProfileTypes";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  certificates?: Certificate[];
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  title,
  certificates,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDocumentClick = (url?: string | null) => {
    if (url) {
      const documentUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}/${url}`;
      window.open(documentUrl, "_blank");
    }
  };

  const getCleanFilename = (fullPath: string) => {
    const lastSegment = fullPath.split("/document/").pop() || "";
    const match = lastSegment.match(/^(.+?\.[a-zA-Z0-9]{2,5})/);
    const cleanFilename = match ? match[1] : lastSegment;
    return cleanFilename.length > 30
      ? cleanFilename.substring(0, 30) + "..."
      : cleanFilename;
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          p: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography
            textAlign="center"
            variant="h6"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            {title ? title : "Available Certificates"}
          </Typography>

          <Divider />

          <Box mt={2}>
            {certificates && certificates?.length > 0 ? (
              certificates.map((ele, index) => {
                const displayTitle = ele.certificateFile
                  ? getCleanFilename(ele.certificateFile)
                  : "N/A";
                return (
                  <Box key={index}>
                    <CommonIconText
                      icon={"/assets/svg/carers/profile/single_neutral.svg"}
                      title={displayTitle}
                      endIcon={true}
                      onClick={() => handleDocumentClick(ele.certificateFile)}
                    />
                  </Box>
                );
              })
            ) : (
              <Box textAlign={"center"}>
                <Typography variant="body1" fontWeight={400}>
                  No Certificates available.
                </Typography>
              </Box>
            )}
          </Box>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <CommonButton
              buttonText="Close"
              onClick={onClose}
              sx={{
                bgcolor: "#ffffff",
                color: "#000",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
            />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
