"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material";
import Stack from "@mui/material/Stack";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string | number | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  type?: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  fullWidth?: boolean;
  isLabelBold?: boolean;
  height?: string | number;
}

const StyledWrapper = styled(OutlinedInput)(({ theme }) => ({
  height: "60px",
  backgroundColor: theme.palette.common.white,
  paddingInline: "10px",
  color: theme.palette.common.black,
  borderRadius: "13px",
  fontSize: "18px",
  "&.MuiOutlinedInput-root": {
    border: "none",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },

    "&.Mui-error": {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: theme.palette.error.light + "10",
    },
  },
  [theme.breakpoints.down("md")]: {
    height: "45px",
    fontSize: "16px",
  },
}));

const CommonInput: React.FC<InputProps> = ({
  label,
  placeholder,
  onChange,
  value,
  endAdornment,
  error,
  type = "text",
  helperText,
  startAdornment,
  sx,
  isLabelBold,
  height,
  ...rest
}) => {
  return (
    <Stack spacing={2}>
      {label && (
        <Typography
          variant={isLabelBold ? "subtitle1" : "body2"}
          fontWeight={isLabelBold ? 500 : "inherit"}
        >
          {label}
        </Typography>
      )}
      <StyledWrapper
        placeholder={placeholder}
        type={type}
        fullWidth
        value={value}
        onChange={onChange}
        error={error}
        endAdornment={endAdornment}
        startAdornment={startAdornment}
        // sx={sx}
        sx={{ height, ...sx }} 
        {...rest}
      />
      {helperText && (
        <Typography variant="body2" color={error ? "error" : "text.secondary"}>
          {helperText}
        </Typography>
      )}
    </Stack>
  );
};

export default CommonInput;
