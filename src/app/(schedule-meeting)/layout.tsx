import React from "react";
//relative path imports
import ScheduleMeetingLayout from "@/layouts/Schedule-Meeting";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <ScheduleMeetingLayout>{children}</ScheduleMeetingLayout>;
};

export default Layout;
