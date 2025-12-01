"use client";
import React, { useState } from "react";
// Import Yup and react-hook-form
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//relative path imports
import CommonInput from "@/components/CommonInput";
import CommonButton from "@/components/CommonButton";
import { generateCaptcha } from "@/utils/helper";
import { useAuth } from "@/hooks/useAuth";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface FormData {
  captchCode: string;
}

const schema = yup.object().shape({
  captchCode: yup.string().required("Required"),
});

const StyledCaptcha = styled(Box)(({ theme }) => ({
  height: "80px",
  border: `1px solid ${theme.inProgress.main}`,
  backgroundColor: theme.inProgress.background.primary,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",

  [theme.breakpoints.down("md")]: {
    height: "55px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "45px",
  },
}));

const VerifyEmail = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [captcha, setCaptcha] = useState<string>(generateCaptcha());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      captchCode: "",
    },
  });

  const captchCode = watch("captchCode");

  const refreshCaptcha = (): void => {
    setCaptcha(generateCaptcha());
    clearErrors("captchCode");
  };

  const onSubmit = (data: FormData): void => {
    setIsLoading(true);
    try {
      if (data.captchCode !== captcha) {
        setError("captchCode", {
          type: "manual",
          message: "Incorrect CAPTCHA. Please try again.",
        });
        setIsLoading(false);
        return;
      }
      login("true");
      navigateWithLoading("/dashboard");
    } catch (error) {
      console.error("Error during submission:", error);
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
        Verify{" "}
        <Typography
          component="span"
          variant={isMobile ? "h2" : "h1"}
          fontSize={"36px"}
          fontWeight={500}
        >
          captcha
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        For added security&sbquo;&nbsp;please verify the CAPTCHA code displayed.
      </Typography>
      <Box mt={7} component="form" onSubmit={handleSubmit(onSubmit)}>
        <StyledCaptcha>
          <Typography
            variant={isTablet ? "h3" : isMobile ? "h6" : "h1"}
            letterSpacing={2.5}
            fontWeight={400}
            color={theme.inProgress.main}
            sx={{ userSelect: "none" }}
          >
            {captcha}
          </Typography>
        </StyledCaptcha>
        <Box mt={4}>
          <Controller
            name="captchCode"
            control={control}
            render={({ field }) => (
              <CommonInput
                label="Enter code"
                error={!!errors.captchCode}
                helperText={errors.captchCode?.message}
                {...field}
              />
            )}
          />
          <Typography
            sx={{ cursor: "pointer" }}
            fontWeight={500}
            mt={2}
            variant="body2"
            onClick={refreshCaptcha}
          >
            Refresh
          </Typography>
        </Box>
        <Box mt={4}>
          <CommonButton
            buttonText="Log-in"
            disabled={!captchCode}
            type="submit"
            loading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
