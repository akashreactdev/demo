import axiosInstance from "../interceptor";

interface AdminLoginProps {
  email: string;
  password: string;
  role?: number;
  loginType?: number;
}

interface VerifyEmailProps {
  email?: string;
  otp: string;
  type?: string;
}

interface VerifyNumberProps {
  email?: string;
  otp: string;
  type?: string;
}

interface ForgotPasswordProps {
  email: string;
}

interface ResetPassowrdProps {
  email?: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResendOtpProps {
  email?: string;
}

export const loginApi = async (payload: AdminLoginProps) => {
  let result;
  try {
    result = await axiosInstance.post("/auth/login", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const verifyEmailApi = (payload: VerifyEmailProps) => {
  let result;
  try {
    result = axiosInstance.post("/auth/verify-otp", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const forgotPasswordApi = (payload: ForgotPasswordProps) => {
  let result;
  try {
    result = axiosInstance.post("/auth/forgot-password", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const resetPasswordApi = (
  payload: ResetPassowrdProps,
  token: string
) => {
  let result;
  try {
    result = axiosInstance.post("/auth/reset-password", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const resendOtpApi = (payload: ResendOtpProps) => {
  let result;
  try {
    result = axiosInstance.post("/auth/resend-otp", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const verifyNumberApi = (payload: VerifyNumberProps) => {
  let result;
  try {
    result = axiosInstance.post("/client/trusted-contacts/verify-otp", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const resendVerifyNumberOtpApi = (number: string) => {
  let result;
  try {
    result = axiosInstance.get(
      `/client/trusted-contacts/resend-otp?mobile=${number}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const welcomeScreenApi = (
  contactId: string,
  isRequestAccepted: boolean,
  userName: string
) => {
  let result;
  try {
    result = axiosInstance.get(
      `/client/trusted-contacts/accept-request?contactId=${contactId}&isRequestAccepted=${isRequestAccepted}&userName=${userName}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};
