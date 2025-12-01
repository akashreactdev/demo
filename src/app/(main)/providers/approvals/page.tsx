"use client";
import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonTable from "@/components/CommonTable";
import CommonTabs from "@/components/CommonTabs";
import { getAllProvider } from "@/services/api/providerApi";
import moment from "moment";
import { UserStatus } from "@/constants/providerData";
import { useRouterLoading } from "@/hooks/useRouterLoading";

type LegalSignedStatus = "Pending" | "Approved" | "Declined" | "Review";

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

const statusBgColor: Record<LegalSignedStatus, string> = {
  Pending: "#f9d8353e",
  Approved: "#C8E4C0",
  Declined: "#F4A6A6",
  Review: "#e8daef",
};

const statusTitleColor: Record<LegalSignedStatus, string> = {
  Pending: "#F9D835",
  Approved: "#6A9F69",
  Declined: "#9C3C3C",
  Review: "#33233b",
};

interface ProviderData {
  _id: string;
  approvedBy: string | null;
  businessName: string | null;
  businessLogo: string | null;
  dateApproved: string | null;
  engagementRate: number;
  responseRate: number;
  typeOfProvider: string | null;
  usersInfo: {
    firstName: string;
    lastName: string;
    createdAt: string;
  };
}

interface ProviderListResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      results: ProviderData[];
      meta: {
        totalDocs: number;
      };
    };
  };
}

const Approvals: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
const { navigateWithLoading } = useRouterLoading();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providerData, setProviderData] = useState<ProviderData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);

  useEffect(() => {
    fetchAllProviders(currentPage);
  }, [currentPage]);

  const fetchAllProviders = async (page: number, status?: number | null) => {
    setIsLoading(true);
    try {
      const response = (await getAllProvider({
        limit: rowsPerPage,
        page: page + 1,
        status: status,
      })) as ProviderListResponse;
      if (response?.data?.success) {
        setProviderData(response?.data?.data?.results);
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

  const handleActionItemClick = (row: ProviderData) => {
    console.log(`Row ID: ${row._id}`);
    navigateWithLoading("/providers/approvals/profile");
  };

  const columns: GridColDef[] = [
    {
      field: "provider",
      headerName: "Provider",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.firstName}&nbsp;
            {params?.row?.usersInfo?.lastName}
          </Typography>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.createdAt
              ? moment(params?.row?.usersInfo?.createdAt).format(
                  "MMM D, YYYY, hh:mma"
                )
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
      field: "typeOfProvider",
      headerName: "Type",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.typeOfProvider?.[0].name || "N/A"}
          </Typography>
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
            {params?.row?.usersInfo?.dateApproved
              ? moment(params?.row?.usersInfo?.dateApproved).format(
                  "MMM D, YYYY, hh:mma"
                )
              : "N/A"}
          </Typography>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const statusNumber = params.row.usersInfo.status;
        const legalStatus = UserStatus[
          statusNumber as UserStatus
        ] as LegalSignedStatus;
        const bgColor = statusBgColor[legalStatus] || "#E0E0E0";
        const titleColor = statusTitleColor[legalStatus] || "#000000";
        const statusValue = UserStatus[statusNumber as UserStatus];

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {statusValue}
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
              fetchAllProviders(currentPage);
            } else if (tab === "Awaiting approval") {
              fetchAllProviders(currentPage, 7);
            } else if (tab === "Approved") {
              fetchAllProviders(currentPage, 3);
            }
          }}
        />
      </Box>
      <Box mt={1}>
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
    </Box>
  );
};

export default Approvals;
