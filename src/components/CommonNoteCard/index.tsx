"use client";
import React, { ChangeEvent } from "react";
import { styled, SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface CommonNoteCardProps {
  title?: string;
  value?: string;
  placeholder?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  description?: string;
  error?: boolean;
  helperText?: string;
  name?: string;
  onBlur?: () => void;
  sx?: SxProps<Theme>;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const StyledTextArea = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    padding: "8px",
    marginTop: "12px",
    "& fieldset": {
      borderColor: theme.palette.mode === "light" ? "#E0E0E0" : "#424242",
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.mode === "light" ? "#BDBDBD" : "#616161",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#E0E0E0",
    },
    "& textarea": {
      minHeight: "70px",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.875rem",
    lineHeight: "1.5",
  },
}));

const CommonNoteCard: React.FC<CommonNoteCardProps> = ({
  title,
  value = "",
  placeholder = "",
  onChange,
  multiline = true,
  rows = 1,
  fullWidth = true,
  disabled = false,
  description,
  error,
  helperText,
  name,
  onBlur,
  sx,
  maxLength = 500,
  showCharacterCount = false,
  ...props
}) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    // If maxLength is set, limit the input
    if (maxLength && newValue.length > maxLength) {
      return;
    }

    if (onChange) {
      onChange(event);
    }
  };

  const characterCount = value?.length || 0;
  const isOverLimit = maxLength ? characterCount > maxLength : false;

  return (
    <Box>
      {title && (
        <Typography variant="subtitle1" fontWeight={500}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography component={"p"} variant="caption" fontWeight={400}>
          {description}
        </Typography>
      )}
      <Box sx={{ position: "relative" }}>
        <StyledTextArea
          multiline={multiline}
          rows={rows}
          fullWidth={fullWidth}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          error={error || isOverLimit}
          helperText={helperText}
          name={name}
          onBlur={onBlur}
          sx={sx}
          inputProps={showCharacterCount ? { maxLength } : undefined}
          {...props}
        />
        {showCharacterCount && (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              right: 12,
              bottom: 8,
              color: isOverLimit ? "error.main" : "text.secondary",
              backgroundColor: "background.paper",
              padding: "0 4px",
              fontSize: "0.75rem",
            }}
          >
            {characterCount}/{maxLength}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CommonNoteCard;
