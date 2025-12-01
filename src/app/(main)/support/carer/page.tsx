"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import Image from "next/image";
import moment from "moment";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Stack from "@mui/material/Stack";
//relative path imports
import CommonTable from "@/components/CommonTable";
import CommonCard from "@/components/Cards/Common";
// import CommonTabs from "@/components/CommonTabs";
import SelectModal from "@/components/CommonSelectModal";
import {
  assignSupportToUser,
  getAllAdminList,
  getAllSupport,
} from "@/services/api/supportApi";
import { IssueType } from "@/constants/supportData";
import { FiltersObjects, getSelectedFilters } from "@/types/singleUserInfoType";

type ProgressStatus = "Pending" | "Resolved" | "In-progress";

type UrgencyLavelStatus = "Low" | "High" | "Medium" | "Critical";

const statusMap: Record<number, ProgressStatus> = {
  1: "Pending",
  2: "In-progress",
  3: "Resolved",
};

const levelMap: Record<number, UrgencyLavelStatus> = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Critical",
};

// const tabToStatusMap: Record<string, number | null> = {
//   All: null,
//   Pending: 1,
//   "In-progress": 2,
//   Resolved: 3,
//   Assigned: 5,
// };

interface StyledChipProps {
  isBgColor?: string;
}

interface ActionItem {
  label: string;
  value: "view" | "assign" | "escalate";
}

