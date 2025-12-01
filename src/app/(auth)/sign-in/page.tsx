"use client";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
//import icons
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
//relative path imports
import CommonInput from "@/components/CommonInput";
import CommonButton from "@/components/CommonButton";
//relative api imports
import { loginApi } from "@/services/api/authApi";
import { app } from "../../../../firebase";
import { useRouterLoading } from "@/hooks/useRouterLoading";

// const NavLink = styled(Link)(({ theme }) => ({
//   textDecoration: "none",
//   color: theme.palette.common.black,
// }));

interface FormData {
  email: string;
  password: string;
  role?: number;
  loginType?: number;
  deviceId?: string | null;
}

interface LoginResponseData {
  data: {
    success: boolean;
    message?: string;
  };
  message?: string | null;
  response?: {
    data?: {
      status?: number | null;
      error?: string | null;
      message?: string | null;
      statusCode?: number | null;
    };
  };
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Required")
    .email("Please enter a valid email address"),
  password: yup.string().required("Required").min(6),
});

const SignIn: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fcmToken, setFCMToken] = useState<string>("");
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");

  const toggleEyeButton = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const obj: FormData = {
        email: data.email,
        password: data.password,
        role: 6,
        loginType: 1,
        deviceId: localStorage.getItem("FCmToken")
          ? localStorage.getItem("FCmToken")
          : fcmToken,
      };

      const response = (await loginApi(obj)) as LoginResponseData;
      if (response?.data?.success) {
        navigateWithLoading(`/email?query=${encodeURIComponent(data?.email)}`);
        setIsLoading(false);
      } else if (response?.response?.data?.status === 400) {
        if (
          response?.response?.data?.message ===
          "No user found with this email address"
        ) {
          setError("email", {
            type: "custom",
            message: "*No user found with this email address",
          });
        } else if (
          response?.response?.data?.message ===
          "Please enter correct email or password"
        ) {
          setError("password", {
            type: "custom",
            message: "*Incorrect password",
          });
        } else {
          setError("email", {
            type: "custom",
            message: "*No user found with this email address",
          });
          setError("password", {
            type: "custom",
            message: "*Incorrect password",
          });
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          const { getMessaging, getToken } = await import("firebase/messaging");

          const messaging = getMessaging(app);
          const token = await getToken(messaging, {
            vapidKey:
              "BMd4SSb1vKHowdmmfhnLSs-PuJcMWR8r04Pezwq4sYC8vZBFQLMzQl5hA_9FVaa-41V5XfABQayQse6Fc-uAFbc",
          });

          if (token) {
            localStorage.setItem("FCMToken", token);
            setFCMToken(token);
          } else {
            console.log("No registration token available.");
          }
        } catch (error) {
          console.error("An error occurred while retrieving token: ", error);
        }
      } else {
        console.log("Notification permission denied.");
      }
    } else {
      console.log("Notifications not supported in this environment.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      requestPermission();
    }
  }, []);

  return (
    <Box>
      <Typography
        textAlign={"center"}
        fontWeight={400}
        variant={isMobile ? "h2" : "h1"}
        fontSize={"36px"}
      >
        Admin{" "}
        <Typography
          component="span"
          variant={isMobile ? "h2" : "h1"}
          fontSize={"36px"}
          fontWeight={500}
        >
          log-in
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        Please enter your log-in details below.
      </Typography>
      <Box mt={7} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CommonInput
              label="Email address"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="off"
              {...field}
            />
          )}
        />
        <Box mt={4}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CommonInput
                label="Password"
                autoComplete="off"
                type={isPasswordVisible ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password?.message}
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
        </Box>

        <Typography
          mt={2}
          fontWeight={500}
          variant="body2"
          sx={{ cursor: "pointer" }}
          onClick={() => navigateWithLoading("/forgot-password")}
        >
          Forgot your password?
        </Typography>

        <Box mt={4}>
          <CommonButton
            buttonText="Sign in"
            disabled={!email || !password || password.length < 6}
            type="submit"
            loading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
