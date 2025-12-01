import React from "react";
//relative path imports
import AuthLayout from "@/layouts/Auth";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
