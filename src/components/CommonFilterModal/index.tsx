"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CommonButton from "../CommonButton";
import CommonChip from "../CommonChip";

interface FilterOption {
  id: number;
  label: string;
  value: number;
}
interface Filters {
  monthFilter: number | null;
}
interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
  title?: string;
  filters: Filters;
  onChange: (key: keyof Filters, value: Filters[keyof Filters]) => void;
}

export const MONTH_FILTER_DATA: Record<string, FilterOption[]> = {
  monthFilter: [
    { id: 1, label: "January", value: 1 },
    { id: 2, label: "February", value: 2 },
    { id: 3, label: "March", value: 3 },
    { id: 4, label: "April", value: 4 },
    { id: 5, label: "May", value: 5 },
    { id: 6, label: "June", value: 6 },
    { id: 7, label: "July", value: 7 },
    { id: 8, label: "August", value: 8 },
    { id: 9, label: "September", value: 9 },
    { id: 10, label: "October", value: 10 },
    { id: 11, label: "November", value: 11 },
    { id: 12, label: "December", value: 12 },
  ],
};

const CommonFilterModal: React.FC<ReasonModalProps> = ({
  isOpen,
  onClose,
  onDone,
  title,
  filters,
  onChange,
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>({ ...filters });

  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters, isOpen]);

  const handleChange = (key: keyof Filters, value: number) =>
    setLocalFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));

  const handleDone = () => {
    Object.entries(localFilters).forEach(([k, v]) =>
      onChange(k as keyof Filters, v)
    );
    onDone();
  };

  const handleReset = () => {
    setLocalFilters({ monthFilter: null });
    onChange("monthFilter", null);
    onDone();
  };

  const selectedCount = Object.values(localFilters).filter(
    (v) => v !== null
  ).length;

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isOpen}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 2, boxShadow: 3, p: 0 } }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontSize={18} fontWeight={500} pt={2}>
              {title || "Filter results"}
            </Typography>
            {selectedCount > 0 && (
              <Typography variant="body1">{`${selectedCount} item${
                selectedCount > 1 ? "s" : ""
              }`}</Typography>
            )}
          </Box>
          <Box
            component="button"
            sx={{ border: 0, bgcolor: "#E2E6EB", cursor: "pointer" }}
            onClick={onClose}
          >
            <CloseIcon sx={{ width: 31, height: 31 }} />
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 2, mb: 2 }}>
        <Stack gap={2}>
          <Typography variant="body1">Month</Typography>
          <Divider />
          <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
            {MONTH_FILTER_DATA.monthFilter.map((option) => (
              <CommonChip
                key={option.id}
                title={option.label}
                style={{
                  border:
                    localFilters.monthFilter === option.value
                      ? "1px solid #518ADD"
                      : "1px solid #E2E6EB",
                  backgroundColor:
                    localFilters.monthFilter === option.value
                      ? "#ECF2FB"
                      : "#FFF",
                  borderRadius: 80,
                  cursor: "pointer",
                }}
                textStyle={{
                  color:
                    localFilters.monthFilter === option.value
                      ? "#4A56DB"
                      : "#000",
                  fontSize: 15,
                }}
                onClick={() => handleChange("monthFilter", option.value)}
              />
            ))}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #EAEAEA" }}>
        <CommonButton
          buttonText="Reset"
          onClick={handleReset}
          sx={{
            bgcolor: "#fff",
            color: "#000",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
        />
        <CommonButton buttonText="Done" onClick={handleDone} />
      </DialogActions>
    </Dialog>
  );
};

export default CommonFilterModal;
