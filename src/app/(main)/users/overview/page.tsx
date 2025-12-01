"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import moment from "moment";
import { Button, Menu, MenuItem, Stack } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import OverviewCard from "@/components/Cards/Overview";
//relative api path imports
import {
  getAllUsers,
  getUserSummary,
  removeUSerInfo,
  updateUserInfo,
} from "@/services/api/usersApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { AdminUserPermission } from "@/constants/accessData";
import SelectCancelModal from "@/components/CommonModal";

const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "70%",
  paddingBlock: "10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
}));

type EmailVerifiedStatus = "Pending" | "Verified";
type AccountStatus = "Pending" | "Active" | "Deactivated" | "N/A";

const statusMap: Record<number, AccountStatus> = {
  1: "Pending",
  3: "Active",
  8: "Deactivated",
};

interface StyledChipProps {
  isBgColor?: string;
}

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

interface UserDataProps {
  _id: string;
  userId: string;
  completedCareCount: number | null;
  authType: number;
  firstName: string;
  isEmailVerify: boolean;
  lastName: string;
}

interface UserListResponse {
  data: {
    success: boolean;
    message: string;
    data: UserDataProps[];
    meta: {
      totalDocs: number;
    };
  };
}

interface UserInfoCount {
  totalClient: number;
  activeAccount: number;
  totalCompletedCare: number;
  totalAgreements: number;
}

interface UserSummary {
  data: {
    success: boolean;
    data: UserInfoCount;
  };
}

interface PauseUserInfoResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface RemoveUserInfoResponse {
  data: {
    success: boolean;
    message: string;
  };
}

export interface UserPermissionsState {
  viewUserDetails: boolean;
  deactivateUserAccount: boolean;
  createHealthVideo: boolean;
}

