"use client";
import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Button, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
//relative path imports
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import CommonTable from "@/components/CommonTable";
import { appFeedbackData } from "@/constants/appFeedbackData";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface AppFeedbackData {
  id?: number;
  userName?: string;
  emailAddress?: string;
  feedbackMessage?: string;
  dateReceived?: string;
}

interface ActionItem {
  label: string;
  value: "view-feedback";
}

const PushNotifications: React.FC = () => {
const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (action: string, row: AppFeedbackData) => {
    console.log(`Action: ${action}, Row ID: ${row.id}`);
    navigateWithLoading("/settings/app-feedback/view-feedback");
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const actionItems: ActionItem[] = [
    { label: "View feedback", value: "view-feedback" },
  ];

  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "User name",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "emailAddress",
      headerName: "Email address",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "feedbackMessage",
      headerName: "Feedback message",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "dateReceived",
      headerName: "Date received",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={(event) => handleActionClick(event, params.row.id)}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              backgroundColor: "#f5f5f7",
              color: "#000",
              textTransform: "none",
              borderRadius: "8px",
              minWidth: "100px",
              height: "30px",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: "#e8e8ea",
              },
            }}
          >
            <Typography variant="caption" fontWeight={500}>
              Select
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow === params.row.id}
            onClose={handleClose}
          >
            {actionItems.map((action, idx) => (
              <MenuItem
                key={idx}
                onClick={() => handleActionItemClick(action.value, params.row)}
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"space-between"}
          spacing={isMobile ? 2 : 0}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Manage push notifications
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              Send push notifications to users, carers, providers, or
              clinicians.
            </Typography>
          </Box>
          <CommonButton
            buttonText="New push notification"
            sx={{ maxWidth: isMobile ? "100%" : "max-content" }}
            buttonTextStyle={{ fontSize: "14px !important" }}
          />
        </Stack>
      </CommonCard>
      <Box mt={4}>
        <CommonTable column={columns} rows={appFeedbackData} isPaginations />
      </Box>
    </Box>
  );
};

export default PushNotifications;
