"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  Box,
  Grid2,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
//relative path imorts
import ProfileCard from "@/components/Cards/Profile";
import KeyValueDetailsForUser from "@/components/Cards/KeyValueDetailsForUser";
import CommonCard from "@/components/Cards/Common";
import RequestCard from "@/components/Cards/Request";
import DownloadDocumentButton from "@/components/DownloadDocumentBtn";
import ViewAllButton from "@/components/ViewAllButton";
//relative api path imports
import { updateUserInfo } from "@/services/api/usersApi";
import { UserInfoResponse } from "@/types/singleUserInfoType";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
import { getClientDetails } from "@/services/api/carerApi";

interface ParamsProps {
  id: string;
  profile: string;
}

const STATUS_LABELS: Record<number, string> = {
  1: "Pending",
  3: "Active",
  8: "Deactivated",
};

const ActiveStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: number }>(({ status, theme }) => {
  const s =
    status === 1
      ? {
          label: "Pending",
          border: theme.pending.main,
          bg: theme.pending.background.primary,
          color: theme.pending.main,
        }
      : status === 3
      ? {
          label: "Active",
          border: theme.accepted.main,
          bg: theme.accepted.background.primary,
          color: theme.accepted.main,
        }
      : status === 8
      ? {
          label: "Deactivated",
          border: theme.declined.main,
          bg: theme.declined.background.primary,
          color: theme.declined.main,
        }
      : {
          label: "N/A",
          border: "",
          bg: "",
          color: "",
        };

  return {
    padding: "8px 16px",
    border: `1px solid ${s.border}`,
    backgroundColor: s.bg,
    color: s.color,
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiTypography-root": { color: s.color },
  };
});

