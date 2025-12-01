"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonButton from "../CommonButton";
import { AdminCarerPermission, AdminClinicalPermission, AdminProviderPermission, AdminUserPermission } from "@/constants/accessData";


interface Permission {
  key: string;
  label: string;
}

interface Section {
  key: string;
  label: string;
  permissions: Permission[];
}

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (permissions: {
    userPermissions: number[];
    carerPermissions: number[];
    clinicalPermissions: number[];
    providerPermissions: number[];
  }) => void;
  title?: string;
  description?: string;
  adminInfo?: {
    userPermissions?: number[];
    carerPermissions?: number[];
    clinicalPermissions?: number[];
    providerPermissions?: number[];
  };
}

const defaultSections: Section[] = [
  {
    key: "users",
    label: "Users",
    permissions: [
      { key: "VIEW_USER_DETAILS", label: "View user details (Overview)" },
      { key: "DEACTIVATE_USER_ACCOUNT", label: "Deactivate user accounts" },
      { key: "CREATE_HEALTH_VIDEO", label: "Create health videos" },
    ],
  },
  {
    key: "carers",
    label: "Carers",
    permissions: [
      { key: "VIEW_CARER_DETAILS", label: "View carer details (overview)" },
      { key: "VERIFY_NEW_CARER_DETAILS", label: "Verify new carers details" },
      { key: "VIEW_CARER_PAYMENT_DISPUTE", label: "View payment disputes" },
    ],
  },
  {
    key: "clinical",
    label: "Clinical",
    permissions: [
      {
        key: "VIEW_CLINICAL_DETAILS",
        label: "View clinical details (overview)",
      },
      {
        key: "VERIFY_NEW_CLINICAL_DETAILS",
        label: "Verify new clinical details",
      },
      { key: "VIEW_CLINICAL_PAYMENT_DISPUTE", label: "View payment disputes" },
    ],
  },
  {
    key: "providers",
    label: "Provider",
    permissions: [
      {
        key: "VIEW_PROVIDER_DETAILS",
        label: "View Provider details (overview)",
      },
      {
        key: "VERIFY_NEW_PROVIDER_DETAILS",
        label: "Verify new provider details",
      },
      { key: "VIEW_PROVIDER_PAYMENT_DISPUTE", label: "View payment disputes" },
      { key: "CREATE_PROVIDER_RESOURCE", label: "Create provider resources" },
    ],
  },
];

// 🧠 Convert numeric API response → checkbox state
const mapPermissionsToInitial = (data: {
  userPermissions?: number[];
  carerPermissions?: number[];
  clinicalPermissions?: number[];
  providerPermissions?: number[];
}) => {
  const initial: Record<string, boolean> = {};

  Object.entries(AdminUserPermission).forEach(([key, value]) => {
    if (typeof value === "number") {
      initial[key] = data.userPermissions?.includes(value) || false;
    }
  });

  Object.entries(AdminCarerPermission).forEach(([key, value]) => {
    if (typeof value === "number") {
      initial[key] = data.carerPermissions?.includes(value) || false;
    }
  });

  Object.entries(AdminClinicalPermission).forEach(([key, value]) => {
    if (typeof value === "number") {
      initial[key] = data.clinicalPermissions?.includes(value) || false;
    }
  });

  Object.entries(AdminProviderPermission).forEach(([key, value]) => {
    if (typeof value === "number") {
      initial[key] = data.providerPermissions?.includes(value) || false;
    }
  });

  return initial;
};

