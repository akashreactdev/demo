import React from "react";
import MainLayout from "@/layouts/Main";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
