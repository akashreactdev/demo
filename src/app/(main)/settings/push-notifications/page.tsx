"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
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
import { getAllPushNotifications } from "@/services/api/notificationsApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { UserBases } from "@/constants/usersData";

interface NotificationProps {
  id?: number;
  title?: string;
  message?: string;
  sentBy?: string;
  base?: string;
  datepublished?: string;
}

interface ActionItem {
  label: string;
  value: "view-feedback";
}

interface NotificationData {
  _id: string;
  notificationTitle: string;
  notificationMessage: string;
  userBase: number | null;
  reminderType: number | null;
  pushDate: string | null;
}

interface NotificationListResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      notifications: NotificationData[];
      totalDocs: number;
      unreadCount: number;
    };
  };
}

const PushNotifications: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notificationData, setNotificationData] = useState<NotificationData[]>(
    []
  );

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    setIsLoading(true);
    try {
      const response =
        (await getAllPushNotifications()) as NotificationListResponse;
      if (response?.data?.success) {
        setNotificationData(response?.data?.data?.notifications);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (action: string, row: NotificationProps) => {
    console.log(`Action: ${action}, Row ID: ${row.id}`);
    navigateWithLoading(`/settings/push-notifications/view-details/${row.id}`);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const actionItems: ActionItem[] = [
    { label: "View details", value: "view-feedback" },
  ];

  const columns: GridColDef[] = [
    {
      field: "notificationTitle",
      headerName: "Notification title",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "notificationMessage",
      headerName: "Message",
      minWidth: 200,
      width: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflowWrap: "break-word",
            whiteSpace: "normal",
            display: "block",
          }}
        >
          {params.value || "N/A"}
        </Typography>
      ),
    },
    { field: "sentBy", headerName: "Sent by", flex: 1, minWidth: 100 },
    {
      field: "userBase",
      headerName: "User base",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return UserBases[params.value] || "N/A";
      },
    },
    {
      field: "pushDate",
      headerName: "Date published",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.pushDate &&
              moment(params?.row?.pushDate).format("DD.MM.YYYY")) ||
              "N/A"}
          </Typography>
        );
      },
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
            PaperProps={{
              sx: {
                border: "1px solid #E2E6EB",
                borderRadius: "10px",
              },
            }}
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
            onClick={() =>
              navigateWithLoading(
                "/settings/push-notifications/new-push-notification"
              )
            }
          />
        </Stack>
      </CommonCard>
      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={notificationData}
          isLoading={isLoading}
          isPaginations
        />
      </Box>
    </Box>
  );
};

export default PushNotifications;
