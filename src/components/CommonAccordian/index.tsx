"use client";
import React, { ReactNode } from "react";
import { SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface CommonAccordionProps {
  children: ReactNode;
  title?: string;
  defaultExpanded?: boolean;
  sx?: SxProps<Theme>;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  paddingBlock: "5px",
  paddingInline: 0,
  minHeight: "auto",
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  paddingBottom: "10px",
  paddingLeft: 0,
  paddingTop: 0,
}));

const CommonAccordion: React.FC<CommonAccordionProps> = ({
  children,
  title = "Experience",
  defaultExpanded = true,
  sx,
}) => {
  return (
    <Box>
      <StyledAccordion defaultExpanded={defaultExpanded} sx={{ ...sx }}>
        <StyledAccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
          <Typography variant="h6" fontWeight={400}>
            {title}
          </Typography>
        </StyledAccordionSummary>
        <StyledAccordionDetails>{children}</StyledAccordionDetails>
      </StyledAccordion>
    </Box>
  );
};

export default CommonAccordion;
