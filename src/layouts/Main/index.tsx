"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
//relative path imports
import Sidebar from "@/layouts/Sidebar";
import Header from "@/layouts/Header";
import ArticleSidebar from "../ArticleSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const StyledWrapper = styled(Box)({
  height: "100vh",
  width: "100%",
  overflow: "hidden",
  display: "flex",
});

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "sidebarOpen" && prop !== "isMobile",
})<{ sidebarOpen: boolean; isMobile: boolean }>(
  ({ sidebarOpen, isMobile }) => ({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: !sidebarOpen ? "100%" : "calc(100% - 260px)",
    marginLeft: !isMobile && sidebarOpen ? "260px" : "0",
    transition: "margin-left 0.3s ease-in-out",
  })
);

const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile",
})<{ open: boolean; isMobile: boolean }>(({ open, isMobile }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "260px",
  height: "100%",
  zIndex: 1200,
  transform: !isMobile && open ? "translateX(0)" : "translateX(-100%)",
  transition: "transform 0.3s ease-in-out",
  display: isMobile ? "none" : "block",
}));

const HeaderWrapper = styled(Box)({
  height: "100px",
  width: "100%",
  padding: "10px 10px",
  position: "relative",
  zIndex: 1,
});

const ContentWrapper = styled(Box)({
  flexGrow: 1,
  width: "100%",
  overflowY: "auto",
  padding: "20px",
  scrollbarWidth: "none",
  position: "relative",
  zIndex: 1,
});

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const [sidebarVisible, setSidebarVisible] = useState<boolean>(!isMobile);
  const hideSidebarRoutes = ["/support/resources/preview-article"];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  const [sidebarVisible, setSidebarVisible] = useState<boolean>(
    !isMobile && !shouldHideSidebar
  );

  // useEffect(() => {
  //   setSidebarVisible(!isMobile && !shouldHideSidebar);
  // }, [isMobile, shouldHideSidebar]);

  useEffect(() => {
    setSidebarVisible(!isMobile);
  }, [isMobile]);

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <StyledWrapper>
      {/* Desktop Sidebar - Fixed Position */}
      <SidebarContainer open={sidebarVisible} isMobile={isMobile}>
        {sidebarVisible && !shouldHideSidebar ? <Sidebar /> : <ArticleSidebar />}
        <Sidebar />
      </SidebarContainer>


      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMobile && sidebarVisible}
        onClose={handleCloseSidebar}
        sx={{
          display: isMobile ? "block" : "none",
          "& .MuiDrawer-paper": {
            width: "240px",
            boxSizing: "border-box",
          },
        }}
      >
        <Sidebar onClose={handleCloseSidebar} />
      </Drawer>

      {/* Main Content */}
      <MainContent sidebarOpen={sidebarVisible} isMobile={isMobile}>
        <HeaderWrapper>
          <Header toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
        </HeaderWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </MainContent>
    </StyledWrapper>
  );
};

export default MainLayout;