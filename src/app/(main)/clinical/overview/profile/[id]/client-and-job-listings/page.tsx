"use client";
import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonTable from "@/components/CommonTable";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import { getAllJobs } from "@/services/api/carerApi";
import { CarerProfileData } from "@/types/carerProfileType";
import moment from "moment";
import { CareType } from "@/constants/clinicalData";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";

type ServiceStatusList = "Pending" | "Completed";

interface StyledChipProps {
  isBgColor?: string;
}

export interface ClientListItem {
  agreementId: string;
  status: number;
  endDate: string;
  startDate: string;
  serviceType: number;
  totalAgreements: number;
  userId: string;
  _id: string;
  firstName: string;
  lastName: string;
  profile: string;
  totalVisit: string;
  totalNotes: number;
  paymentStatus: number;
  signOffStatus: string | number;
  isCompleted: boolean;
  isDisputeRaised: boolean;
}

export interface PaginationMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ClientListApiResponse {
  data: {
    success: boolean;
    message: string;
    data: ClientListItem[];
    meta: PaginationMeta;
  };
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

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

interface ParamsProps {
  id: string;
}

const ClientAndJobListings = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const params = useParams() as unknown as ParamsProps;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [carerProfileInfo, setCarerProfileInfo] =
    useState<CarerProfileData | null>(null);
  const [clientListData, setClientListData] = useState<ClientListItem[]>([]);
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  useEffect(() => {
    setIsLoading(false);
    const CarerData = localStorage.getItem("SelectedClinical");
    if (CarerData) {
      try {
        const parsedData = JSON.parse(CarerData);
        if (parsedData) {
          setCarerProfileInfo(parsedData);
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);
    if (carerProfileInfo) {
      fetchActiveJobs(
        currentPage,
        carerProfileInfo?.userId,
        filters?.jobListingStatus,
        savedSearch,
        filters?.dateFilter,
        filters?.careTypeValue
      );
    }
  }, [carerProfileInfo, currentPage]);

  useEffect(() => {
    if (!carerProfileInfo?.userId) return;
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
        fetchActiveJobs(
          currentPage,
          carerProfileInfo?.userId,
          currentFilters?.jobListingStatus,
          currentSearchValue,
          currentFilters?.dateFilter,
          currentFilters?.careTypeValue
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastSearchValue, currentPage, lastFilters]);

  useEffect(() => {
    if (!carerProfileInfo?.userId) return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "search" || e.key === "selectedFilters") {
        const newSearchValue = localStorage.getItem("search") || "";
        const newFilters = getSelectedFilters();
        setlastFilters(newFilters);
        setLastSearchValue(newSearchValue);
        fetchActiveJobs(
          currentPage,
          carerProfileInfo?.userId,
          newFilters?.jobListingStatus,
          newSearchValue,
          newFilters?.dateFilter,
          newFilters?.careTypeValue
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const fetchActiveJobs = async (
    page: number,
    id: string,
    filter?: string | number | null,
    search?: string | null,
    dateJoined?: string | number | null,
    careTypeValue?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllJobs(
        {
          filter: filter,
          limit: rowsPerPage,
          page: page + 1,
          search: search,
          ...(dateJoined && { dateJoined: dateJoined }),
          ...(careTypeValue && { careType: careTypeValue }),
        },
        id
      )) as ClientListApiResponse;
      if (response?.data?.success) {
        setIsLoading(false);
        setClientListData(response?.data?.data);
        setTotalItems(response?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const statusBgColor: Record<ServiceStatusList, string> = {
    Pending: theme.pending.background.primary,
    Completed: theme.accepted.background.primary,
  };

  const statusTitleColor: Record<ServiceStatusList, string> = {
    Pending: theme.pending.paymentPending,
    Completed: theme.accepted.main,
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (action: string, row: ClientListItem) => {
    console.log(`Action: ${action}, Row ID: ${row.userId}`);
    navigateWithLoading(
      `/clinical/overview/profile/${params?.id}/client-and-job-listings/profile/${row.userId}`
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const actionItems: ActionItem[] = [{ label: "View details", value: "view" }];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Client name",
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
      field: "startDate",
      headerName: "Start date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {moment(params?.row?.startDate).format("DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "endDate",
      headerName: "End date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {moment(params?.row?.endDate).format("DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "serviceType",
      headerName: "Care type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const serviceType = CareType[Number(params?.row?.serviceType)];
        return <Typography variant="body1">{serviceType || "N/A"}</Typography>;
      },
    },
    // { field: "totalVisit", headerName: "Visit logs", flex: 1, minWidth: 140 },
    // { field: "totalNotes", headerName: "Care notes", flex: 1, minWidth: 140 },
    {
      field: "serviceStatus",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const serviceStatus: ServiceStatusList = params.row.isCompleted
          ? "Completed"
          : "Pending";
        // const serviceStatus = ServiceStatus[
        //   params.row.serviceType
        // ] as ServiceStatusList;
        const bgColor =
          statusBgColor[serviceStatus] || theme.inProgress.background.third;
        const titleColor =
          statusTitleColor[serviceStatus] || theme.palette.common.black;

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {serviceStatus}
              </Typography>
            </StyledChip>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
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
            {actionItems.map((action, idx) => (
              <MenuItem
                key={idx}
                onClick={() => handleActionItemClick(action.value, params.row)}
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
  ];

  // const formatLastLogin = (dateString: string) => {
  //   if (!dateString) return "N/A";

  //   return moment(dateString).calendar(null, {
  //     sameDay: "[Today at] h:mm A",
  //     lastDay: "[Yesterday at] h:mm A",
  //     lastWeek: "[Last] dddd [at] h:mm A",
  //     sameElse: "DD/MM/YYYY [at] h:mm A",
  //   });
  // };
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
              Client and job listings
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              View a full list of clients, active and completed jobs including
              details of their current care assignments.
            </Typography>
          </Box>
        </Stack>
      </CommonCard>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={clientListData}
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

export default ClientAndJobListings;
