"use client";
import React, { useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import DeleteModal from "@/components/DeleteModal";


interface NotificationStatusProps {
  isMarkAsRead: boolean;
  isArchive: boolean;
  notificationId?: string;
}

const notificationData = [
  {
    _id: "680cd16900cca52aaac571b9",
    notificationTitle: "Reply mail",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2025-05-06T12:28:25.535Z",
    isMarkAsRead: false,
    isArchive: false,
  },
  {
    _id: "680cd16900cca52aaac571b9",
    notificationTitle: "Reply mail",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2025-05-06T12:28:25.535Z",
    isMarkAsRead: true,
    isArchive: false,
  },
  {
    _id: "680cd16900cca52aaac571b9",
    notificationTitle: "Reply mail",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2025-05-05T12:28:25.535Z",
    isMarkAsRead: false,
    isArchive: false,
  },
  {
    _id: "680cd16900cca52aaac571b9",
    notificationTitle: "Reply mail",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2025-05-05T12:28:25.535Z",
    isMarkAsRead: true,
    isArchive: false,
  },
  {
    _id: "680cd16900cca52aaac571b9",
    notificationTitle: "Reply mail",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2025-05-04T12:28:25.535Z",
    isMarkAsRead: false,
    isArchive: false,
  },
  {
    _id: "680cd16900cca52aaac571b9",
    notificationTitle: "Reply mail",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2025-05-04T12:28:25.535Z",
    isMarkAsRead: true,
    isArchive: false,
  },
];

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

const EmailResponse: React.FC = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const NotificationStatus: React.FC<NotificationStatusProps> = ({
    isMarkAsRead,
    isArchive,
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
              >
                {isMarkAsRead ? "Mark as unread" : "Mark as read"}
              </Typography>

              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Forward
              </Typography>

              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {isArchive ? "Unarchive" : "Reply"}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>
    );
  };

  const onRemove = () => {
    setIsOpen(false);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const today = moment().utc().format("YYYY-MM-DD");
  const todayNotifications = notificationData.filter((notification) => {
    const notifDate = moment(notification.date).utc().format("YYYY-MM-DD");
    return notifDate === today && notification.isArchive === false;
  });

  const yesterday = moment().utc().subtract(1, "day").format("YYYY-MM-DD");
  const yesterdayNotifications = notificationData.filter((notification) => {
    const notifDate = moment(notification.date).utc().format("YYYY-MM-DD");
    return notifDate === yesterday && notification.isArchive === false;
  });

  const twoDaysAgo = moment().utc().subtract(1, "days").startOf("day");
  const olderNotifications = notificationData
    .filter((notification) => {
      const notifDate = moment(notification.date).utc();
      return notifDate.isBefore(twoDaysAgo) && notification.isArchive === false;
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
              Email responses
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              These are your notifications for the Zorbee admin dashboard that
              have been archived.
            </Typography>
          </Box>
        </Stack>
      </CommonCard>

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
                backgroundColor: notification.isMarkAsRead ? "" : theme.pending.secondary,
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
                    {moment(notification?.date).utc().format("Do MMMM YYYY")}
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
                  />
                </Box>
                <Box
                  width={isMobile ? "100%" : "10%"}
                  display={"flex"}
                  justifyContent={isMobile ? "flex-start" : "flex-end"}
                  mt={isMobile ? 1 : 0}
                >
                  <DeleteIconView
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
                backgroundColor: notification.isMarkAsRead ? "" : theme.pending.secondary,
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
                    {moment(notification?.date).utc().format("Do MMMM YYYY")}
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
                  />
                </Box>
                <Box
                  width={isMobile ? "100%" : "10%"}
                  display={"flex"}
                  justifyContent={isMobile ? "flex-start" : "flex-end"}
                  mt={isMobile ? 1 : 0}
                >
                  <DeleteIconView
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
                backgroundColor: notification.isMarkAsRead ? "" : theme.pending.secondary,
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
                    {moment(notification?.date).utc().format("Do MMMM YYYY")}
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
                  />
                </Box>
                <Box
                  width={isMobile ? "100%" : "10%"}
                  display={"flex"}
                  justifyContent={isMobile ? "flex-start" : "flex-end"}
                  mt={isMobile ? 1 : 0}
                >
                  <DeleteIconView
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

      <DeleteModal isOpen={isOpen} onClose={onClose} onRemove={onRemove} />
    </Box>
  );
};

export default EmailResponse;
