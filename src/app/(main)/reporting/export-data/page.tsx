"use client";
import React, { useState } from "react";
import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid2 from "@mui/material/Grid2";
import CommonCard from "@/components/Cards/Common";
import DownloadDocumentButton from "@/components/DownloadDocumentBtn";
import CommonButton from "@/components/CommonButton";
import { AxiosResponse } from "axios";
import { DownloadDemographicDataPdf } from "@/services/api/reportingsAPI";

// ---------------- Options ----------------
const userOptions = [
  { label: "Account information", value: 1 },
  { label: "Service agreements", value: 2 },
  { label: "Care plan", value: 3 },
  { label: "Medical history", value: 4 },
  { label: "Medication log", value: 5 },
];

const carerOptions = [
  { label: "Account information", value: 1 },
  { label: "Profile information", value: 2 },
  { label: "Client and job listings", value: 3 },
  { label: "Care type & availability", value: 4 },
];

const clinicalOptions = [
  { label: "Account information", value: 1 },
  { label: "Profile information", value: 2 },
  { label: "Client and job listings", value: 3 },
  { label: "Care type & availability", value: 4 },
];

const providerOptions = [
  { label: "Account information", value: 1 },
  { label: "Profile information", value: 2 },
  { label: "Client and job listings", value: 3 },
  { label: "Care type & availability", value: 4 },
];

// ---------------- Modal Component ----------------
interface MultiSelectModalProps {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  value: number[];
  onChange: (val: number[]) => void;
  options: Array<{ value: number; label: string }>;
  heading: string;
}

const MultiSelectModal: React.FC<MultiSelectModalProps> = ({
  open,
  onClose,
  onDone,
  value,
  onChange,
  options,
  heading,
}) => {
  const toggleOption = (val: number) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>
        <Typography
          variant="body1"
          textAlign="center"
          fontWeight={500}
          fontSize="18px"
          pt={2}
        >
          {heading}
        </Typography>
        <Box sx={{ mt: 2, px: 2 }}>
          <Divider />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography
          variant="body1"
          textAlign="center"
          fontSize="15px"
          fontWeight={400}
          mb={2}
        >
          Choose the data points you’d like to capture
        </Typography>

        <FormGroup>
          {options.map((opt) => {
            const isChecked = value.includes(opt.value);
            return (
              <Box
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #EAEAEA",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  mb: 1.5,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: isChecked ? "#4A90E2" : "#CCCCCC",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  {isChecked && (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#4A90E2",
                      }}
                    />
                  )}
                </Box>
                <Typography variant="body1" fontSize="15px">
                  {opt.label}
                </Typography>
              </Box>
            );
          })}
        </FormGroup>
      </DialogContent>

      <DialogActions sx={{ padding: "20px", pt: 0 }}>
        <CommonButton
          buttonText="Cancel"
          sx={{
            bgcolor: "#ffffff",
            color: "#000",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
          onClick={onClose}
        />
        <CommonButton buttonText="Done" onClick={onDone} />
      </DialogActions>
    </Dialog>
  );
};

// ---------------- Section Component ----------------
interface SelectSectionProps {
  heading: string;
  description: string;
  options: Array<{ value: number; label: string }>;
  selected: number[];
  onSave: (selected: number[]) => void;
  role: number;
}

