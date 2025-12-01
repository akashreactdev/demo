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
// Import Yup and react-hook-form
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonButton from "@/components/CommonButton";
import CommonInput from "@/components/CommonInput";

interface FormData {
  email: string;
}

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (value: string) => void;
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  email: yup.string().required("Required"),
});

const ChangeEmail: React.FC<ChangeEmailModalProps> = ({
  isOpen,
  onClose,
  onClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: FormData) => {
    onClick(data.email);
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
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
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
            Change your email
          </Typography>

          <Divider />

          <Stack mt={3} rowGap={2}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CommonInput
                  label="Enter your new email address below."
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    border: errors.email
                      ? `1px solid ${theme.palette.error.main}`
                      : "1px solid black !important",
                  }}
                  {...field}
                />
              )}
            />
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
            <CommonButton
              buttonText="Send Link"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmail;
