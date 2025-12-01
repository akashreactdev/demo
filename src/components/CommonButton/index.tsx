"use client";
import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

interface CommonButtonProps {
  buttonText: string;
  loading?: boolean;
  disabled?: boolean;
  buttonTextStyle?: React.CSSProperties;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  type?: "button" | "reset" | "submit";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "text" | "outlined" | "contained";
}

const StyledButton = styled(Button)(({ theme, disabled }) => ({
  backgroundColor: disabled
    ? theme.palette.action.disabledBackground
    : theme.palette.primary.main,
  textTransform: "none",
  height: "55px",
  paddingInline: "20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
  [theme.breakpoints.down("md")]: {
    height: "45px",
  },
}));

const CommonButton: React.FC<CommonButtonProps> = ({
  buttonText,
  loading = false,
  disabled,
  buttonTextStyle = {},
  onClick,
  type,
  sx,
  startIcon,
  endIcon,
  variant,
  ...rest
}) => {
  return (
    <StyledButton
      onClick={onClick}
      fullWidth
      disabled={disabled}
      type={type}
      disableRipple
      disableTouchRipple
      disableFocusRipple
      sx={sx}
      variant={variant}
      startIcon={!loading && startIcon ? startIcon : undefined}
      endIcon={!loading && endIcon ? endIcon : undefined}
      {...rest}
    >
      {loading ? (
        <Box>
          <CircularProgress size={20} />
        </Box>
      ) : (
        <Typography
          variant="h6"
          fontWeight={500}
          sx={{
            color: disabled ? "action.disabled" : "common.black",
            ...buttonTextStyle,
            // whiteSpace: "nowrap",
            // overflow: "hidden",
            // textOverflow: "ellipsis",
          }}
        >
          {buttonText}
        </Typography>
      )}
    </StyledButton>
  );
};

export default CommonButton;