interface SupportData {
  _id: string;
  userName: string;
  userEmail: string;
  ticketType: string | number | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface SupportListResponse {
  data: {
    success: boolean;
    message: string;
    data: SupportData[];
    meta: {
      totalDocs: number;
      totalPages: number;
      limit: number;
    };
  };
}

export interface AdminListOptions {
  label: string;
  value: string | number;
  id: string;
}

export interface AdminList {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface AdminListResponse {
  data: {
    success: boolean;
    message: string;
    data: AdminList[];
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

const statusBgColor: Record<ProgressStatus, string> = {
  Pending: "#F9D8351A",
  Resolved: "#C8E4C033",
  "In-progress": "#ECF2FB",
};

const levelBgColor: Record<UrgencyLavelStatus, string> = {
  Low: "#F9D8351A",
  Medium: "#ECF2FB",
  High: "#F4A6A633",
  Critical: "#F4A6A633",
};

const levelTitleColor: Record<UrgencyLavelStatus, string> = {
  Low: "#F6C719",
  Medium: "#518ADD",
  High: "#F87171",
  Critical: "#9C3C3C",
};

const statusTitleColor: Record<ProgressStatus, string> = {
  Pending: "#F6C719",
  Resolved: "#6A9F69",
  "In-progress": "#518ADD",
};

const Overview: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  // const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [SupportListData, setSupportListData] = useState<SupportData[]>([]);
  const [adminList, setAdminList] = useState<AdminListOptions[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string | number | null>(null);
  const [lastSearchValue, setLastSearchValue] = useState<string>("");
  const [lastFilters, setlastFilters] = useState<FiltersObjects>(() =>
    getSelectedFilters()
  );

  // const getCurrentStatus = (): number | null => {
  //   return tabToStatusMap[activeTab] || null;
  // };

  useEffect(() => {
    const savedSearch = localStorage.getItem("search") || "";
    const filters = getSelectedFilters();

    setLastSearchValue(savedSearch);
    setlastFilters(filters);
    fetchCarerSupport(
      currentPage,
      3,
      filters?.supportTicketStatus,
      savedSearch,
      filters?.supportUrgencyLevel,
      filters?.supportDateCreated
    );
    fetchAdminList();
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
        fetchCarerSupport(
          currentPage,
          3,
          currentFilters?.supportTicketStatus,
          currentSearchValue,
          currentFilters?.supportUrgencyLevel,
          currentFilters?.supportDateCreated
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
        fetchCarerSupport(
          currentPage,
          3,
          newFilters?.supportTicketStatus,
          newSearchValue,
          newFilters?.supportUrgencyLevel,
          newFilters?.supportDateCreated
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentPage]);

  const fetchCarerSupport = async (
    page: number,
    userType?: number | null,
    status?: string | number | null,
    searchQuery?: string,
    urgencyLevel?: string | number | null,
    dateCreated?: string | number | null
  ) => {
    setIsLoading(true);
    try {
      const response = (await getAllSupport({
        limit: rowsPerPage,
        page: page + 1,
        status: status,
        userType: userType,
        search: searchQuery,
        ...(urgencyLevel && { urgencyLevel: urgencyLevel }),
        ...(dateCreated && { dateCreated: dateCreated }),
      })) as SupportListResponse;
      if (response?.data?.success) {
        setSupportListData(response?.data?.data);
        setTotalItems(response?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminList = async () => {
    try {
      const response = (await getAllAdminList()) as AdminListResponse;
      if (response?.data?.success) {
        const convertedOptions = response?.data?.data?.map(
          (item: AdminList, index) => ({
            label: `${item.firstName} ${item.lastName}`,
            id: item._id,
            value: index + 1,
          })
        );

        setAdminList(convertedOptions);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (row: SupportData, idx: number) => {
    if (idx === 0) {
      navigateWithLoading(`/support/carer/profile/${row._id}`);
      handleClose();
    }
    if (idx === 1) {
      setAssignModalOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
    setAdminId(null);
  };

  const actionItems: ActionItem[] = [
    { label: "View ticket", value: "view" },
    { label: "Assign ticket", value: "assign" },
    // { label: "Escalate", value: "escalate" },
  ];

  const columns: GridColDef[] = [
    {
      field: "userName",
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
                params?.row?.userImage != "image/carer" &&
                params?.row?.userImage != null
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${params?.row?.userImage}`
                  : `/assets/images/profile.jpg`
              }
              alt="user-profile-pic"
              height={32}
              width={32}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="body1">
              {params?.row?.userName && params?.row?.userName
                ? `${params.row.userName}`
                : "N/A"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "userEmail",
      headerName: "Email address",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "ticketType",
      headerName: "Ticket type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) =>
        typeof params.row.ticketType === "number"
          ? IssueType[params.row.ticketType]
          : IssueType[7],
    },
    {
      field: "urgencyLevel",
      headerName: "Urgency level",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const statusKey = params.row.urgencyLevel as number;
        const status = levelMap[statusKey];
        const bgColor = levelBgColor[status] || "#E0E0E0";
        const titleColor = levelTitleColor[status] || "#000000";

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {status ? status : "N/A"}
              </Typography>
            </StyledChip>
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date created",
      flex: 1,
      minWidth: 140,
      renderCell: (params) =>
        moment(params?.row?.createdAt).format("DD.MM.YYYY"),
      // moment(params.row.createdAt).format("MMM DD, YYYY, hh:mma"),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const statusKey = params.row.status as number;
        const status = statusMap[statusKey];
        const bgColor = statusBgColor[status] || "#E0E0E0";
        const titleColor = statusTitleColor[status] || "#000000";

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {status}
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
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
  ];

  const handleEventClose = () => {
    setAssignModalOpen(false);
    setAdminId(null);
  };

  const handleEventSet = async () => {
    try {
      const payload = {
        supportId: selectedRow,
        userId: adminId,
      };
      const response = (await assignSupportToUser(
        payload
      )) as AdminListResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        handleEventClose();
        handleClose();
        fetchCarerSupport(
          currentPage,
          3,
          lastFilters?.supportTicketStatus,
          lastSearchValue
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEventChange = (value: string | number | null) => {
    if (value !== null) {
      const selectedAdmin = adminList.find((item) => item.value === value);
      if (selectedAdmin) {
        setAdminId(selectedAdmin.id);
      }
    }
  };

  // const handleTabChange = (tab: string) => {
  //   setActiveTab(tab);
  //   setCurrentPage(0);
  // };

  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Carer support tickets
        </Typography>
        <Typography fontSize={"12px"}>
          This displays all logged carer support tickets.
        </Typography>
      </CommonCard>

      <Box mt={4}>
        {/* <CommonTabs
          tabContent={["All", "Pending", "In-progress", "Assigned", "Resolved"]}
          selectedTab={activeTab}
          onTabChange={handleTabChange}
        /> */}
        <Box mt={1}>
          <CommonTable
            column={columns}
            rows={SupportListData}
            isPaginations
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
          />
        </Box>
      </Box>
      {assignModalOpen && (
        <SelectModal
          title="Assign ticket"
          description="Select a sub-admin from the list below to assign this ticket"
          options={adminList}
          isOpen={assignModalOpen}
          onClose={handleEventClose}
          onSet={handleEventSet}
          onChangeEvent={handleEventChange}
        />
      )}
    </Box>
  );
};

export default Overview;
