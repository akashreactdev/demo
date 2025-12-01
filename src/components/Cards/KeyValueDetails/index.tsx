"use client";
import React from "react";
import { Box, Typography, Divider, TextField } from "@mui/material";

interface KeyValueItem {
  label: string;
  value: string | number | React.ReactNode;
  key?: string;
}

interface KeyValueDetailsProps {
  items?: KeyValueItem[];
  heading?: string;
  isRemoveBorderBottom?: boolean;
  isEditable?: boolean;
  onChange?: (key: string | undefined, value: string) => void;
}

const KeyValueDetails: React.FC<KeyValueDetailsProps> = ({
  items,
  heading,
  isRemoveBorderBottom = true,
  isEditable = false,
  onChange,
}) => {
  return (
    <Box sx={{ border: "1px solid #EAEAEA", borderRadius: "10px" }}>
      {heading && (
        <>
          <Box
            sx={{
              p: "12px",
              backgroundColor: "#EAEAEA",
              borderTopLeftRadius: "inherit",
              borderTopRightRadius: "inherit",
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              {heading}
            </Typography>
          </Box>
          <Divider />
        </>
      )}

      {items?.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.key || `key-value-item-${index}`}>
            <Box
              sx={{
                p: "12px",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "common.white",
                borderBottomRightRadius: isLast ? "10px" : 0,
                borderBottomLeftRadius: isLast ? "10px" : 0,
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {item.label}:
              </Typography>
              {isEditable ? (
                <TextField
                  size="small"
                  variant="outlined"
                  value={
                    typeof item.value === "string" ||
                    typeof item.value === "number"
                      ? item.value
                      : ""
                  }
                  onChange={(e) => onChange?.(item.key, e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                      padding: "0 !important",
                      height: "0 !important",
                      width: "260px !important",
                    },
                  }}
                />
              ) : (
                <Typography variant="body1" fontWeight={400}>
                  {item.value}
                </Typography>
              )}
            </Box>
            {isRemoveBorderBottom && (
              <>{index < items.length - 1 && <Divider />}</>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default KeyValueDetails;