const SelectSection: React.FC<SelectSectionProps> = ({
  heading,
  description,
  options,
  selected,
  onSave,
  role,
}) => {
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<number[]>(selected);
  const [loadingType, setLoadingType] = useState<"pdf" | "csv" | null>(null);

  const handleDone = () => {
    onSave(tempSelected);
    setOpen(false);
  };

  const handleDownload = async (doc: "pdf" | "csv") => {
    setLoadingType(doc);
    try {
      const response = (await DownloadDemographicDataPdf({
        demographic: options
          .filter((opt) => selected.includes(opt.value))
          .map((opt) => opt.value)
          .join(","),
        format: doc === "pdf" ? 1 : doc === "csv" ? 2 : null,
        role: role,
      })) as AxiosResponse<Blob>;
      if (response && response.data) {
        setLoadingType(null);
        setTempSelected([]);
        onSave([]);
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        window.open(fileURL);
        setTimeout(() => window.URL.revokeObjectURL(fileURL), 10000);
      }
    } catch (e) {
      console.error("Error downloading report:", e);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <CommonCard>
      <Typography variant="h6" fontWeight={500}>
        {heading}
      </Typography>
      <Typography variant="caption" fontWeight={400}>
        {description}
      </Typography>
      <Box mt={3}>
        <Box
          onClick={() => {
            setTempSelected(selected);
            setOpen(true);
          }}
          sx={{
            width: "100%",
            height: "50px",
            border: "1px solid #EAEAEA",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="body2" color="textSecondary" noWrap>
            {selected.length > 0
              ? options
                  .filter((opt) => selected.includes(opt.value))
                  .map((opt) => opt.label)
                  .join(", ")
              : "Please select data point..."}
          </Typography>
        </Box>

        <MultiSelectModal
          open={open}
          onClose={() => setOpen(false)}
          onDone={handleDone}
          value={tempSelected}
          onChange={setTempSelected}
          options={options}
          heading={heading}
        />
      </Box>

      <Stack direction="row" spacing={2} mt={2}>
        <DownloadDocumentButton
          title={loadingType === "pdf" ? "Downloading..." : "Download PDF"}
          onClick={() => handleDownload("pdf")}
        />
        <DownloadDocumentButton
          title={loadingType === "csv" ? "Downloading..." : "Download CSV"}
          onClick={() => handleDownload("csv")}
        />
      </Stack>
    </CommonCard>
  );
};

// ---------------- Main Component ----------------
const ExportData = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [loadingType, setLoadingType] = useState<"pdf" | "csv" | null>(null);
  const [userSelected, setUserSelected] = useState<number[]>([]);
  const [carerSelected, setCarerSelected] = useState<number[]>([]);
  const [clinicalSelected, setClinicalSelected] = useState<number[]>([]);
  const [providerSelected, setProviderSelected] = useState<number[]>([]);

  const handleDownloadPDF = async (doc: "pdf" | "csv") => {
    setLoadingType(doc);
    try {
      const response = (await DownloadDemographicDataPdf({
        demographic: "1,2,3,4,5",
        role: "2,3,4,5",
        format: doc === "pdf" ? 1 : doc === "csv" ? 2 : null,
      })) as AxiosResponse<Blob>;
      if (response && response.data) {
        setLoadingType(null);
        setUserSelected([]);
        setCarerSelected([]);
        setClinicalSelected([]);
        setProviderSelected([]);
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        window.open(fileURL);
        setTimeout(() => window.URL.revokeObjectURL(fileURL), 10000);
      }
    } catch (e) {
      console.error("Error downloading report:", e);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={isTablet ? "column" : "row"}
          alignItems={isTablet ? "flex-start" : "center"}
          justifyContent={"space-between"}
        >
          <Box width={isTablet ? "auto" : "700px"}>
            <Typography variant="h6" fontWeight={500}>
              Complete Zorbee report
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              Gain a complete understanding of Zorbee performance by downloading
              the extensive overview report. This report consolidates all
              dashboard data points, offering a thorough and detailed summary of
              vital metrics.
            </Typography>
          </Box>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            mt={isTablet ? 2 : 0}
            width={isMobile ? "100%" : "auto"}
          >
            <DownloadDocumentButton
              title={loadingType === "pdf" ? "Downloading..." : "Download PDF"}
              onClick={() => handleDownloadPDF("pdf")}
            />
            <DownloadDocumentButton
              title={loadingType === "csv" ? "Downloading..." : "Download CSV"}
              onClick={() => handleDownloadPDF("csv")}
            />
          </Stack>
        </Stack>
      </CommonCard>

      <Box mt={3}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <SelectSection
              heading="User demographic"
              description="Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
              options={userOptions}
              selected={userSelected}
              onSave={setUserSelected}
              role={2}
            />
            <Box mt={3}>
              <SelectSection
                heading="Clinician demographic"
                description="Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
                options={clinicalOptions}
                selected={clinicalSelected}
                onSave={setClinicalSelected}
                role={4}
              />
            </Box>
          </Grid2>

          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <SelectSection
              heading="Carer demographic"
              description="Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
              options={carerOptions}
              selected={carerSelected}
              onSave={setCarerSelected}
              role={3}
            />
            <Box mt={3}>
              <SelectSection
                heading="Provider analytics"
                description="Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
                options={providerOptions}
                selected={providerSelected}
                onSave={setProviderSelected}
                role={5}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default ExportData;
