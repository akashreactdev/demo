"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Divider, SxProps, Theme } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CommonChip from "../CommonChip";

export interface SelectOption<T extends string | number = string | number> {
  label: string;
  value: T;
}

// Props when multiple = false
export interface CommonSelectSingleProps<T extends string | number> {
  multiple?: false;
  value: T | null;
  onChange: (value: T | null) => void;
}

// Props when multiple = true
export interface CommonSelectMultipleProps<T extends string | number> {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
}

export interface CommonSelectBaseProps<T extends string | number> {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  error?: boolean;
  helperText?: string;
  sx?: React.CSSProperties;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  withFilter?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ElementType;
  fullWidth?: boolean;
  chipStyle?: SxProps<Theme>;
}

export type CommonSelectProps<T extends string | number> =
  | (CommonSelectBaseProps<T> & CommonSelectSingleProps<T>)
  | (CommonSelectBaseProps<T> & CommonSelectMultipleProps<T>);

const StyledSelect = styled(Select)(({ theme }) => ({
  minHeight: "40px",
  backgroundColor: "#E2E6EB",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "none",
  ".MuiOutlinedInput-notchedOutline": { border: 0 },
  "&.MuiOutlinedInput-root": {
    padding: "4px 8px",
    "&:hover .MuiOutlinedInput-notchedOutline": { border: 0 },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 },
    "&.Mui-error": {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: theme.palette.error.light + "10",
    },
  },
  "& .MuiSelect-select": {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "4px",
    minHeight: "40px",
    lineHeight: "1.2",
    padding: "4px 8px",
  },
}));

function CommonSelect<T extends string | number>({
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
  helperText,
  sx,
  startIcon,
  withFilter = false,
  endIcon: CustomIcon,
  fullWidth = false,
  multiple,
  chipStyle,
  ...rest
}: CommonSelectProps<T>) {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (multiple) {
      const val = event.target.value as T[];
      onChange(val);
    } else {
      const val = event.target.value as T;
      onChange(val ?? null);
    }
  };

  const renderValue = (selected: unknown) => {
    if (multiple) {
      const val = selected as T[];
      if (!val || val.length === 0) {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px",
              color: "text.secondary",
            }}
          >
            {startIcon ??
              (withFilter && <FilterAltIcon sx={{ fontSize: 16 }} />)}
            {placeholder || "Select"}
          </Box>
        );
      }

      return (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {startIcon ?? (withFilter && <FilterAltIcon sx={{ fontSize: 16 }} />)}
          {val.map((v) => {
            const option = options.find((o) => o.value === v);
            if (!option) return null;
            return (
              <CommonChip
                key={v}
                title={option.label}
                style={{
                  ...chipStyle,
                }}
              />
            );
          })}
        </Box>
      );
    } else {
      const val = selected as T | null;
      if (!val) {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px",
              color: "text.secondary",
            }}
          >
            {startIcon ??
              (withFilter && <FilterAltIcon sx={{ fontSize: 16 }} />)}
            {placeholder || "Select"}
          </Box>
        );
      }

      const selectedOption = options.find((o) => o.value === val);
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {startIcon ?? (withFilter && <FilterAltIcon sx={{ fontSize: 16 }} />)}
          {selectedOption?.label ?? String(val)}
        </Box>
      );
    }
  };

  return (
    <Stack spacing={1} sx={{ width: fullWidth ? "100%" : "auto" }}>
      {label && <Typography variant="body2">{label}</Typography>}

      <StyledSelect
        multiple={multiple}
        value={value ?? (multiple ? [] : "")}
        onChange={handleChange}
        displayEmpty
        fullWidth={fullWidth}
        renderValue={renderValue}
        IconComponent={CustomIcon || KeyboardArrowDownIcon}
        error={error}
        sx={sx}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "12px",
              mt: 1,
            },
          },
        }}
        {...rest}
      >
        {options.map((option, index) => [
          <MenuItem
            sx={{ fontSize: "12px" }}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>,
          index !== options.length - 1 && (
            <Divider
              key={`${option.value}-divider`}
              sx={{ mt: 1, color: "#E2E6EB", marginInline: "12px" }}
            />
          ),
        ])}
      </StyledSelect>

      {helperText && (
        <Typography variant="body2" color={error ? "error" : "text.secondary"}>
          {helperText}
        </Typography>
      )}
    </Stack>
  );
}

export default CommonSelect;
