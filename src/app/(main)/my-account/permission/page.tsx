"use client";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CommonTable from "@/components/CommonTable";
import { GridColDef } from "@mui/x-data-grid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";

type Status = "Active" | "In Active";

interface StyledChipProps {
  isBgColor?: string;
}

const StyledChip = styled(Box)<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "40%",
  paddingBlock: "10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const statusBgColor: Record<Status, string> = {
  "In Active": "#F4A6A6",
  Active: "#C8E4C0",
};

const statusTitleColor: Record<Status, string> = {
  "In Active": "#9C3C3C",
  Active: "#6A9F69",
};

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

const data = [
  {
    id: 1,
    userName: "Test",
    role: "PA Carer",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 2,
    userName: "Test",
    role: "User",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 3,
    userName: "Test",
    role: "Provider",
    email: "reubenhale@gmail.com",
    status: "In Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 4,
    userName: "Test",
    role: "PA Carer",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 5,
    userName: "Test",
    role: "PA Carer",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 6,
    userName: "Test",
    role: "PA Carer",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 7,
    userName: "Test",
    role: "PA Carer",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 8,
    userName: "Test",
    role: "PA Carer",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 9,
    userName: "Test",
    role: "PA Carer",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
  {
    id: 10,
    userName: "Test",
    role: "PA Carer",
    email: "reubenhale@gmail.com",
    status: "Active",
    lastLogin: "05.02.2025",
    access: "Full Screen",
  },
];

const Permissions = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems] = useState<number>(10);
  const [rowsPerPage] = useState<number>(10);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const actionItems: ActionItem[] = [
    { label: "View account", value: "view" },
    { label: "Pause account", value: "pause" },
    { label: "Remove account", value: "remove" },
  ];

  const handleActionItemClick = (row: string, cindex: number) => {
    console.log(row, cindex);

    handleClose();
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "User name",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return <Typography variant="body1">{params?.row?.userName}</Typography>;
      },
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return <Typography variant="body1">{params?.row?.role}</Typography>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return <Typography variant="body1">{params?.row?.email}</Typography>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const status = params.row.status as Status;
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
      field: "lastLogin",
      headerName: "Last Login",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">{params?.row?.lastLogin}</Typography>
        );
      },
    },
    {
      field: "access",
      headerName: "Access",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return <Typography variant="body1">{params?.row?.access}</Typography>;
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
          >
            {actionItems.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => handleActionItemClick(params?.row?._id, index)}
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
      <CommonTable
        column={columns}
        rows={data}
        isPaginations
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
      />
    </Box>
  );
};

export default Permissions;
