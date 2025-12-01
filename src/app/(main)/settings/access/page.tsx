"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { GridColDef } from "@mui/x-data-grid";
import { Button, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import OverviewCard from "@/components/Cards/Overview";
import CommonTable from "@/components/CommonTable";
import ReasonForDeclineModal from "@/components/carers/profile/ReasonForDeclineModal";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { getAllAccessAdminsList } from "@/services/api/settingsAPI";
import moment from "moment";
import { userType } from "@/constants/accessData";
import { DateFilterOptions } from "@/constants/usersData";

type AccountStatus =
  | "Pending"
  | "Active"
  | "Deactivated"
  | "Under review"
  | "Suspended";

const statusMap: Record<number, AccountStatus> = {
  1: "Pending",
  6: "Deactivated",
  3: "Active",
  5: "Under review",
  8: "Suspended",
};

export interface User {
  _id: string;
  userName: string;
  userType: number;
  lastLogin: string;
  status: number;
  profile: string | null;
  createdAt: string;
}

export interface Statistics {
  totalAccounts: number;
  superAdminCount: number;
  adminCount: number;
  suspendedCount: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UsersData {
  users: User[];
  totalDocs: number;
  statistics: Statistics;
  pagination: Pagination;
}

export interface UsersResponse {
  data: {
    success: boolean;
    message: string;
    data: UsersData;
  };
}

interface StyledChipProps {
  isBgColor?: string;
}

const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "50%",
  paddingBlock: "10px",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

interface ActionItem {
  label: string;
  value: "view";
}

const Access: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [adminSummary, setAdminSummary] = useState<Statistics | null>(null);
  const [adminData, setAdminData] = useState<User[]>([]);
  const { navigateWithLoading } = useRouterLoading();
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );
  const [isreasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);

  const accountStatusBgColor: Record<AccountStatus, string> = {
    Pending: theme.pending.background.primary,
    Active: theme.accepted.background.primary,
    Deactivated: theme.declined.background.primary,
    "Under review": theme.pending.background.primary,
    Suspended: theme.declined.background.primary,
  };

  const accountStatusTitleColor: Record<AccountStatus, string> = {
    Pending: theme.pending.main,
    Active: theme.accepted.main,
    Deactivated: theme.declined.main,
    "Under review": theme.pending.main,
    Suspended: theme.declined.main,
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);

    fetchAllCarerList(
      currentPage,
      savedSearch,
      filters?.accessAccountStatus,
      filters?.accessUserType,
      filters?.dateFilter
    );
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
          currentFilters?.accessAccountStatus,
          currentFilters?.accessUserType,
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
          newFilters?.accessAccountStatus,
          newFilters?.accessUserType,
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
    accessAccountStatus?: string | number | null,
    accessUserType?: string | number | null,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllAccessAdminsList({
        limit: rowsPerPage,
        page: page + 1,
        search: searchQuery,
        ...(accessAccountStatus && {
          accountStatus: accessAccountStatus,
        }),
        ...(accessUserType && {
          role: accessUserType,
        }),
        ...(dateJoined && {
          dateFilter: DateFilterOptions.find((opt) => opt.value === dateJoined)
            ?.id,
        }),
      })) as UsersResponse;
      if (response?.data?.success) {
        setAdminData(response?.data?.data?.users);
        setTotalItems(response?.data?.data?.totalDocs);
        setAdminSummary(response?.data?.data?.statistics);
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

  const handleActionItemClick = (row: User, idx: number) => {
    console.log(` Row ID: ${row._id}`);
    if (idx === 2) {
      setIsReasonModalOpen(true);
    } else {
      navigateWithLoading(`/settings/access/${row._id}`);
      handleClose();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/setting/multiple_account.svg",
        title: "Total accounts",
        count:
          adminSummary?.totalAccounts !== null &&
          adminSummary?.totalAccounts !== undefined
            ? adminSummary?.totalAccounts === 0
              ? "0"
              : adminSummary?.totalAccounts
            : "N/A",
      },
      {
        icon: "/assets/svg/setting/multiple_super_admin_count.svg",
        title: "Super admin count",
        count:
          adminSummary?.superAdminCount !== null &&
          adminSummary?.superAdminCount !== undefined
            ? adminSummary?.superAdminCount === 0
              ? "0"
              : adminSummary?.superAdminCount
            : "N/A",
      },
      {
        icon: "/assets/svg/setting/multiple_super_admin_count.svg",
        title: "Admin count",
        count:
          adminSummary?.adminCount !== null &&
          adminSummary?.adminCount !== undefined
            ? adminSummary?.adminCount === 0
              ? "0"
              : adminSummary?.adminCount
            : "N/A",
      },
      {
        icon: "/assets/svg/setting/shield.svg",
        title: "Suspended",
        count:
          adminSummary?.suspendedCount !== null &&
          adminSummary?.suspendedCount !== undefined
            ? adminSummary?.suspendedCount === 0
              ? "0"
              : adminSummary?.suspendedCount
            : "N/A",
      },
    ];
  }, [adminSummary]);

  const actionItems: ActionItem[] = [{ label: "View profile", value: "view" }];

  const columns: GridColDef[] = [
    {
      field: "name",
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
              {params?.row?.userName || "-"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "type",
      headerName: "User type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {userType[Number(params?.row?.userType)] || "-"}
          </Typography>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date joined",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.createdAt &&
              moment(params?.row?.createdAt).format("DD.MM.YYYY")) ||
              "---"}
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
      field: "status",
      headerName: "Status",
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
                onClick={() => handleActionItemClick(params.row, idx)}
                sx={{
                  color: idx === 2 ? theme.declined.main : "inherit",
                }}
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
  ];

  const onCloseReasonModal = () => {
    setIsReasonModalOpen(false);
    handleClose();
  };

  const onClickSaveBtnInModal = (value: string) => {
    console.log(value, "reason");
    setIsReasonModalOpen(false);
  };

  return (
    <Box>
      <Box>
        <Grid2 container spacing={2}>
          {data.map((ele, index) => {
            return (
              <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
                <OverviewCard
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

      <CommonCard sx={{ mt: 3 }}>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          spacing={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Manage access to the Zorbee Health admin panel
            </Typography>
            <Typography variant="caption" fontWeight={400} component={"p"}>
              Here is where you can add new Zorbee admins, sub-admins, or staff
              with limited access.
            </Typography>
          </Box>
          <CommonButton
            buttonText="Add user"
            sx={{ width: isMobile ? "100%" : "max-content" }}
            onClick={() => navigateWithLoading("/settings/access/new-user")}
            buttonTextStyle={{ fontSize: "14px !important" }}
          />
        </Stack>
      </CommonCard>

      <ReasonForDeclineModal
        isOpen={isreasonModalOpen}
        onClick={onClickSaveBtnInModal}
        onClose={onCloseReasonModal}
        value={""}
        title={"Reason for suspension"}
        description={"Reason why this account is being <br />suspended"}
      />
      <Box mt={3}>
        <Box mt={2}>
          <CommonTable
            column={columns}
            rows={adminData}
            isPaginations
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Access;
