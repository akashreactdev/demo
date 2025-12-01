"use client";
import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//relative path imports
import CommonInput from "@/components/CommonInput";
import CommonButton from "@/components/CommonButton";
//relative api imports
import { forgotPasswordApi } from "@/services/api/authApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface FormData {
  email: string;
}

interface ForgotPasswordResponse {
  data: {
    success: boolean;
  };
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Required")
    .email("Please enter a valid email address"),
});

const ForgotPassword: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const obj: FormData = {
        email: data.email,
      };
      const response = (await forgotPasswordApi(obj)) as ForgotPasswordResponse;
      if (response?.data?.success) {
        navigateWithLoading(
          `/password-link?query=${encodeURIComponent(data?.email)}`
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
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
        Forgot{" "}
        <Typography
          component="span"
          variant={isMobile ? "h2" : "h1"}
          fontWeight={500}
          fontSize={"36px"}
        >
          password
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        Enter the email address associated with your account and we&lsquo;ll
        email you a link.
      </Typography>
      <Box mt={7} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CommonInput
              label="Email address"
              autoComplete="off"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...field}
            />
          )}
        />
        <Box mt={4}>
          <CommonButton
            buttonText="Send reset link"
            disabled={!email}
            type="submit"
            loading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
