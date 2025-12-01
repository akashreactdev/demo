"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import moment from "moment";
import { styled, useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import { Button, Grid2, Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import OverviewCard from "@/components/Cards/Overview";
import CommonTable from "@/components/CommonTable";
import Typography from "@mui/material/Typography";
import {
  getAllProvider,
  getProviderSummary,
  removeProvider,
  // updateProvider,
} from "@/services/api/providerApi";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { ProviderCateogry, ProviderType } from "@/constants/providerData";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { AccountStatusMap } from "@/constants/carersData";
import { AdminProviderPermission } from "@/constants/accessData";
import SelectCancelModal from "@/components/CommonModal";

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

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

interface ProviderData {
  approvedBy: string | null;
  businessName: string | null;
  dateApproved: string | null;
  engagementRate: number;
  responseRate: number;
  typeOfProvider: string | null;
  userId: string;
  usersInfo: {
    firstName: string;
    lastName: string;
  };
  _id: string;
}

interface ProviderListResponse {
  data: {
    success: boolean;
    message: string;
    data: ProviderData[];
    meta: {
      totalDocs: number;
    };
  };
}

interface ProviderSummaryData {
  averageEnagagementRate: number;
  averageRate: number;
  totalProvider: number;
  topProviderType: string;
}

interface ProviderSummaryResponse {
  data: {
    data: ProviderSummaryData;
    success: boolean;
  };
}

// interface ProviderAccountResponse {
//   data: {
//     success: boolean;
//     message: string;
//   };
// }

interface RemoveProviderAccountResponse {
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

export interface ProviderPermissionsState {
  viewProviderDetails: boolean;
  verifyNewProviderDetails: boolean;
  viewProviderPaymentDispute: boolean;
}

const Overview: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providerData, setProviderData] = useState<ProviderData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [providerSummary, setProviderSummary] =
    useState<ProviderSummaryData | null>(null);
  const [rowsPerPage] = useState<number>(10);
  const { navigateWithLoading } = useRouterLoading();
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );
  const [providerPermissionsState, setProviderPermissionsState] =
    useState<ProviderPermissionsState>({
      viewProviderDetails: false,
      verifyNewProviderDetails: false,
      viewProviderPaymentDispute: false,
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

  useEffect(() => {
    const savedPermissions = localStorage.getItem("providerPermissions");
    if (savedPermissions) {
      try {
        const parsed: number[] = JSON.parse(savedPermissions);
        setProviderPermissionsState({
          viewProviderDetails: parsed.includes(
            AdminProviderPermission.VIEW_PROVIDER_DETAILS
          ),
          verifyNewProviderDetails: parsed.includes(
            AdminProviderPermission.VERIFY_NEW_PROVIDER_DETAILS
          ),
          viewProviderPaymentDispute: parsed.includes(
            AdminProviderPermission.VIEW_PROVIDER_PAYMENT_DISPUTE
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

    fetchAllProviders(
      currentPage,
      savedSearch,
      filters?.accountStatus,
      filters?.dateFilter
    );
    fetchProviderSummary();
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
        fetchAllProviders(
          currentPage,
          currentSearchValue,
          currentFilters?.accountStatus,
          currentFilters?.dateFilter
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, lastFilters, currentPage]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search" || e.key === "selectedFilters") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setLastSearchValue(newSearchValue);
        setlastFilters(newFilters);

        fetchAllProviders(
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

  const fetchAllProviders = async (
    page: number,
    searchQuery?: string,
    accountStatus?: string | number | null,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllProvider({
        limit: rowsPerPage,
        page: page + 1,
        // status: 3,
        search: searchQuery,
        ...(accountStatus && {
          accountStatus: Number(
            Object.keys(AccountStatusMap).find(
              (k) => AccountStatusMap[+k] === accountStatus
            )
          ),
        }),
        ...(dateJoined && { dateJoined: dateJoined }),
      })) as ProviderListResponse;
      if (response?.data?.success) {
        setProviderData(response?.data?.data);
        setTotalItems(response?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviderSummary = async () => {
    try {
      const response = (await getProviderSummary()) as ProviderSummaryResponse;
      if (response?.data?.success) {
        setProviderSummary(response?.data?.data);
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
      if (providerPermissionsState?.viewProviderDetails) {
        navigateWithLoading(`/providers/overview/profile/${row}`);
      } else {
        setIsPermissionModalOpen(true);
      }
    } else if (cindex === 1) {
      // onPauseProviderAccount(row);
    } else if (cindex === 2) {
      onRemoveProviderAccount(row);
    }
    handleClose();
  };

  // const onPauseProviderAccount = async (id: string) => {
  //   try {
  //     const response = (await updateProvider(id)) as ProviderAccountResponse;
  //     if (response?.data?.success) {
  //       toast.success(response?.data?.message);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const onRemoveProviderAccount = async (id: string) => {
    try {
      const response = (await removeProvider(
        id
      )) as RemoveProviderAccountResponse;
      if (response?.data?.success) {
        fetchAllProviders(currentPage);
        toast.success(response?.data?.message);
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

  const actionItems: ActionItem[] = [{ label: "View account", value: "view" }];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Provider name",
      flex: 1,
      minWidth: 200,
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
                params?.row?.businessLogo != "image/provider" &&
                params?.row?.businessLogo != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${params?.row?.businessLogo}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={32}
              width={32}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="body1">
              {params?.row?.businessName || "N/A"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "userSubType",
      headerName: "Provider type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const providerTypeValue: number | undefined =
          params?.row?.userSubType?.value;

        const typeName = providerTypeValue
          ? ProviderType[providerTypeValue]
          : "N/A";

        return <Typography variant="body1">{typeName}</Typography>;
      },
    },
    {
      field: "typeOfProvider",
      headerName: "Provider category",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const providers: { value: number }[] =
          params?.row?.typeOfProvider || [];

        const names =
          providers.length > 0
            ? providers.map((p) => ProviderCateogry[p.value]).join(", ")
            : "N/A";

        return <Typography variant="body1">{names}</Typography>;
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
            {params?.row?.dateApproved
              ? moment(params?.row?.dateApproved).format("DD.MM.YYYY")
              : "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "approvedBy",
      headerName: "Approved by",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.approvedBy || "N/A"}
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
            {params?.row?.lastLogin
              ? moment(params?.row?.lastLogin).format("DD.MM.YYYY")
              : "N/A"}
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
            {actionItems.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() =>
                  handleActionItemClick(params?.row?.providerId, index)
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
            alt={"Kitchenware-Molds--Streamline-Ultimate"}
            title={"Total providers"}
            count={
              providerSummary?.totalProvider === 0
                ? "0"
                : providerSummary?.totalProvider
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/currency_pound.svg"}
            alt={"Kitchenware-Molds--Streamline-Ultimate"}
            title={"Average rate"}
            count={
              providerSummary?.averageRate
                ? `£${providerSummary?.averageRate}`
                : "N/A"
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/top_partner_type.svg"}
            alt={"messages_people"}
            title={"Top provider type"}
            count={providerSummary?.topProviderType || "N/A"}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={
              "/assets/svg/provider/overview/Monitor-Heart-Rate-Up--Streamline-Ultimate.svg"
            }
            alt={"Monitor-Heart-Rate-Up--Streamline-Ultimate"}
            title={"Avg engagement rate"}
            count={
              providerSummary?.averageEnagagementRate === 0
                ? "0%"
                : `${providerSummary?.averageEnagagementRate}%`
            }
          />
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={providerData}
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
