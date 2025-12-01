"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
//relative path imports
import {
  cardConfigs,
  filterOptions,
  time_period_data,
} from "@/constants/dashboardData";
import CommonSelect from "@/components/CommonSelect";
import CommonChart from "@/components/CommonChart";
import {
  getDashboardAccountData,
  getDashboardDemographicData,
  getDashboardPendingData,
  getDashboardVerificationData,
  getMyAccountSummary,
} from "@/services/api/myAccountApi";
import {
  DashboardAccountInfoData,
  DashboardAccountInfoResponse,
  DashboardDemographicsInfoData,
  DashboardDemographicsInfoResponse,
  DashboardPendingInfoData,
  DashboardPendingInfoResponse,
  DashboardVerificationInfoData,
  DashboardVerificationInfoResponse,
} from "@/types/dashboardType";

interface ActiveProps {
  isBgColor?: string;
}

interface TimePeriodsProps {
  isSelected: boolean;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface MyAccountData {
  agoraUserId: string | null;
  notes: string | null;
  profile?: string | null;
  countryCode: string | number | null;
  mobileNumber: string | null;
  approvedDate: string | null;
  originalUserId: string | null;
  googleTokens: string | null;
  _id: string | null;
  username: string | null;
  email: string | null;
  title?: string | null;
  firstName: string;
  lastName: string;
  gender: string | null;
  password: string | null;
  dob: string | null;
  role: number;
  authType: number;
  googleId: string | null;
  appleId: string | null;
  facebookId: string | null;
  isTermsAccept: boolean;
  isEmailVerify: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  isFaceIbEnabled: boolean;
  isSharedAccount: boolean;
  status: number;
  address: string | null;
  lastLogin: string | null;
  userPermissions: number[];
  carerPermissions: number[];
  clinicalPermissions: number[];
  providerPermissions: number[];
}

interface AccountDetailsResponse {
  data: {
    success: boolean;
    message: string;
    data: MyAccountData;
  };
}

const StyledCard = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  padding: "22px",
  display: "flex",
  gap: "16px",
  alignItems: "center",
  backgroundColor: theme.palette.common.white,
}));

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<ActiveProps>(({ isBgColor }) => ({
  height: "60px",
  width: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: isBgColor,
}));

const StyledVerificationCard = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  padding: "22px",
  backgroundColor: theme.palette.common.white,
  minHeight: "220px",
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "10px",
  borderRadius: "5px",
  marginTop: "5px",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.inProgress.background.primary,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.ShadowAndBorder.border3,
  },
}));

const StyledTimePeriodBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<TimePeriodsProps>(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? theme.palette.primary.main
    : theme.palette.common.white,
  height: "50px",
  minWidth: "80px",
  padding: "0 10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    minWidth: "70px",
    height: "45px",
    margin: "10px !important",
  },
}));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string | number | null>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashboardAccountData, setDashboardAccountData] =
    useState<DashboardAccountInfoData | null>(null);
  const [dashboardPendingData, setDashboardPendingData] =
    useState<DashboardPendingInfoData | null>(null);
  // const [dashboardDemographicData, setDashboardDemographicData] =
  //   useState<DashboardDemographicsInfoData | null>(null);
  const [dashboardVerificationData, setDashboardVerificationData] =
    useState<DashboardVerificationInfoData | null>(null);
  const [isChartLoading, setIsChartLoading] = useState<boolean>(false);
  const handleFilterChange = (title: string, value: string | number | null) => {
    setSelectedFilters((prev) => ({ ...prev, [title]: value }));
  };

  const fetchMyAccountDetails = async () => {
    try {
      const response = (await getMyAccountSummary()) as AccountDetailsResponse;
      if (response?.data?.success) {
        const {
          firstName,
          lastName,
          lastLogin,
          userPermissions,
          carerPermissions,
          clinicalPermissions,
          providerPermissions,
        } = response?.data?.data || {};
        if (firstName) {
          localStorage.setItem("firstName", firstName);
        }
        if (lastName) {
          localStorage.setItem("lastName", lastName);
        }
        if (lastLogin) {
          localStorage.setItem("lastLogin", lastLogin);
        }
        if (userPermissions) {
          localStorage.setItem(
            "userPermissions",
            JSON.stringify(userPermissions)
          );
        }
        if (carerPermissions) {
          localStorage.setItem(
            "carerPermissions",
            JSON.stringify(carerPermissions)
          );
        }
        if (clinicalPermissions) {
          localStorage.setItem(
            "clinicalPermissions",
            JSON.stringify(clinicalPermissions)
          );
        }
        if (providerPermissions) {
          localStorage.setItem(
            "providerPermissions",
            JSON.stringify(providerPermissions)
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const filterValue: string =
      (selectedFilters["Demographic"] as string) || "age";
    fetchMyAccountDetails();
    fetchDashboardAccountData();
    fetchDashboardPendingData();
    fetchDashboardDemographicData(filterValue, selectedTimePeriod);
    fetchDashboardVerifcationData();
  }, []);

  const fetchDashboardAccountData = async () => {
    setIsLoading(true);
    try {
      const response =
        (await getDashboardAccountData()) as DashboardAccountInfoResponse;
      if (response?.data?.success) {
        setDashboardAccountData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardPendingData = async () => {
    setIsLoading(true);
    try {
      const response =
        (await getDashboardPendingData()) as DashboardPendingInfoResponse;
      if (response?.data?.success) {
        setDashboardPendingData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardDemographicData = async (
    filterBy: string,
    timeFilter: number
  ) => {
    setIsChartLoading(true);
    try {
      const response = (await getDashboardDemographicData({
        filterBy: filterBy,
        timeFilter: timeFilter,
      })) as DashboardDemographicsInfoResponse;
      if (response?.data?.success) {
        setIsChartLoading(false);
        // setDashboardDemographicData(response?.data?.data);

        cardConfigs.forEach((config) => {
          if (config.title === "User demographic") {
            config.ageData = mapDemographicsToChartData(
              response?.data?.data.userDemographic,
              "age"
            );
            config.genderData = mapDemographicsToChartData(
              response?.data?.data.userDemographic,
              "gender"
            );
          } else if (config.title === "Carer demographic") {
            config.ageData = mapDemographicsToChartData(
              response?.data?.data.carerDemographic,
              "age"
            );
            config.genderData = mapDemographicsToChartData(
              response?.data?.data.carerDemographic,
              "gender"
            );
          } else if (config.title === "Clinician demographic") {
            config.ageData = mapDemographicsToChartData(
              response?.data?.data.clinicianDemographic,
              "age"
            );
            config.genderData = mapDemographicsToChartData(
              response?.data?.data.clinicianDemographic,
              "gender"
            );
          } else if (config.title === "Provider analytics") {
            config.ageData = mapDemographicsToChartData(
              response?.data?.data.providerAnalytics,
              "age"
            );
            config.genderData = mapDemographicsToChartData(
              response?.data?.data.providerAnalytics,
              "gender"
            );
          } else if (config.title === "Partners") {
            config.ageData = Object.entries(
              response?.data?.data.brokerageAnalytics
            ).map(([key, value]) => ({
              name: key,
              value,
              color: "#FFD62E",
            }));
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchDashboardVerifcationData = async () => {
    setIsLoading(true);
    try {
      const response =
        (await getDashboardVerificationData()) as DashboardVerificationInfoResponse;
      if (response?.data?.success) {
        setDashboardVerificationData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const ChartLegend: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
    return (
      <Box sx={{ mt: isSmallDevice ? 0 : 2 }}>
        <Grid2 container spacing={1}>
          {data.map((entry, index) => (
            <Grid2 size={{ md: 6 }} key={`legend-${index}`}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: entry.color,
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant={"body2"}
                    component="span"
                    color="common.black"
                  >
                    {entry.name}:
                  </Typography>
                  <Typography variant="body2" component="span" fontWeight={500}>
                    {entry.value}%
                  </Typography>
                </Stack>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    );
  };

  const pendingCards = useMemo(() => {
    if (!dashboardPendingData) return [];

    return [
      {
        icon: "verify",
        title: "To verify",
        desc: `${dashboardPendingData.toVerify || "--"} Pending`,
      },
      {
        icon: "support_tickets_new",
        title: "Support tickets",
        desc: `${dashboardPendingData.supportTickets || "--"} unresolved`,
      },
      {
        icon: "review_application",
        title: "Recruitment passports",
        desc: `${dashboardPendingData.recruitmentPassport || "--"} new`,
      },
      {
        icon: "currency",
        title: "Payment disputes",
        desc: `${dashboardPendingData.pendingDisputes || "--"} unresolved`,
      },
    ];
  }, [dashboardPendingData]);

  const statusCards = useMemo(() => {
    if (!dashboardAccountData) return [];

    return [
      {
        title: "Active clients",
        count: dashboardAccountData.activeUsers?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.activeUsers?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "active_users",
      },
      {
        title: "Active carers",
        count: dashboardAccountData.activeCarers?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.activeCarers?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "active_carers",
      },
      {
        title: "Active clinicians",
        count:
          dashboardAccountData.activeClinicians?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.activeClinicians?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "active_clinicals",
      },
      {
        title: "Active providers",
        count:
          dashboardAccountData.activeProviders?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.activeProviders?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "active_providers",
      },
      {
        title: "Inactive accounts",
        count:
          dashboardAccountData.inactiveAccounts?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.inactiveAccounts?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "inactive_accounts",
      },
      {
        title: "Total agreements",
        count:
          dashboardAccountData.totalAgreements?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.totalAgreements?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "agreements",
      },
      {
        title: "Total completed care",
        count:
          dashboardAccountData.totalCompletedCare?.count.toLocaleString() ||
          "0",
        days:
          `${dashboardAccountData.totalCompletedCare?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "currency",
      },
      {
        title: "Total partners",
        count:
          dashboardAccountData.activeBrokerage?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.activeBrokerage?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "total_partners",
      },
      {
        title: "Total resources",
        count:
          dashboardAccountData.totalResources?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.totalResources?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "inactive_accounts",
      },
      {
        title: "Total job listings",
        count: dashboardAccountData.totalJobs?.count.toLocaleString() || "0",
        days:
          `${dashboardAccountData.totalJobs?.percentageChange} vs last 30 days` ||
          "+0%",
        icon: "agreements",
      },
    ];
  }, [dashboardAccountData]);

  const pendingVerificationsCards = useMemo(() => {
    if (!dashboardVerificationData) return [];

    return [
      {
        icon: "single",
        title: "User verifications",
        review_status: "Pending",
        total_pending:
          dashboardVerificationData.userVerification?.totalPending || 0,
        process_rate:
          dashboardVerificationData.userVerification?.processingRate || 0,
        // urgent_review: dashboardVerificationData.userVerification?.urgentReview, // if available
      },
      {
        icon: "paginate_text",
        title: "Payment disputes",
        review_status: "Pending",
        total_pending:
          dashboardVerificationData.paymentDisputes?.paymentDisputes || 0,
        process_rate:
          dashboardVerificationData.paymentDisputes?.processingRate || 0,
      },
      {
        icon: "study_owl",
        title: "Recruitment Passport",
        review_status: "Pending",
        total_pending:
          dashboardVerificationData.recruitmentPassport?.passport || 0,
        process_rate:
          dashboardVerificationData.recruitmentPassport?.processingRate || 0,
      },
      {
        icon: "doc",
        title: "Job listing",
        review_status: "Pending",
        total_pending: dashboardVerificationData.jobList?.jobList || 0,
        process_rate: dashboardVerificationData.jobList?.processingRate || 0,
      },
      {
        icon: "face_id",
        title: "Support ticket",
        review_status: "Pending",
        total_pending:
          dashboardVerificationData.supportTickets?.supportTickets || 0,
        process_rate:
          dashboardVerificationData.supportTickets?.processingRate || 0,
      },
    ];
  }, [dashboardVerificationData]);

  const lastLoginFormatted = moment(localStorage.getItem("lastLogin")).calendar(
    null,
    {
      sameDay: "[Today at] h:mm A",
      lastDay: "[Yesterday at] h:mm A",
      lastWeek: "DD/MM/YYYY [at] h:mm A",
      sameElse: "DD/MM/YYYY [at] h:mm A",
    }
  );

  const handleTimePeriodChange = (index: number) => {
    setSelectedTimePeriod(index);
    const timeFilterValues: Record<number, number> = {
      0: 1,
      1: 3,
      2: 6,
      3: 9,
      4: 12,
      5: 18,
      6: 24,
    };

    const filterValue = (selectedFilters["Demographic"] as string) || "age";

    fetchDashboardDemographicData(filterValue, timeFilterValues[index] || 1);
  };

  const mapDemographicsToChartData = (
    demo: DashboardDemographicsInfoData[keyof DashboardDemographicsInfoData],
    type: "age" | "gender"
  ): ChartDataItem[] => {
    if (!demo) return [];

    if (type === "age") {
      return Object.entries(demo.byAge).map(([key, value]) => ({
        name: key,
        value,
        color:
          key === "18-24"
            ? "#FFD62E"
            : key === "25-34"
            ? "#4E95ED"
            : key === "35-44"
            ? "#10B981"
            : "#F87171",
      }));
    } else {
      return Object.entries(demo.byGender).map(([key, value]) => ({
        name: key,
        value,
        color:
          key === "Male" ? "#FFD62E" : key === "Female" ? "#4E95ED" : "#10B981",
      }));
    }
  };

  // useEffect(() => {
  //   if (!dashboardDemographicData) return;

  //   cardConfigs.forEach((config) => {
  //     if (config.title === "User demographic") {
  //       config.ageData = mapDemographicsToChartData(
  //         dashboardDemographicData.userDemographic,
  //         "age"
  //       );
  //       config.genderData = mapDemographicsToChartData(
  //         dashboardDemographicData.userDemographic,
  //         "gender"
  //       );
  //     } else if (config.title === "Carer demographic") {
  //       config.ageData = mapDemographicsToChartData(
  //         dashboardDemographicData.carerDemographic,
  //         "age"
  //       );
  //       config.genderData = mapDemographicsToChartData(
  //         dashboardDemographicData.carerDemographic,
  //         "gender"
  //       );
  //     } else if (config.title === "Clinician demographic") {
  //       config.ageData = mapDemographicsToChartData(
  //         dashboardDemographicData.clinicianDemographic,
  //         "age"
  //       );
  //       config.genderData = mapDemographicsToChartData(
  //         dashboardDemographicData.clinicianDemographic,
  //         "gender"
  //       );
  //     } else if (config.title === "Provider analytics") {
  //       config.ageData = mapDemographicsToChartData(
  //         dashboardDemographicData.providerAnalytics,
  //         "age"
  //       );
  //       config.genderData = mapDemographicsToChartData(
  //         dashboardDemographicData.providerAnalytics,
  //         "gender"
  //       );
  //     } else if (config.title === "Partners") {
  //       config.ageData = Object.entries(
  //         dashboardDemographicData.brokerageAnalytics
  //       ).map(([key, value]) => ({
  //         name: key,
  //         value,
  //         color: "#FFD62E",
  //       }));
  //     }
  //   });
  // }, [dashboardDemographicData]);

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
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={{ xs: 12, sm: 8 }}>
          <Typography
            sx={{ fontSize: { xs: "20px", sm: "24px", md: "30px" } }}
            fontWeight={500}
            color="common.black"
          >
            Welcome back,{" "}
            {`${
              localStorage.getItem("firstName")
                ? localStorage.getItem("firstName")
                : "Kat"
            }`}
            !
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            You have{" "}
            <Typography
              sx={{ cursor: "pointer" }}
              variant="caption"
              fontWeight={500}
              color={theme.inProgress.main}
            >
              {dashboardPendingData?.toVerify || "N/A"}
            </Typography>{" "}
            pending verifications to review today.
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 4 }}
          sx={{
            textAlign: {
              sm: "right",
              md: "right",
              lg: "right",
              xl: "right",
              xs: "left",
            },
          }}
        >
          <Typography
            component="p"
            variant="caption"
            fontWeight={400}
            color="common.black"
          >
            Last login
          </Typography>
          <Typography
            component="p"
            variant="caption"
            fontWeight={500}
            color="common.black"
          >
            {lastLoginFormatted ? lastLoginFormatted : "Today at 9:42 AM"}
          </Typography>
        </Grid2>
      </Grid2>

      <Box mt={3}>
        {/* routes buttons  */}
        <Grid2 container spacing={isSmallDevice ? 2 : 3}>
          <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
            <StyledCard>
              <StyledBox>
                <Image
                  src={`/assets/svg/logos/zorbee_icon.svg`}
                  alt={"zorbee_pay"}
                  height={50}
                  width={50}
                />
              </StyledBox>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body1" fontWeight={500} fontSize={"12px"}>
                  Go to Zorbee Pay Admin
                </Typography>
                <Box
                  component="a"
                  href={`${process.env.NEXT_PUBLIC_ZORBEE_PAY_URL}?isFromSuperAdmin=true`}
                  sx={{
                    textDecoration: "none",
                    backgroundColor: theme?.pending?.main,
                    borderRadius: "10px",
                    cursor: "pointer",
                    color: theme?.palette?.common?.black,
                    padding: "10px",
                    paddingInline: "15px",
                    width: "max-content",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={"12px"}
                  >
                    Click here
                  </Typography>
                </Box>
              </Box>
            </StyledCard>
          </Grid2>
          <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
            <StyledCard>
              <StyledBox>
                <Image
                  src={`/assets/svg/logos/zorbee_icon.svg`}
                  alt={"zorbee_pay"}
                  height={50}
                  width={50}
                />
              </StyledBox>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body1" fontWeight={500} fontSize={"12px"}>
                  Go to Zorbee HR Admin
                </Typography>
                <Box
                  component="a"
                  href={`${process.env.NEXT_PUBLIC_ZORBEE_HR_URL}`}
                  sx={{
                    textDecoration: "none",
                    backgroundColor: theme?.pending?.main,
                    borderRadius: "10px",
                    cursor: "pointer",
                    color: theme?.palette?.common?.black,
                    padding: "10px",
                    paddingInline: "15px",
                    width: "max-content",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={"12px"}
                  >
                    Click here
                  </Typography>
                </Box>
              </Box>
            </StyledCard>
          </Grid2>
        </Grid2>
      </Box>

      <Box mt={4}>
        {/* pending 4 cards  */}
        <Grid2 container spacing={isSmallDevice ? 2 : 3}>
          {pendingCards.map((ele, index) => {
            return (
              <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
                <StyledCard>
                  <StyledBox isBgColor={theme.pending.main}>
                    <Image
                      src={`/assets/svg/dashboard/${ele.icon}.svg`}
                      alt={ele.icon}
                      height={30}
                      width={30}
                    />
                  </StyledBox>
                  <Box>
                    <Typography variant="caption" fontWeight={400}>
                      {ele.title}
                    </Typography>
                    <Typography variant="h6" fontWeight={500}>
                      {ele.desc}
                    </Typography>
                  </Box>
                </StyledCard>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>

      <Box mt={4}>
        {/* status cards */}
        <Grid2 container spacing={isSmallDevice ? 2 : 3}>
          {statusCards.map((ele, index) => {
            return (
              <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
                <StyledCard justifyContent={"space-between"}>
                  <Box>
                    <Typography variant="caption" fontWeight={400}>
                      {ele.title}
                    </Typography>
                    <Typography variant="h6" fontWeight={500}>
                      {ele.count}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={theme.accepted.main}
                      fontWeight={400}
                    >
                      {ele.days}
                    </Typography>
                  </Box>
                  <StyledBox isBgColor={theme.pending.secondary}>
                    <Image
                      src={`/assets/svg/dashboard/${ele.icon}.svg`}
                      alt={ele.icon}
                      height={30}
                      width={30}
                    />
                  </StyledBox>
                </StyledCard>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" fontWeight={500}>
          Pending verifications
        </Typography>

        <Box mt={4}>
          <Grid2 container columnSpacing={isTablet ? 3 : 4} rowSpacing={4}>
            {pendingVerificationsCards.map((ele, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ md: 6, sm: 6, xs: 12, lg: 4, xl: 4 }}
                >
                  <StyledVerificationCard>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      width={"100%"}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {ele.title}
                        </Typography>
                        <Typography variant="caption" fontWeight={400}>
                          {ele.review_status} reviews
                        </Typography>
                      </Box>
                      <StyledBox isBgColor={theme.pending.secondary}>
                        <Image
                          src={`/assets/svg/dashboard/${ele.icon}.svg`}
                          alt={ele.icon}
                          height={30}
                          width={30}
                        />
                      </StyledBox>
                    </Stack>
                    <Box mt={2}>
                      {ele.total_pending && (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Typography variant="caption" fontWeight={400}>
                            Total pending
                          </Typography>
                          <Typography variant="h6" fontWeight={500}>
                            {ele.total_pending}
                          </Typography>
                        </Stack>
                      )}
                      {/* {ele.urgent_review && (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Stack direction={"row"} spacing={1}>
                            <InfoOutlinedIcon
                              sx={{
                                fontSize: "16px",
                                color: theme.declined.main,
                              }}
                            />
                            <Typography
                              variant="caption"
                              fontWeight={400}
                              color={theme.declined.main}
                            >
                              Urgent review
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h6"
                            fontWeight={500}
                            color={theme.declined.main}
                          >
                            {ele.urgent_review}
                          </Typography>
                        </Stack>
                      )}
                      {ele.total_verified && (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Typography variant="caption" fontWeight={400}>
                            Total verfied
                          </Typography>
                          <Typography variant="h6" fontWeight={500}>
                            {ele.total_verified}
                          </Typography>
                        </Stack>
                      )}
                      {ele.total_failed && (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Typography variant="caption" fontWeight={400}>
                            Total failed
                          </Typography>
                          <Typography variant="h6" fontWeight={500}>
                            {ele.total_failed}
                          </Typography>
                        </Stack>
                      )} */}
                      {ele.process_rate && (
                        <Box mt={1}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            width={"100%"}
                          >
                            <Typography variant="caption" fontWeight={400}>
                              Processing rate
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                              {ele.process_rate} %
                            </Typography>
                          </Stack>
                          <BorderLinearProgress
                            variant="determinate"
                            value={ele.process_rate}
                          />
                        </Box>
                      )}
                    </Box>
                  </StyledVerificationCard>
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </Box>

      <Box mt={4}>
        <Stack
          direction={isSmallDevice ? "column" : "row"}
          alignItems="center"
          spacing={isSmallDevice ? 0 : 4}
          flexWrap="wrap"
        >
          <Typography variant="h6" fontWeight={500}>
            Time period
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            justifyContent={isSmallDevice ? "center" : "flex-start"}
          >
            {time_period_data.map((ele, index) => (
              <StyledTimePeriodBox
                key={index}
                onClick={() => handleTimePeriodChange(index)}
                isSelected={selectedTimePeriod === index}
              >
                <Typography
                  variant="body2"
                  fontWeight={selectedTimePeriod === index ? 500 : 400}
                >
                  {ele}
                </Typography>
              </StyledTimePeriodBox>
            ))}
          </Stack>
        </Stack>

        <Box mt={4}>
          {isChartLoading ? (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              height={"calc(100vh - 300px)"}
            >
              <CircularProgress size={30} />
            </Box>
          ) : (
            <Grid2 container columnSpacing={2} rowSpacing={4}>
              {cardConfigs?.map((config, index) => {
                const selectedFilter = selectedFilters[config.title] || "age";
                const chartData: ChartDataItem[] =
                  selectedFilter === "gender"
                    ? config.genderData ?? []
                    : config.ageData ?? [];

                const mostPopularItem =
                  chartData.length > 0
                    ? chartData.reduce((prev, current) =>
                        prev.value > current.value ? prev : current
                      )
                    : null;

                const subtitle = mostPopularItem
                  ? `${mostPopularItem.name} (${mostPopularItem.value}%)`
                  : config.chartSubtitle;

                return (
                  <Grid2
                    key={index}
                    size={{ md: 6, sm: 6, xs: 12, lg: 4, xl: 4 }}
                  >
                    <StyledVerificationCard>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Typography variant="h6" fontWeight={500}>
                          {config.title}
                        </Typography>
                        {config.filter !== "" && (
                          <CommonSelect
                            placeholder="Demographic"
                            value={selectedFilter}
                            onChange={(value) =>
                              handleFilterChange(config.title, value)
                            }
                            options={filterOptions["Demographic"]}
                            sx={{ width: 120, height: "30px" }}
                          />
                        )}
                      </Stack>

                      <CommonChart
                        data={chartData}
                        title={config.chartTitle}
                        subtitle={subtitle}
                      />
                      <ChartLegend data={chartData} />
                    </StyledVerificationCard>
                  </Grid2>
                );
              })}
            </Grid2>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
