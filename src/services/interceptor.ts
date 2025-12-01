import axios from "axios";
import { isTokenExpired } from "@/utils/helper";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

let isRefreshing = false;
let failedRequestsQueue: ((token: string) => void)[] = [];

const refreshAuthLogic = async (): Promise<string | null> => {
  try {
    const token = getRefreshToken();
    if (!token) {
      throw new Error("No refresh token found");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-platform": "superAdminWeb",
        },
      }
    );

    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    console.log("Token refreshed successfully");
    failedRequestsQueue.forEach((callback) => callback(accessToken));
    failedRequestsQueue = [];
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isCaptchaValid");
    toast.error("Session expired. Please login again!");
    failedRequestsQueue = [];
    return null;
  } finally {
    isRefreshing = false;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers["x-platform"] = "superAdminWeb";
    let token = getAccessToken();
    if (token) {
      if (isTokenExpired(token)) {
        console.log("Access token expired! Refreshing...");
        if (!isRefreshing) {
          isRefreshing = true;
          token = await refreshAuthLogic();
        } else {
          token = await new Promise((resolve) => {
            failedRequestsQueue.push((newToken: string) => resolve(newToken));
          });
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      if (data?.message) {
        toast.error(data?.message);
      }

      if (status === 401) {
        console.warn("Unauthorized! Attempting token refresh...");

        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshAuthLogic();

          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(config);
          }
        } else {
          return new Promise((resolve) => {
            failedRequestsQueue.push(async (newToken: string) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(axiosInstance(config));
            });
          });
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
