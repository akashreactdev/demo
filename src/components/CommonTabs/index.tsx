"use client";
import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
// import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
//relative path imports
import CommonCard from "../Cards/Common";

interface CommonTabsProps {
  tabContent: string[];
  selectedTab?: string;
  onTabChange?: (tab: string) => void;
  sx?: object; 
}

interface TabProps {
  isSelected?: boolean;
}

const StyledTab = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<TabProps>(({ isSelected, theme }) => ({
  borderBottom: isSelected ? `2px solid ${theme.palette.common.black}` : "none",
  cursor: "pointer",
  paddingBottom: "5px",
}));

const CommonTabs: React.FC<CommonTabsProps> = ({
  tabContent,
  selectedTab: externalSelectedTab,
  onTabChange,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [internalSelectedTab, setInternalSelectedTab] = useState(tabContent[0]);
  const selectedTab = externalSelectedTab ?? internalSelectedTab;

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalSelectedTab(tab);
    }
  };

  return (
    <CommonCard
      sx={{
        paddingBlock: "20px",
        borderRadius: "10px",
        ...sx,
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="space-between"
        spacing={isMobile ? 2 : 4}
        width="100%"
        sx={{ flexWrap: "wrap" }}
      >
        <Stack
          direction="row"
          spacing={isMobile ? 2 : 2}
          sx={{ flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}
        >
          {tabContent.map((tab) => (
            <StyledTab
              key={tab}
              isSelected={selectedTab === tab}
              onClick={() => handleTabClick(tab)}
            >
              <Typography
                variant="body1"
                fontWeight={selectedTab === tab ? 500 : 400}
              >
                {tab}
              </Typography>
            </StyledTab>
          ))}
        </Stack>
      </Stack>
    </CommonCard>
  );
};

export default CommonTabs;
