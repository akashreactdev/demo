"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import DeleteModal from "@/components/DeleteModal";
import CommonChip from "@/components/CommonChip";
import {
  getAllNotifications,
  deleteNotification,
  archieveNotification,
  markAsReadNotification,
} from "@/services/api/notificationsApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface NotificationData {
  _id: string;
  date: string | null;
  description: string;
  isArchive: boolean;
  isMarkAsRead: boolean;
  notificationTitle: string;
  redirect: string;
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

interface NotificationDeleteResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface archieveNotificationResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface markAsReadNotificationResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface NotificationStatusProps {
  isMarkAsRead: boolean;
  isArchive: boolean;
  notificationId: string;
  redirect: string;
}

const DeleteIconView = styled(Box)(({ theme }) => ({
  height: "60px",
  width: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: theme.palette.common.white,
  cursor: "pointer",
}));

const Notifications: React.FC = () => {
  const theme = useTheme();
const { navigateWithLoading } = useRouterLoading();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<
    string | null
  >(null);
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
        (await getAllNotifications()) as NotificationListResponse;
      if (response?.data?.success) {
        setNotificationData(response?.data?.data?.notifications);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotifications = async (notificationId: string) => {
    setIsLoading(true);
    try {
      const response = (await deleteNotification(
        notificationId
      )) as NotificationDeleteResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllNotifications();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickDelete = (notificationId: string) => {
    setIsOpen(true);
    setSelectedNotification(notificationId);
  };

  const onRemove = () => {
    if (selectedNotification) {
      deleteNotifications(selectedNotification);
      setIsOpen(false);
      setSelectedNotification(null);
    }
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedNotification(null);
  };

  const handleArchieve = async (id: string, isArchive: boolean) => {
    try {
      const response = (await archieveNotification(
        id,
        isArchive
      )) as archieveNotificationResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllNotifications();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleMarkAsRead = async (id: string, isMarkAsRead: boolean) => {
    try {
      const response = (await markAsReadNotification(
        id,
        isMarkAsRead
      )) as markAsReadNotificationResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllNotifications();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRedirect = (redirect: string) => {
    const path = redirect.toLowerCase();
    navigateWithLoading(`/${path}s/overview`);
  };

  const NotificationStatus: React.FC<NotificationStatusProps> = ({
    isMarkAsRead,
    isArchive,
    notificationId,
    redirect,
  }) => {
    return (
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Box>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                color: "common.black",
                fontSize: "0.875rem",
              }}
              divider={<Typography sx={{ mx: 1 }}>|</Typography>}
            >
              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
                onClick={() => handleMarkAsRead(notificationId, isMarkAsRead)}
              >
                {isMarkAsRead ? "Mark as unread" : "Mark as read"}
              </Typography>

              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
                onClick={() => handleRedirect(redirect)}
              >
                Forward
              </Typography>

              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
                onClick={() => handleArchieve(notificationId, isArchive)}
              >
                {isArchive ? "Unarchive" : "Archive"}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>
    );
  };

  const today = moment().utc().format("YYYY-MM-DD");
  const todayNotifications = notificationData.filter((notification) => {
    const notifDate = moment(notification.date).utc().format("YYYY-MM-DD");
    return notifDate === today && notification.isArchive === true;
  });

  const yesterday = moment().utc().subtract(1, "day").format("YYYY-MM-DD");
  const yesterdayNotifications = notificationData.filter((notification) => {
    const notifDate = moment(notification.date).utc().format("YYYY-MM-DD");
    return notifDate === yesterday && notification.isArchive === true;
  });

  const twoDaysAgo = moment().utc().subtract(1, "days").startOf("day");
  const olderNotifications = notificationData
    .filter((notification) => {
      const notifDate = moment(notification.date).utc();
      return notifDate.isBefore(twoDaysAgo) && notification.isArchive === true;
    })
    .sort((a, b) => moment(b.date).diff(moment(a.date)));

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Your archive notifications
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              These are your notifications for the Zorbee admin dashboard that
              have been archived.
            </Typography>
          </Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            mt={isMobile ? 2 : 0}
          >
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => navigateWithLoading("/notifications")}
            >
              <CommonChip title="View all notifications" />
            </Box>
          </Stack>
        </Stack>
      </CommonCard>

      {isLoading ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"calc(100vh - 300px)"}
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        <>
          <Box mt={2}>
            {todayNotifications.length !== 0 && (
              <Typography variant="h6" fontWeight={500}>
                Today
              </Typography>
            )}
            {todayNotifications.map((notification) => (
              <Box mt={2} key={notification?._id}>
                <CommonCard
                  sx={{
                    backgroundColor: notification.isMarkAsRead ? "" : "#E2E6EB",
                  }}
                >
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Box width={isMobile ? "100%" : "90%"}>
                      <Typography variant="h6" fontWeight={500}>
                        {notification.notificationTitle}
                      </Typography>
                      <Typography mt={2} variant="caption" fontWeight={400}>
                        Date:{" "}
                        {moment(notification?.date)
                          .utc()
                          .format("Do MMMM YYYY")}
                      </Typography>
                      <Typography
                        component={"p"}
                        mt={1}
                        variant="caption"
                        fontWeight={400}
                      >
                        Description: {notification.description}
                      </Typography>

                      <NotificationStatus
                        isMarkAsRead={notification.isMarkAsRead}
                        isArchive={notification.isArchive}
                        notificationId={notification._id}
                        redirect={notification.redirect}
                      />
                    </Box>
                    <Box
                      width={isMobile ? "100%" : "10%"}
                      display={"flex"}
                      justifyContent={isMobile ? "flex-start" : "flex-end"}
                      mt={isMobile ? 1 : 0}
                    >
                      <DeleteIconView
                        onClick={() => onClickDelete(notification?._id)}
                      >
                        <Image
                          src={"/assets/svg/setting/delete.svg"}
                          alt="delete"
                          height={24}
                          width={24}
                        />
                      </DeleteIconView>
                    </Box>
                  </Stack>
                </CommonCard>
              </Box>
            ))}
          </Box>

          <Box mt={2}>
            {yesterdayNotifications.length !== 0 && (
              <Typography variant="h6" fontWeight={500}>
                Yesterday
              </Typography>
            )}
            {yesterdayNotifications.map((notification) => (
              <Box mt={2} key={notification?._id}>
                <CommonCard
                  sx={{
                    backgroundColor: notification.isMarkAsRead ? "" : "#E2E6EB",
                  }}
                >
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Box width={isMobile ? "100%" : "90%"}>
                      <Typography variant="h6" fontWeight={500}>
                        {notification.notificationTitle}
                      </Typography>
                      <Typography mt={2} variant="caption" fontWeight={400}>
                        Date:{" "}
                        {moment(notification?.date)
                          .utc()
                          .format("Do MMMM YYYY")}
                      </Typography>
                      <Typography
                        component={"p"}
                        mt={1}
                        variant="caption"
                        fontWeight={400}
                      >
                        Description: {notification.description}
                      </Typography>

                      <NotificationStatus
                        isMarkAsRead={notification.isMarkAsRead}
                        isArchive={notification.isArchive}
                        notificationId={notification._id}
                        redirect={notification.redirect}
                      />
                    </Box>
                    <Box
                      width={isMobile ? "100%" : "10%"}
                      display={"flex"}
                      justifyContent={isMobile ? "flex-start" : "flex-end"}
                      mt={isMobile ? 1 : 0}
                    >
                      <DeleteIconView
                        onClick={() => onClickDelete(notification?._id)}
                      >
                        <Image
                          src={"/assets/svg/setting/delete.svg"}
                          alt="delete"
                          height={24}
                          width={24}
                        />
                      </DeleteIconView>
                    </Box>
                  </Stack>
                </CommonCard>
              </Box>
            ))}
          </Box>

          <Box mt={2}>
            {olderNotifications.length !== 0 && (
              <Typography variant="h6" fontWeight={500}>
                Older
              </Typography>
            )}
            {olderNotifications.map((notification) => (
              <Box mt={2} key={notification?._id}>
                <CommonCard
                  sx={{
                    backgroundColor: notification.isMarkAsRead ? "" : "#E2E6EB",
                  }}
                >
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Box width={isMobile ? "100%" : "90%"}>
                      <Typography variant="h6" fontWeight={500}>
                        {notification.notificationTitle}
                      </Typography>
                      <Typography mt={2} variant="caption" fontWeight={400}>
                        Date:{" "}
                        {moment(notification?.date)
                          .utc()
                          .format("Do MMMM YYYY")}
                      </Typography>
                      <Typography
                        component={"p"}
                        mt={1}
                        variant="caption"
                        fontWeight={400}
                      >
                        Description: {notification.description}
                      </Typography>

                      <NotificationStatus
                        isMarkAsRead={notification.isMarkAsRead}
                        isArchive={notification.isArchive}
                        notificationId={notification._id}
                        redirect={notification.redirect}
                      />
                    </Box>
                    <Box
                      width={isMobile ? "100%" : "10%"}
                      display={"flex"}
                      justifyContent={isMobile ? "flex-start" : "flex-end"}
                      mt={isMobile ? 1 : 0}
                    >
                      <DeleteIconView
                        onClick={() => onClickDelete(notification?._id)}
                      >
                        <Image
                          src={"/assets/svg/setting/delete.svg"}
                          alt="delete"
                          height={24}
                          width={24}
                        />
                      </DeleteIconView>
                    </Box>
                  </Stack>
                </CommonCard>
              </Box>
            ))}
          </Box>
        </>
      )}

      <DeleteModal isOpen={isOpen} onClose={onClose} onRemove={onRemove} />
    </Box>
  );
};

export default Notifications;
