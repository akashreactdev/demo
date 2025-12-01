"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { styled, useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
//relative path imports
import CommonTable from "@/components/CommonTable";
import { UserBases } from "@/constants/usersData";

type Status = "Suspended" | "Active";

const statusMap: Record<number, Status> = {
  1: "Active",
  2: "Suspended",
};

export interface User {
  id: number;
  userName: string;
  userType: number; // enum UserBases thi
  dateAdded: string;
  careServices: number;
  lastActive: string;
  status: number;
}

export interface UserApiResponse {
  success: boolean;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
const dummyUserResponse = {
  success: true,
  data: [
    {
      id: 1,
      userName: "Kat Hall",
      userType: 3, // Carers
      dateAdded: "2025-02-05",
      careServices: 6,
      lastActive: "2025-02-05",
      status: 1,
    },
    {
      id: 2,
      userName: "Kat Hall",
      userType: 3,
      dateAdded: "2025-02-05",
      careServices: 11,
      lastActive: "2025-02-05",
      status: 1,
    },
    {
      id: 3,
      userName: "Kate Peacock",
      userType: 2, // Client
      dateAdded: "2025-02-05",
      careServices: 15,
      lastActive: "2025-02-05",
      status: 1,
    },
    {
      id: 4,
      userName: "Kate Peacock",
      userType: 2,
      dateAdded: "2025-02-05",
      careServices: 15,
      lastActive: "2025-02-05",
      status: 2,
    },
    {
      id: 5,
      userName: "Kate Peacock",
      userType: 2,
      dateAdded: "2025-02-05",
      careServices: 15,
      lastActive: "2025-02-05",
      status: 2,
    },
    {
      id: 6,
      userName: "Kate Peacock",
      userType: 3, // Carer
      dateAdded: "2025-02-05",
      careServices: 15,
      lastActive: "2025-02-05",
      status: 1,
    },
    {
      id: 7,
      userName: "Kate Peacock",
      userType: 3,
      dateAdded: "2025-02-05",
      careServices: 15,
      lastActive: "2025-02-05",
      status: 2,
    },
    {
      id: 8,
      userName: "Kate Peacock",
      userType: 3,
      dateAdded: "2025-02-05",
      careServices: 15,
      lastActive: "2025-02-05",
      status: 1,
    },
    {
      id: 9,
      userName: "Kate Peacock",
      userType: 3,
      dateAdded: "2025-02-05",
      careServices: 15,
      lastActive: "2025-02-05",
      status: 2,
    },
    {
      id: 10,
      userName: "Kate Peacock",
      userType: 2,
      dateAdded: "2025-02-05",
      careServices: 15,
      lastActive: "2025-02-05",
      status: 1,
    },
  ],
  meta: {
    total: 12,
    page: 1,
    limit: 12,
    totalPages: 1,
  },
};

interface StyledChipProps {
  isBgColor?: string;
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

const HRManaged: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const statusBgColor: Record<Status, string> = {
    Suspended: theme.declined.background.primary,
    Active: theme.accepted.background.primary,
  };

  const statusTitleColor: Record<Status, string> = {
    Suspended: theme.declined.main,
    Active: theme.accepted.main,
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "User name",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <Stack flexDirection="row" alignItems="center" gap={2}>
          <Image
            src={"/assets/images/profile.jpg"}
            alt="company-logo"
            height={32}
            width={32}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="body1">{params.row.userName}</Typography>
        </Stack>
      ),
    },
    {
      field: "userType",
      headerName: "User type",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body1">
          {UserBases[params.row.userType]}
        </Typography>
      ),
    },

    {
      field: "dateAdded",
      headerName: "Date added",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body1">
          {moment(params.row.dateAdded).format("DD.MM.YYYY")}
        </Typography>
      ),
    },
    {
      field: "careServices",
      headerName: "Carer services",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body1">
          {params.row.careServices || "N/A"}
        </Typography>
      ),
    },
    {
      field: "lastLogin",
      headerName: "Last Active",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body1">
          {moment(params.row.lastLogin).format("DD.MM.YYYY")}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const legalStatus = statusMap[params.row.status];
        const bgColor =
          statusBgColor[legalStatus] || theme.inProgress.background.third;
        const titleColor =
          statusTitleColor[legalStatus] || theme.palette.common.black;

        return (
          <StyledChip isBgColor={bgColor}>
            <Typography variant="caption" fontWeight={500} color={titleColor}>
              {legalStatus}
            </Typography>
          </StyledChip>
        );
      },
    },
  ];

  return (
    <Box>
      <CommonTable
        column={columns}
        rows={dummyUserResponse.data}
        isPaginations
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={dummyUserResponse.meta.total}
        rowsPerPage={rowsPerPage}
      />
    </Box>
  );
};

export default HRManaged;
