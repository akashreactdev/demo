"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GridColDef } from "@mui/x-data-grid";
import { styled, useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Grid2";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import OverviewCard from "@/components/Cards/Overview";
import CommonTable from "@/components/CommonTable";
import {
  getAllClinical,
  getClinicalSummary,
  removeClinical,
  // updateClinical,
} from "@/services/api/clinicalApi";
import moment from "moment";
import Image from "next/image";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";
import { AccountStatusMap } from "@/constants/carersData";
import { AdminClinicalPermission } from "@/constants/accessData";
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

interface ClinicalSummaryData {
  averageRate: null | number;
  averageResponseRate: number;
  totalActiveJobs: number;
  totalClinical: number;
}

interface ClinicalSummaryResponse {
  data: {
    data: ClinicalSummaryData;
    success: boolean;
  };
}

interface ClincialData {
  status: string;
  userId: string;
  usersInfo: {
    createdAt: string;
    firstName: string;
    lastName: string;
  };
  verificationStatus: string;
  _id: string;
}

interface ClinicalListResponse {
  data: {
    success: boolean;
    message: string;
    data: ClincialData[];
    meta: {
      totalDocs: number;
    };
  };
}

interface RemoveClinicalResponse {
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

export interface ClinicalPermissionsState {
  viewClinicalDetails: boolean;
  verifyNewClinicalDetails: boolean;
  viewClinicalPaymentDispute: boolean;
}

const Overview: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clinicalSummary, setClinicalSummary] =
    useState<ClinicalSummaryData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [clinicaldata, setClinicalData] = useState<ClincialData[]>([]);
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );
  const [clinicalPermissionsState, setClinicalPermissionsState] =
    useState<ClinicalPermissionsState>({
      viewClinicalDetails: false,
      verifyNewClinicalDetails: false,
      viewClinicalPaymentDispute: false,
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
    const savedPermissions = localStorage.getItem("clinicalPermissions");
    if (savedPermissions) {
      try {
        const parsed: number[] = JSON.parse(savedPermissions);
        setClinicalPermissionsState({
          viewClinicalDetails: parsed.includes(
            AdminClinicalPermission.VIEW_CLINICAL_DETAILS
          ),
          verifyNewClinicalDetails: parsed.includes(
            AdminClinicalPermission.VERIFY_NEW_CLINICAL_DETAILS
          ),
          viewClinicalPaymentDispute: parsed.includes(
            AdminClinicalPermission.VIEW_CLINICAL_PAYMENT_DISPUTE
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

    fetchClinicalList(
      currentPage,
      savedSearch,
      filters?.accountStatus,
      filters?.dateFilter
    );
    fetchClinicalSummary();
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
        fetchClinicalList(
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
        fetchClinicalList(
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

  const fetchClinicalList = async (
    page: number,
    searchQuery?: string,
    accountStatus?: string | number | null,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllClinical({
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
      })) as ClinicalListResponse;
      if (response?.data?.success) {
        setClinicalData(response?.data?.data);
        setTotalItems(response?.data?.meta.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClinicalSummary = async () => {
    try {
      const response = (await getClinicalSummary()) as ClinicalSummaryResponse;
      if (response?.data?.success) {
        setClinicalSummary(response?.data?.data);
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
      if (clinicalPermissionsState?.viewClinicalDetails) {
        navigateWithLoading(`/clinical/overview/profile/${row}`);
      } else {
        setIsPermissionModalOpen(true);
        // console.log("you have no permission");
      }
    } else if (cindex === 1) {
      // onPauseClinicalAccount(row);
    } else if (cindex === 2) {
      onRemoveClinicalAccount(row);
    }
    handleClose();
  };

  // const onPauseClinicalAccount = async (id: string) => {
  //   try {
  //     const response = (await updateClinical(id)) as PauseClinicalResponse;
  //     if (response?.data?.success) {
  //       toast.success(response?.data?.message);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const onRemoveClinicalAccount = async (id: string) => {
    try {
      const response = (await removeClinical(id)) as RemoveClinicalResponse;
      if (response?.data?.success) {
        fetchClinicalList(currentPage);
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

  const actionItems: ActionItem[] = [{ label: "View profile", value: "view" }];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "User name",
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
                params?.row?.profile != "Clinicial/profile" &&
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
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.approvedBy && params?.row?.approvedBy) || "---"}
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
            {params?.row?.responseRate || "---"}
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
            {params?.row?.activeJobs || "---"}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 140,
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
                  handleActionItemClick(params?.row?.clinicalId, index)
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
            path={"/assets/svg/carers/overview/man_woman.svg"}
            alt={"man_woman"}
            title={"Total clinicals"}
            count={
              clinicalSummary?.totalClinical === 0
                ? "0"
                : clinicalSummary?.totalClinical
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/currency_pound.svg"}
            alt={"man_woman"}
            title={"Average rate"}
            count={
              clinicalSummary?.averageRate === 0
                ? "£0"
                : clinicalSummary?.averageRate
                ? `£${clinicalSummary?.averageRate}`
                : "N/A"
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/response_rate.svg"}
            alt={"man_woman"}
            title={"Average response rate"}
            count={
              clinicalSummary?.averageResponseRate === 0
                ? "0"
                : `${clinicalSummary?.averageResponseRate}`
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/total_agreements.svg"}
            alt={"man_woman"}
            title={"Total active jobs"}
            count={
              clinicalSummary?.totalActiveJobs === 0
                ? "0"
                : clinicalSummary?.totalActiveJobs
            }
          />
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={clinicaldata}
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
