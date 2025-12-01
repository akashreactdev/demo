"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import moment from "moment";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import OverviewCard from "@/components/Cards/Overview";
import {
  getAllCarerList,
  getAllCarerSummary,
  removeCarer,
  // updateCarer,
} from "@/services/api/carerApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { AccountStatusMap } from "@/constants/carersData";
import { AdminCarerPermission } from "@/constants/accessData";
import SelectCancelModal from "@/components/CommonModal";

type AccountStatus = "Pending" | "Active" | "Deactivated" | "Under review";

const statusMap: Record<number, AccountStatus> = {
  1: "Pending",
  6: "Deactivated",
  3: "Active",
  5: "Under review",
};

interface StyledChipProps {
  isBgColor?: string;
}

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

interface CarerData {
  _id: string;
  userId: string;
  ratePerHours: number | null;
  photo: string | null;
  responseRate: number | null;
  approvedBy: string | null;
  completedJobs: number | null;
  activeJobs: number | null;
  usersInfo: {
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface CarerListResponse {
  data: {
    success: boolean;
    message: string;
    data: CarerData[];
    meta: {
      totalDocs: number;
    };
  };
}

interface CarerSummaryData {
  averageRate: null | number;
  averageResponseRate: number;
  totalActiveJobs: number;
  totalCarer: number;
}

interface CarerSummary {
  data: {
    data: CarerSummaryData;
    success: boolean;
  };
}

// interface PauseCarerResponse {
//   data: {
//     success: boolean;
//     message: string;
//   };
// }

interface RemoveCarerResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "80%",
  paddingBlock: "10px",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
}));

export interface CarerPermissionsState {
  viewCarerDetails: boolean;
  verifyNewCarerDetails: boolean;
  viewCarerPaymentDispute: boolean;
}

