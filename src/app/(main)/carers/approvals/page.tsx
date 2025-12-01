"use client";
import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonTable from "@/components/CommonTable";
import CommonTabs from "@/components/CommonTabs";
import { getAllCarerList } from "@/services/api/carerApi";
import moment from "moment";
import { useRouterLoading } from "@/hooks/useRouterLoading";

type LegalSignedStatus = "Pending" | "Approved" | "Declined";

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
    data: {
      results: CarerData[];
      meta: {
        totalDocs: number;
      };
    };
  };
}

const Approvals: React.FC = () => {
  const { navigateWithLoading } = useRouterLoading();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [carerData, setCarerData] = useState<CarerData[]>([]);

  const statusBgColor: Record<LegalSignedStatus, string> = {
    Pending: theme.pending.background.primary,
    Approved: theme.accepted.background.primary,
    Declined: theme.declined.background.primary,
  };

  const statusTitleColor: Record<LegalSignedStatus, string> = {
    Pending: theme.pending.main,
    Approved: theme.accepted.main,
    Declined: theme.declined.main,
  };

  useEffect(() => {
    fetchAllCarerList(currentPage);
  }, [currentPage]);

  const fetchAllCarerList = async (page: number, status?: number | null) => {
    setIsLoading(true);
    try {
      const response = (await getAllCarerList({
        limit: rowsPerPage,
        page: page + 1,
        status: status,
      })) as CarerListResponse;
      if (response?.data?.success) {
        setCarerData(response?.data?.data?.results);
        setTotalItems(response?.data?.data?.meta?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleActionItemClick = (row: CarerData) => {
    console.log(`Row ID: ${row._id}`);
    navigateWithLoading("/carers/approvals/profile");
  };

  const columns: GridColDef[] = [
    {
      field: "carerName",
      headerName: "Carer name",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.firstName &&
            params?.row?.usersInfo?.lastName
              ? `${params.row.usersInfo.firstName} ${params.row.usersInfo.lastName}`
              : "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.usersInfo?.createdAt &&
              moment(params?.row?.usersInfo?.createdAt).format("DD.MM.YYYY")) ||
              "N/A"}
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
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">{params?.row?.type || "N/A"}</Typography>
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
            {(params?.row?.approvedDate &&
              moment(params?.row?.approvedDate).format("DD.MM.YYYY")) ||
              "N/A"}
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
        const legalStatus = params.row.status as LegalSignedStatus;
        const bgColor =
          statusBgColor[legalStatus] || theme.inProgress.background.third;
        const titleColor =
          statusTitleColor[legalStatus] || theme.palette.common.black;

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
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <IconButton size="small">
          <MoreVertIcon onClick={() => handleActionItemClick(params.row)} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Approvals
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          This displays any requested changes from carers that require approval.
        </Typography>
      </CommonCard>

      <Box mt={2}>
        <CommonTabs
          tabContent={["All", "Awaiting approval", "Approved"]}
          selectedTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "All") {
              fetchAllCarerList(currentPage);
            } else if (tab === "Awaiting approval") {
              fetchAllCarerList(currentPage, 7);
            } else if (tab === "Approved") {
              fetchAllCarerList(currentPage, 3);
            }
          }}
        />
      </Box>
      <Box mt={1}>
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
    </Box>
  );
};

export default Approvals;
