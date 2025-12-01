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
  SxProps,
  Theme,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
//relative path imports
import CommonButton from "../CommonButton";

interface DeleteModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onRemove?: () => void;
  title: string;
  question: string;
  buttonText: string;
  buttonsx?: SxProps<Theme>;
  buttonTextStyle?: React.CSSProperties;
  isCancelButtonShow?: boolean;
}

const SelectCancelModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onRemove,
  title,
  question,
  buttonText,
  buttonsx,
  buttonTextStyle = {},
  isCancelButtonShow = true,
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
      disableEnforceFocus
    >
      <DialogContent sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            textAlign: "center",
          }}
        >
          {title && (
            <>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
                {title}
              </Typography>

              <Divider />
            </>
          )}
          <Box mt={1}>
            <Typography align="center">{question}</Typography>
          </Box>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            {isCancelButtonShow && (
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
            )}
            <CommonButton
              sx={buttonsx}
              buttonText={buttonText}
              onClick={onRemove}
              buttonTextStyle={buttonTextStyle}
            />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCancelModal;