interface PauseUserInfoResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const Profile = () => {
  const theme = useTheme();
  const { navigateWithLoading } = useRouterLoading();
  const params = useParams() as unknown as ParamsProps;
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userInfo, setUserInfo] = useState<
    UserInfoResponse["data"]["data"] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
  const [deactivateID, setDeactivateID] = useState<string | null>(null);

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  const cardData = [
    {
      title: "Care plan",
      description:
        "View this user's care plan, which has been created by them and not by the carer or clinician.",
      buttontext: "View care plan",
      redirectionRoute: `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/care-plan`,
    },
    {
      title: "Medical history",
      description:
        "View this user's medical history, which has been created by them and not by the carer or clinician.",
      buttontext: "View medical history",
      redirectionRoute: `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/medical-history`,
    },
    {
      title: "Medication log",
      description:
        "View all the medication that has been administered by the carer/clinician, along with any scanned prescriptions provided by the user.",
      buttontext: "View medication log",
      redirectionRoute: `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/medication-log`,
    },
    {
      title: "Care note",
      description:
        "View all the care notes that has been entered by the carer/clinician.",
      buttontext: "View care notes",
      redirectionRoute: `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/care-notes`,
    },
    {
      title: "Visit log",
      description: "View all the carer entries, timestamps, and key details.",
      buttontext: "View visit logs",
      redirectionRoute: `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/visit-logs`,
    },
    {
      title: "Health log",
      description:
        "View all the health that has been entered by the carer/clinician.",
      buttontext: "View health log",
      redirectionRoute: `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/health-report`,
    },
  ];

  useEffect(() => {
    if (params?.profile) {
      fetchSingleUserInfo(params?.profile);
    }
  }, [params?.profile]);

  const fetchSingleUserInfo = async (id: string) => {
    setIsLoading(true);
    try {
      const response = (await getClientDetails(
        { role: 4, userId: params?.id },
        id
      )) as UserInfoResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setUserInfo(response?.data?.data);
        localStorage.setItem(
          "Selecteduser",
          JSON.stringify(response?.data?.data)
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionItemClick = (status: string, id: string | number) => {
    navigateWithLoading(
      `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/service-agreement/${id}?status=${status}`
    );
  };

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/dashboard/users.svg",
        title: "Overall bookings",
        count:
          userInfo?.summary?.totalBooking !== null &&
          userInfo?.summary?.totalBooking !== undefined
            ? userInfo.summary?.totalBooking === 0
              ? "0"
              : userInfo.summary?.totalBooking
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Active agreements",
        count:
          userInfo?.summary?.activeAgreement !== null &&
          userInfo?.summary?.activeAgreement !== undefined
            ? userInfo.summary?.activeAgreement === 0
              ? "0"
              : userInfo.summary?.activeAgreement
            : "N/A",
      },
      {
        icon: "/assets/svg/carers/profile/saftey_alerts.svg",
        title: "Total saftey alerts",
        count:
          userInfo?.summary?.totalSafetyAlert !== null &&
          userInfo?.summary?.totalSafetyAlert !== undefined
            ? userInfo.summary?.totalSafetyAlert === 0
              ? "0"
              : userInfo.summary?.totalSafetyAlert
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/currency.svg",
        title: "Support tickets",
        count:
          userInfo?.summary?.supportTicket !== null &&
          userInfo?.summary?.supportTicket !== undefined
            ? userInfo.summary?.supportTicket === 0
              ? "0"
              : userInfo.summary?.supportTicket
            : "N/A",
      },
    ];
  }, [userInfo]);

  const account_information = useMemo(() => {
    if (!userInfo) return [];
    const name = [userInfo?.firstName, userInfo?.lastName].filter(
      (part) => part && part.trim() !== ""
    );
    const fullName = name.length > 0 ? name.join(" ") : "N/A";

    return [
      {
        label: "Name",
        value: fullName || "N/A",
        key: "name",
        subFields: [
          {
            label: "First name",
            value: userInfo?.firstName || "",
            key: "firstName",
            inputType: "text" as const,
            isEditable: true,
          },
          {
            label: "Last name",
            value: userInfo?.lastName || "",
            key: "lastName",
            inputType: "text" as const,
            isEditable: true,
          },
        ],
      },
      {
        label: "Date of birth",
        value: moment(userInfo?.dob).utc().format("DD MMMM YYYY"),
        key: "date",
        isEditable: true,
      },
      {
        label: "Mobile Number",
        value: userInfo?.mobileNumber || "N/A",
        key: "mobileNumber",
        inputType: "text" as const,
        isEditable: false,
      },
      {
        label: "Gender",
        inputType: "select" as const,
        options: [
          { label: "Male", value: 1 },
          { label: "Female", value: 2 },
        ],
        value: userInfo?.gender?.[0] || 1,
        key: "gender",
        isEditable: true,
      },
      {
        label: "Address line 1",
        value: userInfo?.address || "",
        key: "addressLine",
        inputType: "text" as const,
        isEditable: true,
      },
      {
        label: "House name/no",
        value: userInfo?.houseNo || "",
        key: "houseNo",
        inputType: "text" as const,
        isEditable: true,
      },
      {
        label: "Post Code",
        value: userInfo?.postCode || "",
        key: "postCode",
        inputType: "text" as const,
        isEditable: true,
      },
      {
        label: "Country",
        value: userInfo?.country || "",
        key: "country",
        inputType: "text" as const,
        isEditable: true,
      },
    ];
  }, [userInfo]);

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuActionItemClick = (id: string, cindex: number) => {
    if (cindex === 0) {
      setIsReasonModalOpen(true);
      setDeactivateID(id);
    } else if (cindex === 1) {
    }
    handleClose();
  };

  const onPauseUserAccount = async (
    id: string | null,
    status?: number,
    notes?: string
  ) => {
    try {
      const payload = {
        status: status,
        notes: notes,
      };
      const response = (await updateUserInfo(
        id,
        payload
      )) as PauseUserInfoResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setDeactivateID(null);
        setIsReasonModalOpen(false);
        fetchSingleUserInfo(params?.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickSaveBtnInModal = (value: string) => {
    onPauseUserAccount(deactivateID, 8, value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return isLoading ? (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"calc(100vh - 300px)"}
    >
      <CircularProgress size={30} />
    </Box>
  ) : (
    <Box>
      <CommonCard>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Image
              src={
                userInfo?.profile != "image/superAdmin/profileImage" &&
                userInfo?.profile != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${userInfo?.profile}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={60}
              width={60}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="h6" fontWeight={500}>
              {userInfo?.firstName ? userInfo?.firstName : ""}{" "}
              {userInfo?.lastName ? userInfo?.lastName : ""}
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            {!isTablet && (
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(userInfo?.createdAt).format("Do MMMM YYYY")}
                </Typography>
              </Box>
            )}
            {!isTablet && (
              <ActiveStatus status={userInfo?.status}>
                <Typography variant="caption" fontWeight={500}>
                  {STATUS_LABELS[userInfo?.status ?? -1] ?? "N/A"}
                </Typography>
              </ActiveStatus>
            )}
            {!isTablet && (
              <DownloadDocumentButton title="Download user report" />
            )}
            <IconButton onClick={(event) => handleActionClick(event)}>
              <MoreVertSharpIcon
                style={{ color: theme.palette.common.black }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  border: "1px solid #E2E6EB",
                  borderRadius: "10px",
                },
              }}
            >
              {(userInfo?.status === 8
                ? ["Activate account"]
                : ["Deactive account"]
              ).map((action, index) => (
                <MenuItem
                  key={index}
                  onClick={() =>
                    userInfo?.status === 8
                      ? onPauseUserAccount(params?.id, 3)
                      : handleMenuActionItemClick(params?.id, index)
                  }
                  sx={{
                    color:
                      userInfo?.status === 8
                        ? theme?.palette.common.black
                        : theme.declined.main,
                  }}
                >
                  {action}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>

        {isTablet && !isMobile && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(userInfo?.careStartDate).format("Do MMMM YYYY")}
                </Typography>
              </Box>
              <ActiveStatus status={userInfo?.status}>
                <Typography variant="caption" fontWeight={500}>
                  {STATUS_LABELS[userInfo?.status ?? -1] ?? "N/A"}
                </Typography>
              </ActiveStatus>
            </Stack>
            <DownloadDocumentButton title="Download user report" />
          </Stack>
        )}

        {isMobile && (
          <Box mt={2}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              spacing={2}
            >
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(userInfo?.careStartDate).format("Do MMMM YYYY")}
                </Typography>
              </Box>
              <ActiveStatus status={userInfo?.status}>
                <Typography variant="caption" fontWeight={500}>
                  {STATUS_LABELS[userInfo?.status ?? -1] ?? "N/A"}
                </Typography>
              </ActiveStatus>
            </Stack>
            <DownloadDocumentButton title="Download user report" />
          </Box>
        )}

        <Box mt={4} width={"100%"}>
          <Grid2 container spacing={2}>
            {data.map((ele, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ lg: 3, xl: 3, md: 6, sm: 6, xs: 12 }}
                >
                  <ProfileCard
                    path={ele.icon}
                    alt={ele.icon}
                    title={ele.title}
                    count={ele.count}
                  />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </CommonCard>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Account information
              </Typography>
              <Box mt={5}>
                <KeyValueDetailsForUser items={account_information} />
              </Box>
            </CommonCard>
          </Box>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500} mb={2}>
                Active service agreements
              </Typography>
              {userInfo?.activeAgreement &&
                userInfo?.activeAgreement?.length > 0 &&
                userInfo?.activeAgreement.map((ele, index) => (
                  <Box mt={3} key={index}>
                    <RequestCard
                      path="/assets/svg/carers/profile/payment_request.svg"
                      title={`Agreement #${ele.agreementId}`}
                      subtitle={`Client:${
                        ele.userId.firstName + ele.userId.lastName
                      }`}
                      subtitle2={`Ends on: ${
                        ele.endDate
                          ? moment(ele.endDate, [
                              "DD MMMM YYYY",
                              "YYYY-MM-DD",
                            ]).format("DD MMM YYYY")
                          : ""
                      }`}
                      onClickRightButton={() =>
                        handleActionItemClick("active", ele._id)
                      }
                    />
                  </Box>
                ))}
            </CommonCard>
          </Box>

          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Completed service agreements
              </Typography>
              {userInfo?.completedAgreement &&
                userInfo?.completedAgreement?.length > 0 &&
                userInfo?.completedAgreement.map((ele, index) => (
                  <Box mt={3} key={index}>
                    <RequestCard
                      path="/assets/svg/carers/profile/payment_request.svg"
                      title={`Agreement #${ele.agreementId}`}
                      subtitle={`Client:${
                        ele.userId.firstName + ele.userId.lastName
                      }`}
                      subtitle2={`Ends on: ${
                        ele.endDate
                          ? moment(ele.endDate, [
                              "DD MMMM YYYY",
                              "YYYY-MM-DD",
                            ]).format("DD MMM YYYY")
                          : ""
                      }`}
                      onClickRightButton={() =>
                        handleActionItemClick("completed", ele._id)
                      }
                    />
                  </Box>
                ))}
              {userInfo?.completedAgreement &&
                userInfo?.completedAgreement?.length > 0 && (
                  <Box mt={4}>
                    <ViewAllButton
                      sx={{ backgroundColor: "#F1F3F5" }}
                      title="View all"
                      onClick={() =>
                        navigateWithLoading(
                          `/clinical/overview/profile/${params.id}/client-and-job-listings/profile/${params.profile}/service-agreement`
                        )
                      }
                    />
                  </Box>
                )}
            </CommonCard>
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          {cardData.map((ele, index) => (
            <Box key={index} mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  {ele.title}
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  {ele.description}
                </Typography>
                <Box mt={4}>
                  <ViewAllButton
                    sx={{ backgroundColor: "#F1F3F5" }}
                    title={ele.buttontext}
                    onClick={() => {
                      if (ele?.redirectionRoute) {
                        navigateWithLoading(ele?.redirectionRoute);
                      }
                    }}
                    isIcon={true}
                  />
                </Box>
              </CommonCard>
            </Box>
          ))}
        </Grid2>
      </Grid2>
      <ReasonForDeclineModal
        isOpen={isreasonModalOpen}
        onClick={onClickSaveBtnInModal}
        onClose={onCloseReasonModal}
        value={""}
        title={"Reason for suspension"}
        description={
          "Please outline your reasons for suspending this <br />account"
        }
        placeholder="Please provide details..."
      />
    </Box>
  );
};

export default Profile;
