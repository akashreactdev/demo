"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, Menu, MenuItem } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { styled, useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import OverviewCard from "@/components/Cards/Overview";
import CommonTable from "@/components/CommonTable";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import {
  getAllPassportList,
  getAllPassportSummary,
} from "@/services/api/carerApi";
import { PassportStatus } from "@/constants/carersData";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";

interface ActionItem {
  label: string;
  value: "viewpassport" | "viewcount";
}

interface StyledChipProps {
  isBgColor?: string;
}

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

export interface PassportUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface PassportApprover {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface PassportData {
  _id: string;
  userId: string;
  passportId: string;
  isDetailsCompleted: boolean;
  isDocsCompleted: boolean;
  isContactsCompleted: boolean;
  isReferencesCompleted: boolean;
  status: number;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  approvedBy: string | null;
  user: PassportUser;
  approver: PassportApprover;
  accessData: [];
  linkUsed: number;
  lastViewedAt: string | null;
}

interface PassportListResponse {
  data: {
    success: boolean;
    message: string;
    data: PassportData[];

    meta: {
      totalDocs: number;
    };
  };
}

interface PassportSummaryData {
  totalPassport: null | number;
  activePassport: number | null;
  totalLinkUsed: number | null;
  totalDownloads: number | null;
}

interface PassportSummary {
  data: {
    data: PassportSummaryData;
    success: boolean;
  };
}

const RecruitmentPassport: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [passportData, setPassportData] = useState<PassportData[]>([]);
  const [passportSummaryInfo, setPassportSummaryInfo] =
    useState<PassportSummaryData | null>(null);
  const [rowsPerPage] = useState<number>(10);
  const { navigateWithLoading } = useRouterLoading();
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setlastFilters(filters);
    setLastSearchValue(savedSearch);
    fetchAllPassportList(currentPage, savedSearch, lastFilters?.passportStatus, lastFilters?.dateFilter);
    fetchAllPassportSummary();
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
        fetchAllPassportList(
          currentPage,
          currentSearchValue,
          currentFilters?.passportStatus,
          currentFilters?.dateFilter
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, currentPage, lastFilters]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setLastSearchValue(newSearchValue);
        setlastFilters(newFilters);
        fetchAllPassportList(
          currentPage,
          newSearchValue,
          newFilters?.passportStatus,
          newFilters?.dateFilter
        );
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const statusLabels: Record<PassportStatus, string> = {
    [PassportStatus.Pending]: "Pending",
    [PassportStatus.UnderReview]: "Under review",
    [PassportStatus.PassportIssued]: "Passport Issued",
    [PassportStatus.Declined]: "Declined",
  };

  const statusBgColor: Record<PassportStatus, string> = {
    [PassportStatus.Pending]: theme.pending.background.primary,
    [PassportStatus.UnderReview]: theme.pending.background.primary,
    [PassportStatus.PassportIssued]: theme.accepted.background.primary,
    [PassportStatus.Declined]: theme.declined.background.primary,
  };

  const statusTitleColor: Record<PassportStatus, string> = {
    [PassportStatus.Pending]: theme.pending.main,
    [PassportStatus.UnderReview]: theme.pending.main,
    [PassportStatus.PassportIssued]: theme.accepted.main,
    [PassportStatus.Declined]: theme.declined.main,
  };

  const actionItems: ActionItem[] = [
    { label: "View Passport", value: "viewpassport" },
    { label: "View count", value: "viewcount" },
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const fetchAllPassportList = async (
    page: number,
    searchQuery?: string,
    status?: string | number | null,
    dateJoined?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllPassportList({
        limit: rowsPerPage,
        page: page + 1,
        ...(status && { status: status }),
        ...(dateJoined && { dateJoined: dateJoined }),
        search: searchQuery,
      })) as PassportListResponse;
      if (response?.data?.success) {
        setPassportData(response?.data?.data);
        setTotalItems(response?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPassportSummary = async () => {
    try {
      const response = (await getAllPassportSummary()) as PassportSummary;
      if (response?.data?.success) {
        setPassportSummaryInfo(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Carer name",
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
                params?.row?.user?.profile != "image/superAdmin/profileImage" &&
                params?.row?.user?.profile != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${params?.row?.user?.profile}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={32}
              width={32}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="body1">
              {params?.row?.user?.firstName + " " + params?.row?.user?.lastName}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "date",
      headerName: "Date Created",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.createdAt &&
              moment(params?.row?.createdAt).format("DD.MM.YYYY")) ||
              "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const status = params.row.status as PassportStatus;
        const bgColor =
          statusBgColor[status] || theme.inProgress.background.third;
        const titleColor =
          statusTitleColor[status] || theme.palette.common.black;

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {statusLabels[status] || "N/A"}
              </Typography>
            </StyledChip>
          </Box>
        );
      },
    },
    {
      field: "totalViewCount",
      headerName: "Link Used",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.updatedAt &&
              moment(params?.row?.updatedAt).format("DD.MM.YYYY")) ||
              "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "lastViewedAt",
      headerName: "Last Viewed",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.lastViewedAt &&
              moment(params?.row?.lastViewedAt).format("DD.MM.YYYY")) ||
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
                onClick={() => handleActionItemClick(params?.row?.userId, index)}
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
  ];

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (row: string, cindex: number) => {
    if (cindex === 0) {
      navigateWithLoading(`/carers/recruitment-passport/${row}/view-passport`);
    } else if (cindex === 1) {
      navigateWithLoading(`/carers/recruitment-passport/${row}/view-count`);
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/man_woman.svg"}
            alt={"man_woman"}
            title={"Total passport created"}
            count={
              passportSummaryInfo?.totalPassport === 0
                ? "0"
                : passportSummaryInfo?.totalPassport
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/currency_pound.svg"}
            alt={"currency_pound"}
            title={"Total active passports"}
            count={
              passportSummaryInfo?.activePassport === 0
                ? "0"
                : passportSummaryInfo?.activePassport
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/messages_people.svg"}
            alt={"man_woman"}
            title={"Link-use count"}
            count={
              passportSummaryInfo?.totalLinkUsed === 0
                ? "0"
                : passportSummaryInfo?.totalLinkUsed
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/job_choose_candidate.svg"}
            alt={"job_choose_candidate"}
            title={"Downloaded PDF’s"}
            count={
              passportSummaryInfo?.totalDownloads === 0
                ? "0"
                : passportSummaryInfo?.totalDownloads
            }
          />
        </Grid2>
      </Grid2>
      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={passportData}
          isPaginations
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default RecruitmentPassport;
