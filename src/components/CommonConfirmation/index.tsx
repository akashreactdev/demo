"use client";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

type CommonConfirmationProps = {
  question?: string;
  options?: string[];
  onSelect: (option: string) => void;
  sx?: React.CSSProperties;
  defaultSelected?: string;
  allowClickKey?: boolean;
};

const StyledBox = styled(Box)<{ selected: boolean }>(({ selected, theme }) => ({
  backgroundColor: selected
    ? theme.inProgress.background.primary
    : theme.inProgress.background.secondary,
  color: theme.palette.common.black,
  padding: "7px 14px",
  border: selected
    ? `1px solid ${theme.inProgress.main}`
    : `1px solid ${theme.palette.common.black}`,
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // cursor: "pointer",
  transition: "background-color 0.3s, color 0.3s",
}));

const CommonConfirmation: React.FC<CommonConfirmationProps> = ({
  question,
  options = ["Yes", "No"],
  onSelect,
  sx,
  defaultSelected,
   allowClickKey,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    defaultSelected || null
  );

  useEffect(() => {
    if (defaultSelected) {
      setSelectedOption(defaultSelected);
    }
  }, [defaultSelected]);

  const handleSelect = (option: string) => {
    if (allowClickKey) {
   setSelectedOption(option);
      onSelect?.(option);
    }
  };

  return (
    <Box>
      <Typography variant="body1" fontWeight={400} mb={2}>
        {question}
      </Typography>
      <Stack direction="row" spacing={2}>
        {options.map((option, index) => (
          <StyledBox
            key={index}
            selected={selectedOption === option}
            onClick={() => handleSelect(option)}
            sx={sx}
          >
            <Typography variant="body1" fontWeight={400}>
              {option}
            </Typography>
          </StyledBox>
        ))}
      </Stack>
    </Box>
  );
};

export default CommonConfirmation;
