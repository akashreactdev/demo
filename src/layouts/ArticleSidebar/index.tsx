"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { PreviewResources } from "@/app/(main)/providers/resources/preview-article/page";
import CommonChip from "@/components/CommonChip";
import { Stack, Typography } from "@mui/material";

interface SidebarProps {
  onClose?: () => void;
}

const StyledWrapper = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
}));

const MainLogoContainer = styled(Box)(() => ({
  minHeight: "80px",
  height: "auto",
  width: "100%",
  justifyContent: "center",
  display: "flex",
}));

const LogoContainer = styled(Box)(() => ({
  height: "100%",
  width: "80%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderBottom: "1px solid black",
}));

const ContentWrapper = styled(Box)(() => ({
  flexGrow: 1,
  overflowY: "auto",
  scrollbarWidth: "none",
}));

const ArticleSidebar: React.FC<SidebarProps> = () => {
  const theme = useTheme();
  const [previewResourceData, setPreviewResourceData] =
    useState<PreviewResources | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("PreviewArticle");
    if (stored) {
      try {
        const parsed: PreviewResources = JSON.parse(stored);
        setPreviewResourceData(parsed);
      } catch (err) {
        console.error("Error parsing PreviewArticle:", err);
      }
    }
  }, []);

  const handleClickScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <StyledWrapper>
      <MainLogoContainer>
        <LogoContainer>
          <Image
            src="/assets/svg/logos/new_zorbee_health_logo.svg"
            alt="zorbee-logo"
            height={50}
            width={180}
            priority
          />
        </LogoContainer>
      </MainLogoContainer>

      <ContentWrapper>
        <Stack
          flexDirection={"column"}
          alignItems={"start"}
          justifyContent={"center"}
          height={"100%"}
          gap={2}
          p={2}
        >
          <Typography variant="h6" fontSize={"32px"} fontWeight={400}>
            Contents
          </Typography>

          {/* Articles */}
          {previewResourceData?.article?.map((title, idx) => {
            const id = `article-section-${idx}`;
            const truncate = (str: string, n: number) =>
              str?.length > n ? str.substr(0, n - 1) + "…" : str;
            return (
              <CommonChip
                key={id}
                title={truncate(title?.subTitle || "N/A", 20)}
                style={{
                  backgroundColor:
                    activeSection === id ? theme.pending.main : "transparent",
                  border: "none",
                  borderRadius: "62px",
                  cursor: "pointer",
                  maxWidth: "220px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                textStyle={{ fontSize: "16px" }}
                onClick={() => handleClickScroll(id)}
              />
            );
          })}

          {/* Conclusion */}
          {previewResourceData?.conclusion?.map((title, idx) => {
            const id = `conclusion-section-${idx}`;
            const truncate = (str: string, n: number) =>
              str?.length > n ? str.substr(0, n - 1) + "…" : str;
            return (
              <CommonChip
                key={id}
                title={truncate(title?.subTitle || "N/A", 20)}
                style={{
                  backgroundColor:
                    activeSection === id ? theme.pending.main : "transparent",
                  border: "none",
                  borderRadius: "62px",
                  cursor: "pointer",
                  maxWidth: "220px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                textStyle={{ fontSize: "16px" }}
                onClick={() => handleClickScroll(id)}
              />
            );
          })}
        </Stack>
      </ContentWrapper>
    </StyledWrapper>
  );
};

export default ArticleSidebar;
