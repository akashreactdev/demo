"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
//import icons
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
//relative path imports
import CommonInput from "@/components/CommonInput";
import CommonButton from "@/components/CommonButton";
import { resetPasswordApi } from "@/services/api/authApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface FormData {
  email?: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  data: {
    success: boolean;
  };
}

const passwordSchema = yup.object().shape({
  newPassword: yup.string().required("Required"),
  confirmPassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

const NewPasswordContent: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const queryParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const emailParam = queryParams.get("query");
    const tokenParam = queryParams.get("token");

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    if (tokenParam) {
      localStorage.setItem("accessToken", token);
      setToken(tokenParam);
    }
  }, [queryParams]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const isPasswordMatch = newPassword === confirmPassword;

  const toggleEyeButton = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRepeatEyeButton = () => {
    setIsRepeatPasswordVisible(!isRepeatPasswordVisible);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const obj: FormData = {
        email: email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      const response = (await resetPasswordApi(
        obj,
        token
      )) as ResetPasswordResponse;
      console.log(response);
      if (response?.data?.success) {
        navigateWithLoading("/sign-in");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Reset Password failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        textAlign={"center"}
        fontWeight={400}
        variant={isMobile ? "h2" : "h1"}
        fontSize={"36px"}
      >
        Set{" "}
        <Typography
          component="span"
          variant={isMobile ? "h2" : "h1"}
          fontWeight={500}
          fontSize={"36px"}
        >
          new password
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        Please enter the new password you&lsquo;d like to associate with your
        Zorbee Health account.
      </Typography>
      <Box mt={7} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <CommonInput
              label="New password"
              type={isPasswordVisible ? "text" : "password"}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              endAdornment={
                <IconButton onClick={toggleEyeButton}>
                  {isPasswordVisible ? (
                    <VisibilityOffIcon />
                  ) : (
                    <RemoveRedEyeOutlinedIcon />
                  )}
                </IconButton>
              }
              {...field}
            />
          )}
        />

        <Box mt={4}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <CommonInput
                label="Repeat new password"
                type={isRepeatPasswordVisible ? "text" : "password"}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                endAdornment={
                  <IconButton onClick={toggleRepeatEyeButton}>
                    {isRepeatPasswordVisible ? (
                      <VisibilityOffIcon />
                    ) : (
                      <RemoveRedEyeOutlinedIcon />
                    )}
                  </IconButton>
                }
                {...field}
              />
            )}
          />
        </Box>

        <Box mt={4}>
          <CommonButton
            buttonText="Back to log-in"
            disabled={!newPassword || !confirmPassword || !isPasswordMatch}
            type="submit"
            loading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

const NewPassword: React.FC = () => {
  return (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      <NewPasswordContent />
    </Suspense>
  );
};

export default NewPassword;
