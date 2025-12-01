"use client";
import React from "react";
import { Box, Typography, Divider, TextField, Select, MenuItem, FormControl } from "@mui/material";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SubField {
  label: string;
  value: string | number;
  key: string;
  inputType?: 'text' | 'select' | 'number';
  options?: SelectOption[];
  isEditable?: boolean; // Add this property
}

export interface KeyValueItem {
  label: string;
  value: string | number | React.ReactNode;
  key?: string;
  inputType?: 'text' | 'select' | 'number';
  options?: SelectOption[];
  subFields?: SubField[];
  isEditable?: boolean; // Add this property
}

interface KeyValueDetailsProps {
  items?: KeyValueItem[];
  heading?: string;
  isRemoveBorderBottom?: boolean;
  isEditable?: boolean;
  onChange?: (key: string | undefined, value: string) => void;
}

const KeyValueDetailsForUser: React.FC<KeyValueDetailsProps> = ({
  items,
  heading,
  isRemoveBorderBottom = true,
  isEditable = false,
  onChange,
}) => {
  const renderEditableField = (item: KeyValueItem | SubField, isSubField = false) => {
    const baseStyles = {
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
        height: "auto !important",
        minHeight: "24px !important",
        width: isSubField ? "220px !important" : "260px !important",
      },
    };

    if (item.inputType === 'select' && item.options) {
      const validValue = item.options.find(option => option.value === item.value) 
        ? item.value 
        : (item.options[0]?.value || '');
      return (
        <FormControl size="small" sx={{ minWidth: isSubField ? 220 : 260 }}>
          <Select
            value={validValue}
            onChange={(e) => onChange?.(item.key, e.target.value as string)}
            displayEmpty
            sx={{
              ...baseStyles["& .MuiOutlinedInput-root"],
              "& .MuiSelect-select": {
                padding: "4px 8px !important",
                minHeight: "unset !important",
              },
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            }}
          >
            {item.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        size="small"
        variant="outlined"
        type={item.inputType === 'number' ? 'number' : 'text'}
        value={
          typeof item.value === "string" || typeof item.value === "number"
            ? item.value
            : ""
        }
        onChange={(e) => onChange?.(item.key, e.target.value)}
        sx={baseStyles}
      />
    );
  };

  const getAllItemsForRendering = () => {
    if (!items) return [];
    
    if (!isEditable) {
      return items;
    }

    // When editable, only show items that are actually editable
    const editableItems: KeyValueItem[] = [];
    
    items.forEach((item) => {
      if (item.subFields && item.subFields.length > 0) {
        // Add only editable subfields as separate items
        item.subFields.forEach((subField) => {
          if (subField.isEditable) { // Only add if subfield is editable
            editableItems.push({
              label: subField.label,
              value: subField.value,
              key: subField.key,
              inputType: subField.inputType,
              options: subField.options,
              isEditable: subField.isEditable,
            });
          }
        });
      } else if (item.isEditable) { // Only add if main item is editable
        // Add regular item only if it's editable
        editableItems.push(item);
      }
    });
    
    return editableItems;
  };

  const itemsToRender = getAllItemsForRendering();

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

      {itemsToRender?.map((item, index) => {
        const isLast = index === itemsToRender.length - 1;

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
              {isEditable && item.isEditable ? (
                renderEditableField(item)
              ) : (
                <Typography variant="body1" fontWeight={400}>
                  {item.inputType === 'select' && item.options
                    ? item.options.find(option => option.value === item.value)?.label || item.value
                    : item.value
                  }
                </Typography>
              )}
            </Box>
            {isRemoveBorderBottom && (
              <>{index < itemsToRender.length - 1 && <Divider />}</>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default KeyValueDetailsForUser;