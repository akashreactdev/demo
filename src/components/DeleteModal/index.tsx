"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
//relative path imports
import CommonButton from "../CommonButton";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove?: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onRemove,
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
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
            Are you sure?
          </Typography>

          <Divider />

          <Box mt={1}>
            <Typography align="center">
              Are you sure you want to remove this notification from your list?
            </Typography>
          </Box>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <CommonButton
              buttonText="Go back"
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
            <CommonButton buttonText="Remove" onClick={onRemove} />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
