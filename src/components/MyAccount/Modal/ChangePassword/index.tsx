"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonButton from "@/components/CommonButton";
import CommonInput from "@/components/CommonInput";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { generateCaptcha } from "@/utils/helper";
import { toast } from "react-toastify";

interface FormData {
  currentPassword: string;
  newPassword: string;
  captcha: string;
}

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (payload: { password: string; confirmPassword: string }) => void;
}

const StyledCaptcha = styled(Box)(({ theme }) => ({
  height: "80px",
  border: `1px solid ${theme.inProgress.main}`,
  backgroundColor: theme.inProgress.background.primary,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",
  [theme.breakpoints.down("md")]: { height: "55px" },
  [theme.breakpoints.down("sm")]: { height: "45px" },
}));

// ✅ Validation Schema
const schema: yup.ObjectSchema<FormData> = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  captcha: yup.string().required("Captcha is required"),
});

const ChangePassword: React.FC<ChangeEmailModalProps> = ({
  isOpen,
  onClose,
  onClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { navigateWithLoading } = useRouterLoading();

  const [captchaCode, setCaptchaCode] = useState<string>("");

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      captcha: "",
    },
  });

  const onSubmit = (data: FormData) => {
    if (data.captcha !== captchaCode) {
      toast.error("Captcha does not match. Please try again.");
      setValue("captcha", "");
      setCaptchaCode(generateCaptcha());
      return;
    }
    const payload = {
      password: data.currentPassword,
      confirmPassword: data.newPassword,
    };

    onClick(payload);
    reset();
    setCaptchaCode(generateCaptcha());
  };

  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      disableEnforceFocus
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 2, boxShadow: 3, p: 0 },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
          <Typography
            textAlign="center"
            variant="h6"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Password
          </Typography>

          <Divider />

          <Typography
            textAlign="center"
            variant="body1"
            fontSize="15px"
            fontWeight={400}
            sx={{ mb: 1, mt: 2 }}
          >
            Update your password to protect your account. Avoid reusing old
            passwords and remember to save it securely.
          </Typography>

          <Stack mt={3} rowGap={2}>
            {/* ✅ Current Password */}
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <CommonInput
                  {...field}
                  label="Current password"
                  type={isCurrentPasswordVisible ? "text" : "password"}
                  sx={{
                    border: `1px solid ${theme.ShadowAndBorder.border2} !important`,
                    height: "50px",
                  }}
                  endAdornment={
                    <IconButton
                      onClick={() =>
                        setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                      }
                    >
                      {isCurrentPasswordVisible ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <RemoveRedEyeOutlinedIcon />
                      )}
                    </IconButton>
                  }
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                />
              )}
            />

            {/* ✅ New Password */}
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <CommonInput
                  {...field}
                  label="New password"
                  type={isNewPasswordVisible ? "text" : "password"}
                  sx={{
                    border: `1px solid ${theme.ShadowAndBorder.border2} !important`,
                    height: "50px",
                  }}
                  endAdornment={
                    <IconButton
                      onClick={() =>
                        setIsNewPasswordVisible(!isNewPasswordVisible)
                      }
                    >
                      {isNewPasswordVisible ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <RemoveRedEyeOutlinedIcon />
                      )}
                    </IconButton>
                  }
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
              )}
            />

            <Controller
              name="captcha"
              control={control}
              render={({ field }) => (
                <CommonInput
                  {...field}
                  label="Enter captcha"
                  sx={{
                    border: `1px solid ${theme.ShadowAndBorder.border2} !important`,
                    height: "50px",
                  }}
                  error={!!errors.captcha}
                  helperText={errors.captcha?.message}
                />
              )}
            />

            {/* ✅ Captcha */}
            <StyledCaptcha>
              <Typography
                variant="h2"
                letterSpacing={2.5}
                fontWeight={400}
                color={theme.inProgress.main}
              >
                {captchaCode}
              </Typography>
            </StyledCaptcha>

            <Box>
              <Typography
                textAlign="left"
                sx={{
                  cursor: "pointer",
                  textDecorationLine: "none",
                }}
                onClick={() => navigateWithLoading("/forgot-password")}
              >
                Forgot your password?
              </Typography>
            </Box>
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
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            />
            <CommonButton buttonText="Done" type="submit" />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
