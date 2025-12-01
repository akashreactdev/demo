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
//relative api imports
import {
  resendVerifyNumberOtpApi,
  verifyNumberApi,
} from "@/services/api/authApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface FormData {
  number?: string;
  otp: string;
  type?: string;
}

interface EmailResponse {
  data: {
    success: boolean;
    data: {
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
  const [number, setNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const query = queryParams.get("number");
    if (query) {
      setNumber(decodeURIComponent(query));
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
        number: `+${number}`,
        otp: data.otp,
        type: "trustedContact",
      };
      const response = (await verifyNumberApi(obj)) as EmailResponse;
      if (response?.data?.success) {
        navigateWithLoading("/welcome-screen");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    const mobile = decodeURIComponent(number);
    try {
      const response = (await resendVerifyNumberOtpApi(
        mobile
      )) as ResendOtpResponse;
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
          number
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        An OTP has been sent to{" "}
        <Typography variant="h6" component={"span"} fontWeight={500}>
          {number ? `+${number}` : "+77 96778 4954"} ,
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        Please enter the code sent to continue!
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

const VerifyNumberPage: React.FC = () => {
  return (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      <EmailContent />
    </Suspense>
  );
};

export default VerifyNumberPage;