const Overview: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserDataProps[]>([]);
  const [userInfoCount, setUserInfoCount] = useState<UserInfoCount>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );
  const [userPermissionsState, setUserPermissionsState] =
    useState<UserPermissionsState>({
      viewUserDetails: false,
      deactivateUserAccount: false,
      createHealthVideo: false,
    });
  const [isPermissionModalOpen, setIsPermissionModalOpen] =
    useState<boolean>(false);

  const statusBgColor: Record<EmailVerifiedStatus, string> = {
    Pending: theme.pending.background.primary,
    Verified: theme.accepted.background.primary,
  };

  const statusTitleColor: Record<EmailVerifiedStatus, string> = {
    Pending: theme.pending.main,
    Verified: theme.accepted.main,
  };

  const accountStatusBgColor: Record<Exclude<AccountStatus, "N/A">, string> = {
    Pending: theme.pending.background.primary,
    Deactivated: theme.declined.background.primary,
    Active: theme.accepted.background.primary,
  };

  const accountStatusTitleColor: Record<
    Exclude<AccountStatus, "N/A">,
    string
  > = {
    Pending: theme.pending.main,
    Deactivated: theme.declined.main,
    Active: theme.accepted.main,
  };

  useEffect(() => {
    const savedPermissions = localStorage.getItem("userPermissions");
    if (savedPermissions) {
      try {
        const parsed: number[] = JSON.parse(savedPermissions);
        setUserPermissionsState({
          viewUserDetails: parsed.includes(
            AdminUserPermission.VIEW_USER_DETAILS
          ),
          deactivateUserAccount: parsed.includes(
            AdminUserPermission.DEACTIVATE_USER_ACCOUNT
          ),
          createHealthVideo: parsed.includes(
            AdminUserPermission.CREATE_HEALTH_VIDEO
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

    fetchAllUsers(
      currentPage,
      savedSearch,
      filters.accountStatus,
      filters?.emailVerification,
      filters?.dateFilter
    );
    fetchClientSummary();
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
        fetchAllUsers(
          currentPage,
          currentSearchValue,
          currentFilters?.accountStatus,
          currentFilters?.emailVerification,
          currentFilters?.dateFilter
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, currentPage, lastFilters]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "search" ||
        e.key === "filterValue" ||
        e.key === "selectedFilters"
      ) {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setlastFilters(newFilters);

        setLastSearchValue(newSearchValue);

        fetchAllUsers(
          currentPage,
          newSearchValue,
          newFilters.accountStatus,
          newFilters?.emailVerification,
          newFilters?.dateFilter
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const fetchAllUsers = async (
    page: number,
    searchQuery?: string,
    accountStatus?: string | number | null,
    emailVerification?: string | number | null,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllUsers({
        limit: rowsPerPage,
        page: page + 1,
        search: searchQuery,
        ...(accountStatus && { accountStatus: accountStatus }),
        ...(emailVerification && { emailVerification: emailVerification }),
        ...(dateJoined && { dateJoined: dateJoined }),
      })) as UserListResponse;
      if (response?.data?.success) {
        setUserData(response?.data?.data);
        setTotalItems(response?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientSummary = async () => {
    try {
      const response = (await getUserSummary()) as UserSummary;
      if (response?.data?.success) {
        setUserInfoCount(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
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
      if (userPermissionsState?.viewUserDetails) {
        navigateWithLoading(`/users/overview/profile/${row}`);
      } else {
        setIsPermissionModalOpen(true);
      }
    } else if (cindex === 1) {
      onPauseUserAccount(row);
    } else if (cindex === 2) {
      onRemoveUserAccount(row);
    }
    handleClose();
  };

  const onPauseUserAccount = async (id: string) => {
    try {
      const payload = {
        isActive: false,
      };
      const response = (await updateUserInfo(
        id,
        payload
      )) as PauseUserInfoResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllUsers(currentPage);
        fetchClientSummary();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRemoveUserAccount = async (id: string) => {
    try {
      const response = (await removeUSerInfo(id)) as RemoveUserInfoResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllUsers(currentPage);
        fetchClientSummary();
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
      field: "username",
      headerName: "User name",
      flex: 1,
      minWidth: 140,
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
                params?.row?.profile != "image/superAdmin/profileImage" &&
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
              {params?.row?.firstName}&nbsp;
              {params?.row?.lastName}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "dateJoined",
      headerName: "Date joined",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {moment(params?.row?.createdAt).format("DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Last login",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {moment(params?.row?.updatedAt).format("DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "isEmailVerify",
      headerName: "Email verified",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const verifiedStatus = params?.row?.isEmailVerify;
        const isEmailVerify = verifiedStatus ? "Verified" : "Pending";
        const bgColor =
          statusBgColor[isEmailVerify] || theme.inProgress.background.third;
        const titleColor =
          statusTitleColor[isEmailVerify] || theme.palette.common.black;

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor} sx={{ borderRadius: "5px" }}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {isEmailVerify}
              </Typography>
            </StyledChip>
          </Box>
        );
      },
    },
    {
      field: "completedCareCount",
      headerName: "Completed care",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const value = params?.row?.completedCareCount;
        return (
          <Typography variant="body1">
            {value !== null && value !== undefined ? value : "N/A"}
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
        const rawStatus = params?.row?.status as number | null | undefined;
        const statusLabel: AccountStatus = rawStatus
          ? statusMap[rawStatus] ?? "N/A"
          : "N/A";

        const bgColor =
          accountStatusBgColor[
            statusLabel as keyof typeof accountStatusBgColor
          ] ?? theme.inProgress.background.third;

        const titleColor =
          accountStatusTitleColor[
            statusLabel as keyof typeof accountStatusTitleColor
          ] ?? theme.palette.common.black;

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor} sx={{ borderRadius: "5px" }}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {statusLabel}
              </Typography>
            </StyledChip>
          </Box>
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
                  handleActionItemClick(params?.row?.clientId, index)
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
            title={"Total users"}
            count={userInfoCount?.totalClient || "0"}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/total_active_users.svg"}
            alt={"currency_pound"}
            title={"Total active users"}
            count={userInfoCount?.activeAccount || "0"}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/total_completed_care.svg"}
            alt={"messages_people"}
            title={"Total completed care"}
            count={userInfoCount?.totalCompletedCare || "0"}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/total_agreements.svg"}
            alt={"job_choose_candidate"}
            title={"Total agreements"}
            count={userInfoCount?.totalAgreements || "0"}
          />
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={userData}
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