// 🧠 Convert back checkbox state → numeric payload
const convertBackToNumbers = (selected: Record<string, boolean>) => {
  const userPermissions: number[] = [];
  const carerPermissions: number[] = [];
  const clinicalPermissions: number[] = [];
  const providerPermissions: number[] = [];

  for (const [key, isSelected] of Object.entries(selected)) {
    if (!isSelected) continue;

    if (key in AdminUserPermission) {
      userPermissions.push(
        AdminUserPermission[key as keyof typeof AdminUserPermission]
      );
    } else if (key in AdminCarerPermission) {
      carerPermissions.push(
        AdminCarerPermission[key as keyof typeof AdminCarerPermission]
      );
    } else if (key in AdminClinicalPermission) {
      clinicalPermissions.push(
        AdminClinicalPermission[key as keyof typeof AdminClinicalPermission]
      );
    } else if (key in AdminProviderPermission) {
      providerPermissions.push(
        AdminProviderPermission[key as keyof typeof AdminProviderPermission]
      );
    }
  }

  return {
    userPermissions,
    carerPermissions,
    clinicalPermissions,
    providerPermissions,
  };
};

const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  onClick,
  title,
  description,
  adminInfo,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (adminInfo) {
      const mapped = mapPermissionsToInitial(adminInfo);
      setSelectedPermissions(mapped);
    }
  }, [adminInfo]);

  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleDone = () => {
    const payload = convertBackToNumbers(selectedPermissions);
    onClick(payload);
  };

  const CustomCheckbox: React.FC<{
    checked: boolean;
    onChange: () => void;
    label: string;
  }> = ({ checked, onChange, label }) => (
    <FormControlLabel
      control={
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid",
            borderColor: checked ? "#4A90E2" : "#CCCCCC",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            mr: 1.5,
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#4A90E2",
            },
          }}
        >
          {checked && (
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#4A90E2",
              }}
            />
          )}
        </Box>
      }
      label={
        <Typography
          variant="body2"
          sx={{ fontSize: "16px", color: "#333", fontWeight: 400 }}
        >
          {label}
        </Typography>
      }
      onClick={onChange}
      sx={{
        alignItems: "center",
        ml: 0,
        mr: 0,
        mb: 0.5,
        cursor: "pointer",
        userSelect: "none",
        "& .MuiFormControlLabel-label": {
          paddingLeft: "8px",
          cursor: "pointer",
        },
        "&:hover": {
          "& .MuiFormControlLabel-label": {
            color: "#4A90E2",
          },
        },
      }}
    />
  );

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
      <DialogTitle>
        <Typography
          textAlign="center"
          fontSize="18px"
          fontWeight={500}
          pt={2}
        >
          {title || "Super admin permissions"}
        </Typography>
        <Box sx={{ mt: 2, px: 2 }}>
          <Divider />
        </Box>
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
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a8a8a8",
          },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        }}
      >
        <Box sx={{ p: 2, pt: 0, pb: 0 }}>
          <Stack rowGap={2}>
            <Typography
              textAlign="center"
              component="p"
              variant="caption"
              fontWeight={400}
              fontSize="15px"
              dangerouslySetInnerHTML={{
                __html:
                  description ||
                  `Manage access to all features and data.`,
              }}
            />

            <Box sx={{ mt: 1 }}>
              {defaultSections.map((section, index) => (
                <Accordion
                  key={section.key}
                  elevation={0}
                  disableGutters
                  sx={{
                    "&:before": { display: "none" },
                    borderBottom:
                      index !== defaultSections.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                    "& .MuiAccordionSummary-root": {
                      minHeight: 48,
                      px: 1,
                      pl: 2,
                    },
                    "& .MuiAccordionDetails-root": {
                      px: 3,
                      pb: 2,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#666" }} />}
                    sx={{
                      "& .MuiAccordionSummary-content": { margin: 0 },
                      border: "1px solid #EAEAEA",
                      marginBottom: "15px",
                      borderRadius: "10px",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{ fontSize: "15px", color: "#333" }}
                    >
                      {section.label}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ padding: "8px 16px 16px !important" }}>
                    <Stack spacing={2}>
                      {section.permissions.map((permission) => (
                        <CustomCheckbox
                          key={permission.key}
                          checked={selectedPermissions[permission.key] || false}
                          onChange={() =>
                            handlePermissionChange(permission.key)
                          }
                          label={permission.label}
                        />
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "20px", pt: 0 }}>
        <CommonButton
          buttonText="Cancel"
          onClick={onClose}
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

export default PermissionModal;
