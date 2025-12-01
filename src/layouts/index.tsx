"use client";
import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
//relative path imports
import theme from "@/theme";
import { AuthProvider } from "@/context/AuthContext";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>{children}</AuthProvider>
      <ToastContainer position="bottom-right" autoClose={1000} />
      <CssBaseline />
    </ThemeProvider>
  );
};

export default MainLayout;
