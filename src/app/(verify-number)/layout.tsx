import React from "react";
//relative path imports
import VerifyNumberLayout from "@/layouts/verify-number";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <VerifyNumberLayout>{children}</VerifyNumberLayout>;
};

export default Layout;
