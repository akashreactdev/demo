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

interface EmailUpdatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  title: string;
  description: string;
}

const EmailUpdated: React.FC<EmailUpdatedModalProps> = ({
  isOpen,
  onClose,
  onClick,
  title,
  description,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography
            textAlign={"center"}
            variant="h6"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>

          <Divider />

          <Stack mt={3} rowGap={2}>
            <Typography textAlign={"center"} variant="body1">
              {description}
            </Typography>
          </Stack>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <CommonButton
              buttonText="Cancel"
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
            <CommonButton buttonText="Verify" onClick={onClick} />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmailUpdated;
