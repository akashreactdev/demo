"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// Relative path imports
import CommonInput from "@/components/CommonInput";
import CommonButton from "@/components/CommonButton";
import { maskEmail } from "@/utils/helper";
//relative api imports
import { resendOtpApi, verifyEmailApi } from "@/services/api/authApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface FormData {
  email?: string;
  otp: string;
  type?: string;
}

interface EmailResponse {
  data: {
    success: boolean;
    data: {
      accessToken: string;
      refreshToken: string;
      message?: string;
    };
  };
}

interface ResendOtpResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const schema = yup.object().shape({
  otp: yup.string().required("Required").min(6),
});

const EmailContent: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const queryParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const query = queryParams.get("query");
    if (query) {
      setEmail(decodeURIComponent(query));
    }
  }, [queryParams]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const otp = watch("otp");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const obj: FormData = {
        email: email,
        otp: data.otp,
        type: "login",
      };
      const response = (await verifyEmailApi(obj)) as EmailResponse;
      if (response?.data?.success) {
        localStorage.setItem("accessToken", response?.data?.data?.accessToken);
        localStorage.setItem(
          "refreshToken",
          response?.data?.data?.refreshToken
        );
        navigateWithLoading("/verify-email");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const obj: { email: string } = {
        email: email,
      };
      const response = (await resendOtpApi(obj)) as ResendOtpResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Resend Otp failed:", error);
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
          fontWeight={500}
          fontSize={"36px"}
        >
          email
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        We&lsquo;ve sent a 6-digit code to
      </Typography>
      <Typography textAlign={"center"} fontWeight={500} variant="h6">
        {email ? maskEmail(email) : ""}
      </Typography>
      <Box mt={7} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <CommonInput
              label="Enter code"
              error={!!errors.otp}
              helperText={errors.otp?.message}
              {...field}
            />
          )}
        />
        <Typography mt={2} variant="body2">
          Didn&lsquo;t get a code?&nbsp;
          <Typography
            component="span"
            variant="body2"
            fontWeight={500}
            sx={{ cursor: "pointer" }}
            onClick={resendOtp}
          >
            Tap to get another
          </Typography>
        </Typography>
        <Box mt={4}>
          <CommonButton
            buttonText="Verify"
            disabled={!otp}
            type="submit"
            loading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

const Email: React.FC = () => {
  return (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      <EmailContent />
    </Suspense>
  );
};

export default Email;
