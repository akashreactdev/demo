"use client";
import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonTable from "@/components/CommonTable";
import CommonTabs from "@/components/CommonTabs";
import { getAllClinical } from "@/services/api/clinicalApi";
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
    data: {
      results: ClincialData[];
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
  const [clinicaldata, setClinicalData] = useState<ClincialData[]>([]);

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
    fetchClinicalList(currentPage);
  }, [currentPage]);

  const fetchClinicalList = async (page: number, status?: number | null) => {
    setIsLoading(true);
    try {
      const response = (await getAllClinical({
        limit: rowsPerPage,
        page: page + 1,
        status: status,
      })) as ClinicalListResponse;
      if (response?.data?.success) {
        setClinicalData(response?.data?.data?.results);
        setTotalItems(response?.data?.data?.meta.totalDocs);
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

  const handleActionItemClick = (row: ClincialData) => {
    console.log(`Row ID: ${row._id}`);
    navigateWithLoading("/clinical/approvals/profile");
  };

  const columns: GridColDef[] = [
    {
      field: "clinicalName",
      headerName: "Clinical name",
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
            {(params?.row?.approvedBy && params?.row?.approvedBy) || "N/A"}
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
            {(params?.row?.dateApproved &&
              moment(params?.row?.dateApproved).format("DD.MM.YYYY")) ||
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
        const bgColor = statusBgColor[legalStatus] || theme.inProgress.background.third;
        const titleColor = statusTitleColor[legalStatus] || theme.palette.common.black;

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
              fetchClinicalList(currentPage);
            } else if (tab === "Awaiting approval") {
              fetchClinicalList(currentPage, 7);
            } else if (tab === "Approved") {
              fetchClinicalList(currentPage, 3);
            }
          }}
        />
      </Box>
      <Box mt={1}>
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
    </Box>
  );
};

export default Approvals;
