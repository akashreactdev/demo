"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
import CommonButton from "../CommonButton";
import CloseIcon from "@mui/icons-material/Close";
import CommonChip from "../CommonChip";
import { DateFilterOptions } from "@/constants/usersData";

interface FilterOption {
  id: number;
  label: string;
  value: string | number | boolean;
}

interface FilterConfig {
  emailVerification?: boolean;
  accountStatus?: boolean;
  dateFilter?: boolean;
  carePlan?: boolean;
  logStatus?: boolean;
  logType?: boolean;
  passportStatus?: boolean;
  jobListingStatus?: boolean;
  careType?: boolean;
  visitLogsStatus?: boolean;
  serviceAgreementStatus?: boolean;
  transactionPaymentType?: boolean;
  transactionPaymentStatus?: boolean;
  transactionDate?: boolean;
  accessAccountStatus?: boolean;
  accessUserType?: boolean;
  notificationUserBase?: boolean;
  supportUrgencyLevel?: boolean;
  supportTicketStatus?: boolean;
  supportDateCreated?: boolean;
  partnerType?: boolean;
  userType?: boolean;
  jobListing?: boolean;
}

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  title?: string;
  filterConfig?: FilterConfig;
}

const FILTER_DATA: Record<string, FilterOption[]> = {
  emailVerification: [
    { id: 1, label: "Pending", value: "pending" },
    { id: 2, label: "Verified", value: "verified" },
  ],
  accountStatus: [
    { id: 1, label: "Pending", value: "pending" },
    { id: 2, label: "Active", value: "active" },
    { id: 3, label: "Deactivated", value: "deactivated" },
  ],
  carePlan: [
    { id: 1, label: "Active", value: 1 },
    { id: 2, label: "Archived", value: 2 },
  ],
  logStatus: [
    { id: 1, label: "Administrated", value: "administered" },
    { id: 2, label: "Deleted", value: "deleted" },
  ],
  logStatusPrescription: [
    { id: 1, label: "Active", value: "active" },
    { id: 2, label: "Archived", value: "archived" },
    { id: 3, label: "Deleted", value: "deleted" },
  ],
  logType: [
    { id: 1, label: "Carer logs", value: false },
    { id: 2, label: "Scanned prescriptions", value: true },
  ],
  passportStatus: [
    { id: 1, label: "Under review", value: 1 },
    { id: 2, label: "Passport issued", value: 3 },
    { id: 3, label: "Declined", value: 4 },
  ],
  jobListingStatus: [
    { id: 1, label: "Pending", value: "pending" },
    // { id: 2, label: "Active", value: "active" },
    { id: 3, label: "Completed", value: "completed" },
  ],
  careType: [
    { id: 1, label: "Urgent", value: 2 },
    { id: 2, label: "Hourly", value: 1 },
    { id: 3, label: "Overnight", value: 3 },
    { id: 4, label: "Live-in", value: 4 },
  ],
  visitLogsStatus: [
    { id: 1, label: "Pending", value: 1 },
    { id: 2, label: "Confirmed", value: 2 },
    { id: 3, label: "Declined", value: 3 },
  ],
  serviceAgreementStatus: [
    { id: 1, label: "Active", value: "active" },
    { id: 2, label: "Completed", value: "completed" },
  ],
  transactionPaymentType: [
    { id: 1, label: "Carer", value: 3 },
    { id: 2, label: "Provider", value: 5 },
  ],
  transactionPaymentStatus: [
    { id: 1, label: "Pending", value: "pending" },
    { id: 2, label: "Completed", value: "completed" },
  ],
  accessAccountStatus: [
    { id: 1, label: "Active", value: 3 },
    { id: 2, label: "Suspended", value: 8 },
  ],
  accessUserType: [
    { id: 1, label: "Super-admin", value: 6 },
    { id: 2, label: "Sub-admin", value: 1 },
  ],
  notificationUserBase: [
    { id: 1, label: "All", value: "all" },
    { id: 2, label: "Carers", value: "carers" },
    { id: 3, label: "Clinicals", value: "clinicals" },
    { id: 4, label: "Providers", value: "providers" },
  ],
  supportUrgencyLevel: [
    { id: 1, label: "Low", value: 1 },
    { id: 2, label: "Medium", value: 2 },
    { id: 3, label: "High", value: 3 },
  ],
  supportTicketStatus: [
    { id: 1, label: "Pending", value: 1 },
    { id: 2, label: "In-progress", value: 2 },
    { id: 3, label: "Resolved", value: 3 },
  ],
  partnerType: [
    { id: 1, label: "Managed Care", value: "managed_care" },
    { id: 2, label: "HR Managed", value: "hr_managed" },
  ],
  jobListing: [
    { id: 1, label: "Active", value: 1 },
    { id: 2, label: "In-active", value: 3 },
  ],
};

