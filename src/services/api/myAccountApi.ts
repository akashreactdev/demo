import axiosInstance from "../interceptor";

interface UpdateEmailData {
  email: string;
}

interface AccountDetailsData {
  firstName?: string | null;
  profile?: string | null;
  userName?: string | null;
  lastName?: string | null;
  dob?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
}

interface VerifyOTPData {
  email: string;
  type: string;
  otp: string;
}

export const getMyAccountSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/details");
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateEmailAddress = async (payload: UpdateEmailData) => {
  let result;
  try {
    result = await axiosInstance.put("/auth/email", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmailVerify = async (email: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/auth/email-verify?email=${email}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateMyAccountDetails = async (payload: AccountDetailsData) => {
  try {
    return await axiosInstance.post(`/admin/update-details`, payload);
  } catch (error) {
    console.error("Error updating my account data:", error);
    throw error;
  }
};

export const verifyOTP = async (payload: VerifyOTPData) => {
  try {
    return await axiosInstance.post(`/auth/verify-otp`, payload);
  } catch (error) {
    console.error("Error verify otp:", error);
    throw error;
  }
};

export const getDashboardAccountData = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/dashboard-account");
  } catch (e) {
    result = e;
  }
  return result;
};

export const getDashboardPendingData = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/dashboard-pendings");
  } catch (e) {
    result = e;
  }
  return result;
};

export const getDashboardDemographicData = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get("/admin/dashboard-demographics", {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const getDashboardVerificationData = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/dashboard-verification");
  } catch (e) {
    result = e;
  }
  return result;
};
