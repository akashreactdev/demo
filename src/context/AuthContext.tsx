"use client";
import React, { createContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (isCaptchaValid: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathName = usePathname();

  const getAccessToken = () => localStorage.getItem("accessToken");
  const isCaptchaValid = () =>
    localStorage.getItem("isCaptchaValid") === "true";

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      const accessToken = getAccessToken();

      if (accessToken) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      if (accessToken && isCaptchaValid()) {
        if (
          [
            "/sign-in",
            "/email",
            "/verify-email",
            "/forgot-password",
            "/new-password",
            "/password-link",
          ].includes(pathName)
        ) {
          router.replace("/dashboard");
        }
      } else if (!accessToken) {
        setIsAuthenticated(false);
        if (
          ![
            "/sign-in",
            "/email",
            "/verify-email",
            "/forgot-password",
            "/new-password",
            "/password-link",
            "/verify-number",
            "/welcome-screen",
            "/thanks-screen",
          ].includes(pathName)
        ) {
          router.replace("/sign-in");
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, [pathName, router]);

  const login = (isCaptchaValid: string) => {
    localStorage.setItem("isCaptchaValid", isCaptchaValid);
    setIsAuthenticated(true);
    router.replace("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isCaptchaValid");
    setIsAuthenticated(false);
    router.replace("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {isLoading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ fontSize: "24px" }} />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
