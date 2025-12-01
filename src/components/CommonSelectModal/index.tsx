"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
//relative path imports
import CommonButton from "../CommonButton";
import CommonSelect from "../CommonSelect";

interface OptionType {
  label: string;
  value: string | number;
}

interface SelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSet?: () => void;
  onChangeEvent?: (value: number | null) => void;
  // New props with default values
  title?: string;
  description?: string;
  options?: OptionType[];
}

const SelectModal: React.FC<SelectModalProps> = ({
  isOpen,
  onClose,
  onSet,
  onChangeEvent,
  // Props with default values
  title = "Schedule Reminder",
  description = "Set a specific event date and time to deliver the reminder",
  options = [
    { label: "New Years Day", value: 1 },
    { label: "Womans Day", value: 2 },
    { label: "Halloween", value: 3 },
    { label: "Valentines Day", value: 4 },
    { label: "World Health Day", value: 5 },
  ],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          p: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
            {title}
          </Typography>

          <Divider />

          <Box mt={1}>
            <Typography align="center" mb={3} mt={2}>
              {description}
            </Typography>
            <CommonSelect
              label=""
              placeholder="Please Select...."
              value={selectedEvent}
              onChange={(value: string | number | null) => {
                const parsedValue = value !== null ? Number(value) : null;
                setSelectedEvent(parsedValue);
                onChangeEvent?.(parsedValue);
              }}
              options={options}
              sx={{
                width: "100%",
                height: "50px",
                fontSize: "16px",
                backgroundColor: "#ffffff",
                border: "1px solid #EAEAEA",
              }}
            />
          </Box>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <CommonButton
              buttonText="Cancel"
              onClick={onClose}
              sx={{
                bgcolor: "#ffffff",
                color: "#000",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
            />
            <CommonButton
              buttonText="Set"
              onClick={() => {
                onSet?.();
              }}
            />
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SelectModal;