const FilterModal: React.FC<ReasonModalProps> = ({
  isOpen,
  onClose,
  onClick,
  title,
  filterConfig = { dateFilter: true },
}) => {
  const pathName = usePathname();
  const [filters, setFilters] = useState<
    Record<string, string | number | boolean | null>
  >({});

  useEffect(() => {
    const saved = localStorage.getItem("selectedFilters");
    const parsed = saved ? JSON.parse(saved) : {};

    // Initialize all filter states
    const initialFilters = {
      emailVerification: parsed.emailVerification ?? null,
      accountStatus: parsed.accountStatus ?? null,
      carePlan: parsed.carePlan ?? null,
      dateFilter: parsed.dateFilter ?? null,
      logStatus: parsed.logStatus ?? null,
      logType:
        parsed.logType ??
        (filterConfig?.logType ? FILTER_DATA.logType[0]?.value : null),
      passportStatus: parsed.passportStatus ?? null,
      jobListingStatus: parsed.jobListingStatus ?? null,
      careTypeValue: parsed.careTypeValue ?? null,
      visitLogStatusValue: parsed.visitLogStatusValue ?? null,
      // visitLogStatusValue:
      //   parsed.visitLogStatusValue ??
      //   (filterConfig?.visitLogsStatus
      //     ? FILTER_DATA.visitLogsStatus[0]?.value
      //     : null),
      agreementStatus: parsed.agreementStatus ?? null,
      transactionPaymentType: parsed.transactionPaymentType ?? null,
      transactionPaymentStatus: parsed.transactionPaymentStatus ?? null,
      transactionDate: parsed.transactionDate ?? null,
      accessAccountStatus: parsed.accessAccountStatus ?? null,
      accessUserType: parsed.accessUserType ?? null,
      notificationUserBase: parsed.notificationUserBase ?? null,
      supportUrgencyLevel: parsed.supportUrgencyLevel ?? null,
      supportTicketStatus: parsed.supportTicketStatus ?? null,
      supportDateCreated: parsed.supportDateCreated ?? null,
      partnerType: parsed.partnerType ?? null,
      userType: parsed.userType ?? null,
      jobListing: parsed.jobListing ?? null,
    };

    setFilters(initialFilters);
  }, [isOpen, filterConfig, pathName]);

  const handleFilterChange = (
    filterKey: string,
    value: string | number | boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? null : value,
    }));
  };

  const handleDone = () => {
    localStorage.setItem("selectedFilters", JSON.stringify(filters));
    // console.log("Selected Filters:", filters);
    onClick();
  };

  const handleReset = () => {
    localStorage.removeItem("selectedFilters");
    setFilters({});
    onClose();
  };

  const selectedCount = Object.values(filters).filter(
    (val) => val !== null
  ).length;

  const renderFilterSection = (
    key: string,
    title: string,
    options: FilterOption[],
    filterKey: string = key
  ) => (
    <Box mt={2}>
      <Typography variant="body1">{title}</Typography>
      <Divider sx={{ mt: 1 }} />
      <Stack mt={2} flexDirection="row" gap={2} flexWrap="wrap">
        {options.map((option) => (
          <CommonChip
            key={option.id}
            title={option.label}
            style={{
              border: `1px solid ${
                filters[filterKey] === option.value ? "#518ADD" : "#E2E6EB"
              }`,
              backgroundColor:
                filters[filterKey] === option.value ? "#ECF2FB" : "#FFFFFF",
              borderRadius: "80px",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f0f4ff" },
            }}
            textStyle={{
              color:
                filters[filterKey] === option.value ? "#4A56DB" : "#000000",
              fontSize: "15px",
            }}
            onClick={() => handleFilterChange(filterKey, option.value)}
          />
        ))}
      </Stack>
    </Box>
  );

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
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontSize="18px" fontWeight={500} pt={2}>
              {title || "Filter results"}
            </Typography>
            <Typography variant="body1">
              {selectedCount > 0
                ? `${selectedCount} item${selectedCount > 1 ? "s" : ""}`
                : ""}
            </Typography>
          </Box>
          <Box
            component="button"
            sx={{
              border: "none",
              backgroundColor: "#E2E6EB",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            <CloseIcon sx={{ height: "31px", width: "31px" }} />
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 2,
          mb: 2,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#a8a8a8" },
          },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        }}
      >
        <Stack gap={2} sx={{ p: 2, pt: 1, pb: 0 }}>
          {filterConfig.partnerType &&
            renderFilterSection(
              "partnerType",
              "Partner type",
              FILTER_DATA.partnerType
            )}

          {filterConfig.jobListing &&
            renderFilterSection(
              "jobListing",
              "Job listings",
              FILTER_DATA.jobListing
            )}

          {filterConfig.userType &&
            renderFilterSection(
              "userType",
              "User type",
              FILTER_DATA.transactionPaymentType
            )}

          {filterConfig.emailVerification &&
            renderFilterSection(
              "emailVerification",
              "Email Notification",
              FILTER_DATA.emailVerification
            )}

          {filterConfig.accountStatus &&
            renderFilterSection(
              "accountStatus",
              "Account Status",
              FILTER_DATA.accountStatus
            )}

          {filterConfig.carePlan &&
            renderFilterSection(
              "carePlan",
              "Care Plan Type",
              FILTER_DATA.carePlan
            )}

          {filterConfig.jobListingStatus &&
            renderFilterSection(
              "jobListingStatus",
              "Status",
              FILTER_DATA.jobListingStatus
            )}

          {filterConfig.passportStatus &&
            renderFilterSection(
              "passportStatus",
              "Passport status",
              FILTER_DATA.passportStatus
            )}

          {filterConfig.careType &&
            renderFilterSection(
              "careType",
              "Care type",
              FILTER_DATA.careType,
              "careTypeValue"
            )}

          {filterConfig.logType &&
            renderFilterSection(
              "logType",
              "Medication log types",
              FILTER_DATA.logType
            )}

          {filterConfig.visitLogsStatus &&
            renderFilterSection(
              "visitLogsStatus",
              "Visit log status",
              FILTER_DATA.visitLogsStatus,
              "visitLogStatusValue"
            )}

          {filterConfig.logStatus &&
            renderFilterSection(
              "logStatus",
              "Medication care status",
              filters.logType
                ? FILTER_DATA.logStatusPrescription
                : FILTER_DATA.logStatus
            )}

          {filterConfig.serviceAgreementStatus &&
            renderFilterSection(
              "serviceAgreementStatus",
              "Service Agreement",
              FILTER_DATA.serviceAgreementStatus,
              "agreementStatus"
            )}

          {filterConfig.notificationUserBase &&
            renderFilterSection(
              "notificationUserBase",
              "User base",
              FILTER_DATA.notificationUserBase
            )}

          {filterConfig.accessAccountStatus &&
            renderFilterSection(
              "accessAccountStatus",
              "Account status",
              FILTER_DATA.accessAccountStatus
            )}

          {filterConfig.accessUserType &&
            renderFilterSection(
              "accessUserType",
              "User type",
              FILTER_DATA.accessUserType
            )}

          {filterConfig.transactionPaymentType &&
            renderFilterSection(
              "transactionPaymentType",
              "Payment type",
              FILTER_DATA.transactionPaymentType
            )}

          {filterConfig.transactionPaymentStatus &&
            renderFilterSection(
              "transactionPaymentStatus",
              "Payment status",
              FILTER_DATA.transactionPaymentStatus
            )}

          {filterConfig.transactionDate &&
            renderFilterSection(
              "transactionDate",
              "Transaction Date",
              DateFilterOptions
            )}

          {filterConfig.supportUrgencyLevel &&
            renderFilterSection(
              "supportUrgencyLevel",
              "Urgency level",
              FILTER_DATA.supportUrgencyLevel
            )}

          {filterConfig.supportTicketStatus &&
            renderFilterSection(
              "supportTicketStatus",
              "Ticket status",
              FILTER_DATA.supportTicketStatus
            )}

          {filterConfig.supportDateCreated &&
            renderFilterSection(
              "supportDateCreated",
              "Date Created",
              DateFilterOptions
            )}

          {filterConfig.dateFilter &&
            renderFilterSection("dateFilter", "Date Added", DateFilterOptions)}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: "20px", borderTop: "1px solid #EAEAEA" }}>
        <CommonButton
          buttonText="Reset"
          onClick={handleReset}
          sx={{
            bgcolor: "#ffffff",
            color: "#000",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
        />
        <CommonButton buttonText="Done" type="submit" onClick={handleDone} />
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;