const Overview: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [carerData, setCarerData] = useState<CarerData[]>([]);
  const [carerSummaryInfo, setCarerSummmaryInfo] =
    useState<CarerSummaryData | null>(null);
  const { navigateWithLoading } = useRouterLoading();
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );
  const [carerPermissionsState, setCarerPermissionsState] =
    useState<CarerPermissionsState>({
      viewCarerDetails: false,
      verifyNewCarerDetails: false,
      viewCarerPaymentDispute: false,
    });
  const [isPermissionModalOpen, setIsPermissionModalOpen] =
    useState<boolean>(false);

  const accountStatusBgColor: Record<AccountStatus, string> = {
    Pending: theme.pending.background.primary,
    Active: theme.accepted.background.primary,
    Deactivated: theme.declined.background.primary,
    "Under review": theme.pending.background.primary,
  };

  const accountStatusTitleColor: Record<AccountStatus, string> = {
    Pending: theme.pending.main,
    Active: theme.accepted.main,
    Deactivated: theme.declined.main,
    "Under review": theme.pending.main,
  };

  // set permission from local
  useEffect(() => {
    const savedPermissions = localStorage.getItem("carerPermissions");
    if (savedPermissions) {
      try {
        const parsed: number[] = JSON.parse(savedPermissions);
        setCarerPermissionsState({
          viewCarerDetails: parsed.includes(
            AdminCarerPermission.VIEW_CARER_DETAILS
          ),
          verifyNewCarerDetails: parsed.includes(
            AdminCarerPermission.VERIFY_NEW_CARER_DETAILS
          ),
          viewCarerPaymentDispute: parsed.includes(
            AdminCarerPermission.VIEW_CARER_PAYMENT_DISPUTE
          ),
        });
      } catch (err) {
        console.error(
          "Failed to parse carerPermissions from localStorage",
          err
        );
      }
    }
  }, []);

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);

    fetchAllCarerList(
      currentPage,
      savedSearch,
      filters?.accountStatus,
      filters?.dateFilter
    );
    fetchAllCarerSummary();
  }, [currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentSearchValue = localStorage.getItem("search") || "";
      const currentFilters = getSelectedFilters();

      const prevFiltersStr = JSON.stringify(lastFilters);
      const currFiltersStr = JSON.stringify(currentFilters);
      if (
        currentSearchValue !== lastSearchValue ||
        prevFiltersStr !== currFiltersStr
      ) {
        setLastSearchValue(currentSearchValue);
        setlastFilters(currentFilters);
        fetchAllCarerList(
          currentPage,
          currentSearchValue,
          currentFilters?.accountStatus,
          currentFilters?.dateFilter
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, currentPage, lastFilters]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search" || e.key === "selectedFilters") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setLastSearchValue(newSearchValue);
        setlastFilters(newFilters);
        fetchAllCarerList(
          currentPage,
          newSearchValue,
          newFilters?.accountStatus,
          newFilters?.dateFilter
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const fetchAllCarerList = async (
    page: number,
    searchQuery?: string,
    accountStatus?: string | number | null,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllCarerList({
        limit: rowsPerPage,
        page: page + 1,
        search: searchQuery,
        ...(accountStatus && {
          accountStatus: Number(
            Object.keys(AccountStatusMap).find(
              (k) => AccountStatusMap[+k] === accountStatus
            )
          ),
        }),
        ...(dateJoined && { dateJoined: dateJoined }),
      })) as CarerListResponse;
      if (response?.data?.success) {
        setCarerData(response?.data?.data);
        setTotalItems(response?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCarerSummary = async () => {
    try {
      const response = (await getAllCarerSummary()) as CarerSummary;
      if (response?.data?.success) {
        setCarerSummmaryInfo(response?.data?.data);
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

  const handleActionItemClick = (row: string, cindex: number) => {
    if (cindex === 0) {
      if (carerPermissionsState?.viewCarerDetails) {
        navigateWithLoading(`/carers/overview/profile/${row}`);
      } else {
        setIsPermissionModalOpen(true);
        // console.log("you have no permission");
      }
    } else if (cindex === 1) {
      // onPauseCarerAccount(row);
    } else if (cindex === 2) {
      onRemoveCarerAccount(row);
    }
    handleClose();
  };

  // const onPauseCarerAccount = async (id: string) => {
  //   try {
  //     const response = (await updateCarer(id)) as PauseCarerResponse;
  //     if (response?.data?.success) {
  //       toast.success(response?.data?.message);
  //       fetchAllCarerList(currentPage);
  //       fetchAllCarerSummary();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const onRemoveCarerAccount = async (id: string) => {
    try {
      const response = (await removeCarer(id)) as RemoveCarerResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllCarerList(currentPage);
        fetchAllCarerSummary();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const actionItems: ActionItem[] = [{ label: "View profile", value: "view" }];

  const columns: GridColDef[] = [
    {
      field: "carerName",
      headerName: "User name",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        return (
          <Stack
            flexDirection={"row"}
            justifyContent={"start"}
            alignItems={"center"}
            gap={2}
          >
            <Image
              src={
                params?.row?.profile != "image/carer" &&
                params?.row?.profile != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${params?.row?.profile}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={32}
              width={32}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="body1">
              {params?.row?.firstName && params?.row?.lastName
                ? `${params.row.firstName} ${params.row.lastName}`
                : "N/A"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "dateApproved",
      headerName: "Date approved",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.dateApproved &&
              moment(params?.row?.dateApproved).format("DD.MM.YYYY")) ||
              "---"}
          </Typography>
        );
      },
    },
    {
      field: "approvedBy",
      headerName: "Approved by",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.approvedBy || "---"}
          </Typography>
        );
      },
    },
    {
      field: "lastLogin",
      headerName: "Last login",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.lastLogin &&
              moment(params?.row?.lastLogin).format("DD.MM.YYYY")) ||
              "---"}
          </Typography>
        );
      },
    },
    {
      field: "responseRate",
      headerName: "Response rate",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.responseRate !== undefined &&
            params?.row?.responseRate !== null
              ? params?.row?.responseRate
              : "---"}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Account Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const statusKey = params.row.status as number;
        const legalStatus = statusMap[statusKey];
        const bgColor =
          accountStatusBgColor[legalStatus] ||
          theme.inProgress.background.third;
        const titleColor =
          accountStatusTitleColor[legalStatus] || theme.palette.common.black;

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {legalStatus || "N/A"}
              </Typography>
            </StyledChip>
          </Box>
        );
      },
    },
    {
      field: "activeJobs",
      headerName: "Active jobs",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.activeJobs || "0"}
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
              backgroundColor: theme.inProgress.background.fourth,
              color: theme.palette.common.black,
              textTransform: "none",
              borderRadius: "8px",
              minWidth: "100px",
              height: "30px",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: theme.inProgress.background.fifth,
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
            {actionItems.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() =>
                  handleActionItemClick(params?.row?.carerId, index)
                }
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
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/total_users.svg"}
            alt={"man_woman"}
            title={"Total carers"}
            count={
              carerSummaryInfo?.totalCarer === 0
                ? "0"
                : carerSummaryInfo?.totalCarer
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/currency_pound.svg"}
            alt={"currency_pound"}
            title={"Avrage rate"}
            count={
              carerSummaryInfo?.averageRate === 0
                ? "£0"
                : carerSummaryInfo?.averageRate &&
                  `£${carerSummaryInfo.averageRate}`
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/response_rate.svg"}
            alt={"man_woman"}
            title={"Average response rate"}
            count={
              carerSummaryInfo?.averageResponseRate === 0
                ? "0"
                : `${carerSummaryInfo?.averageResponseRate}`
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/total_agreements.svg"}
            alt={"job_choose_candidate"}
            title={"Total active jobs"}
            count={
              carerSummaryInfo?.totalActiveJobs === 0
                ? "0"
                : carerSummaryInfo?.totalActiveJobs
            }
          />
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={carerData}
          isPaginations
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
        />
      </Box>
      <SelectCancelModal
        title="Message"
        question={`You don't have right to access this feature. Please ask the support team to update your rights.`}
        buttonText="Done"
        isOpen={isPermissionModalOpen}
        isCancelButtonShow={false}
        onRemove={() => setIsPermissionModalOpen(false)}
      />
    </Box>
  );
};

export default Overview;
