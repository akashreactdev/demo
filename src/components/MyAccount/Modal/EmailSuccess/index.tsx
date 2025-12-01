"use client";
import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CommonButton from "@/components/CommonButton";
import Image from "next/image";

interface EmailSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
}

const EmailSuccess: React.FC<EmailSuccessModalProps> = ({
  isOpen,
  onClose,
  onClick,
}) => {
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
            Email verified
          </Typography>

          <Divider />

          <Stack mt={3} rowGap={2}>
            <Typography textAlign={"center"} variant="body1">
              Thank you! Your email has been successfully verified.
            </Typography>
          </Stack>

          <Box mt={2} justifyContent={"center"} width={"100%"} display={"flex"}>
            <Image
              src={"/assets/svg/account/success.svg"}
              alt="success"
              height={120}
              width={120}
            />
          </Box>

          <Stack sx={{ mt: 3 }}>
            <CommonButton buttonText="Close" onClick={onClick} />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSuccess;
