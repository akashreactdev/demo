import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Typography, TextFieldProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { SxProps, Theme } from "@mui/material";

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  isBoldLabel?: boolean;
  placeholder?: string;
  isStatic?: boolean;
  disablePast?: boolean;
  isLabelBold?: boolean;
  sx?: SxProps<Theme>;
  error?: boolean;
  helperText?: React.ReactNode;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

const CommonDatePicker: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  isStatic,
  disablePast,
  isLabelBold,
  sx,
  error,
  helperText,
  minDate,
  maxDate,
}) => {
  // Convert Date to Dayjs for the component
  const dayjsValue = value ? dayjs(value) : null;

  // Handle change and convert Dayjs back to Date for the parent
  const handleChange = (newValue: Dayjs | null) => {
    onChange(newValue ? newValue.toDate() : null);
  };

  return (
    <Box>
      <Typography
        variant={isLabelBold ? "subtitle1" : "body2"}
        fontWeight={isLabelBold ? 500 : "inherit"}
        mb={"5px"}
      >
        {label}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {!isStatic ? (
          <DatePicker
            value={dayjsValue}
            onChange={handleChange}
            slots={{
              openPickerIcon: CalendarMonthIcon,
            }}
            minDate={minDate}
            maxDate={maxDate}
            slotProps={{
              textField: {
                placeholder,
                fullWidth: true,
                error,
                helperText,
                variant: "outlined",
                sx: [
                  {
                    "& .MuiOutlinedInput-root": {
                      height: "50px",
                      fontSize: "16px",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #EAEAEA",
                      "&.Mui-focused": {
                        borderColor: "#EAEAEA",
                      },
                      "&:focus-within": {
                        borderColor: "#EAEAEA",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                    },
                  },
                  sx,
                ],
              } as TextFieldProps,
              day: {
                sx: {
                  "&.Mui-selected": {
                    backgroundColor: "#EAEAEA",
                    color: "#ffffff",
                  },
                },
              },
            }}
          />
        ) : (
          <StaticDatePicker
            value={dayjsValue}
            onChange={handleChange}
            slots={{ actionBar: () => null }}
            disablePast={disablePast}
          />
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default CommonDatePicker;
